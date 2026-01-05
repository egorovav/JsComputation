function Matrix(ring, values, rowCount, colCount) {

	this.ring = ring;
	this.rowCount = rowCount;
	this.colCount = colCount;	
	this.values = [];

	for(var i = 0; i < rowCount; i++) {

		var _row = values[i];
		this.values[i] = [];

		for(var j = 0; j < colCount; j++) {
			
			if(_row != undefined && _row[j] != undefined) {

				this.values[i][j] = _row[j];
			} else {

				this.values[i][j] = ring.zero();
			}
		}
	}

	this.determinant = undefined;
	this.adjugate = undefined;
}

Matrix.prototype.add = function(a) {

	if(this.rowCount !== a.rowCount || this.colCount !== a.colCount) {
		
		throw new SyntaxError("Incorrect input.")
	}

	var _values = [];

	for(var i = 0; i < this.rowCount; i++) {
		
		_values[i] = [];
		for(var j = 0; j < this.colCount; j++) {

			_values[i][j] = this.ring.sum(this.values[i][j], a.values[i][j]);			
		}
	}

	return new Matrix(this.ring, _values, this.rowCount, this.colCount);
}

Matrix.prototype.prod = function(a) {

	if(this.colCount !== a.rowCount) {

		throw new SyntaxError("Incorrect input.")
	}

	var _values = [];
	for(var i = 0; i < this.rowCount; i++) {

		_values[i] = [];
	
		for(var j = 0; j < a.colCount; j++) {
			
			var _ij = this.ring.zero();

			for(var k = 0; k < this.colCount; k++) {

				_ij = this.ring.sum(_ij, this.ring.prod(this.values[i][k], a.values[k][j]));
			}

			_values[i][j] = _ij;
		}
	}
	
	return new Matrix(this.ring, _values, this.rowCount, a.colCount);
}

Matrix.prototype.equals = function(a) {

	if(this.rowCount !== a.rowCount || this.colCount !== a.colCount) {
		
		return false;
	}

	for(var i = 0; i < this.rowCount; i++) {

		for(var j = 0; j < this.colCount; j++) {

			if(!this.ring.equals(this.values[i][j], a.values[i][j])) {

				return false;
			}
		}
	}
	
	return true;
}

Matrix.prototype.mult = function(a) {

	var _values = [];

	for(var i = 0; i < this.rowCount; i++) {

		_values[i] = [];

		for(var j = 0; j < this.colCount; j++) {

			_values[i][j] = this.ring.prod(a, this.values[i][j]);
		}
	}	
	
	return new Matrix(this.ring, _values, this.rowCount, this.colCount);
}

Matrix.prototype.opposite = function() {

	var _opposite = new Matrix(this.ring, this.values, this.rowCount, this.colCount);

	for(var i = 0; i < _opposite.rowCount; i++) {

		for(var j = 0; j < _opposite.colCount; j++) {

			_opposite.values[i][j] = _opposite.ring.opposite(_opposite.values[i][j]);
		}
	}

	return _opposite;
}

Matrix.getDeterminant = function(m) {

	var _one = m.ring.one();
	var _zero = m.ring.zero();
	var _res = _zero;
	var _permutationIterator = new PermutationIterator(m.rowCount);
	var _isDone = false;
	var _next = _permutationIterator.next(); 

	while(!_isDone) {
 
		var _perm = _next.value;
		var a = _one;

		for(var j = 0; j < m.rowCount; j++) {

			a = m.ring.prod(a, m.values[j][_perm[j]]);
		}		

		var _ic = getInversionCount(_perm);
		
		if(_ic % 2 === 1) {
			
			a = m.ring.opposite(a);
		}
		
		_res = m.ring.sum(_res, a);
		_next = _permutationIterator.next();
		_isDone = _next.done;

	}

	return _res;
}

Matrix.prototype.getMinor = function(rowIndex, colIndex) {

	var _subValues = [];

	for(var i = 0; i < this.rowCount; i++) {
	
		if(i === rowIndex) {

			continue;
		}

		_row = [];

		for(var j = 0; j < this.colCount; j++) {

			if(j === colIndex) {

				continue;
			}

			_row.push(this.values[i][j]);
		}

		_subValues.push(_row);		
	}

	return new Matrix(this.ring, _subValues, this.rowCount - 1, this.colCount - 1);
}

Matrix.prototype.changeRows = function(a, b) {

	var _temp = this.ring.zero();

	for(var i = 0; i < this.colCount; i++) {

		_temp = this.values[a][i];
		this.values[a][i] = this.values[b][i];
		this.values[b][i] = _temp;
	}

	this.determinant = undefined;
	this.adjugate = undefined;
}

Matrix.prototype.convertToDiag = function() {

	var _zero = this.ring.zero()
	var _temp = _zero;
	var _colNum = -1;
	var _rowNum = 0;
	var _vars = [];
	for(var i = 0; i < this.colCount; i++) {

		_vars.push(i);
	}

	while(_rowNum < this.rowCount && _colNum < this.colCount - 1) {

		_colNum++;
		var _noZero = -1;

		for(var j = _rowNum; j < this.rowCount; j++) {

			if(!this.ring.equals(this.values[j][_colNum], _zero)) {

				_noZero = j;
				break;
			}
		}
		
		if(_noZero < 0) {

			continue;
		}

		if(_noZero > _rowNum) {

			this.changeRows(_noZero, _rowNum);
			var t = _vars[_noZero];
			_vars[_noZero] = _vars[_rowNum];
			_vars[_rowNum] = t;
		}

		var _ii = this.values[_rowNum][_colNum];
		var _iir = this.ring.reverse(_ii);
		var _row = [];

		for(var j = _colNum + 1; j < this.colCount; j++) {

			_row[j] = this.ring.prod(_iir, this.values[_rowNum][j]);
		}

		for(var j = _rowNum + 1; j < this.rowCount; j++) {

			var _ji = this.values[j][_colNum];
			this.values[j][_colNum] = _zero;
			
			for(var k = _colNum + 1; k < this.colCount; k++) {

				_temp = this.ring.opposite(this.ring.prod(_row[k], _ji));
				this.values[j][k] = this.ring.sum(this.values[j][k], _temp);
			}
		}

		_rowNum++;
	}

	return _vars;
}

Matrix.prototype.getDeterminant = function() {

	if(this.determinant == undefined) {

		if(this.rowCount !== this.colCount) {

			throw new SyntaxError("Incorrect input.")
		}

		var _one = this.ring.one();
		var _zero = this.ring.zero();
		var _res = _zero;

		if(this.ring.isField) {

			var _matrix = new Matrix(this.ring, this.values, this.rowCount, this.colCount);
			var _perm = _matrix.convertToDiag();
			_res = _one;

			for(var i = 0; i < _matrix.rowCount; i++) {

				_res = this.ring.prod(_res, _matrix.values[i][i]);
			}

			var _ic = getInversionCount(_perm);
			var _even = _ic % 2 === 0 ? 1 : -1;

			if(_even < 0) {

				_res = this.ring.opposite(_res);
			}

		} else {

			var _matrixStack = [];
			_matrixStack.push(this);
			var _multStack = [];
			_multStack.push(_one);
			var _signStack = [];
			_signStack.push(1);

			while(_matrixStack.length > 0) {
			
				var _matrix = _matrixStack.pop();
				var _mult = _multStack.pop();
				var _sign = _signStack.pop();

				if(_matrix.rowCount === 1) {

					var _addition = _matrix.values[0][0];
					_addition = this.ring.prod(_addition, _mult);

					if(_sign < 0) {

						_addition = this.ring.opposite(_addition);
					}

					_res = this.ring.sum(_res, _addition);
					continue;
				}

				var _maxZeroInRow = 0;
				var _rowIndex = 0;

				for(var i = 0; i < _matrix.rowCount; i++ ) {

					var _zeroCount = 0;
					
					for(var j = 0; j < _matrix.colCount; j++) {
						
						if(_matrix.ring.equals(_matrix.values[i][j], _zero)) {

							_zeroCount++;
						}
					}

					if(_zeroCount > _maxZeroInRow) {

						_maxZeroInRow = _zeroCount;
						_rowIndex = i;
					}
				}

				var _maxZeroInColumn = 0;
				var _colIndex = 0;

				for(var i = 0; i < _matrix.colCount; i++) {
			
					var _zeroCount = 0;

					for(var j = 0; j < _matrix.rowCount; j++) {
	
						if(_matrix.ring.equals(_matrix.values[j][i], _zero)) {
		
							_zeroCount++;
						}
					}

					if(_zeroCount > _maxZeroInColumn) {

						_maxZeroInColumn = _zeroCount;
						_colIndex = i;
					}				
				}

				if(_maxZeroInRow + _maxZeroInColumn === 0) {

					var _addition = Matrix.getDeterminant(_matrix);
					_addition = this.ring.prod(_addition, _mult);

					if(_sign < 0) {

						_addition = this.ring.opposite(_addition);
					}

					_res = this.ring.sum(_res, _addition);
				}
				else {

					if(_maxZeroInRow >= _maxZeroInColumn) {

						for(var i = 0; i < _matrix.colCount; i++) {

							var _item = _matrix.values[_rowIndex][i];

							if(!this.ring.equals(_item, _zero)) {

								var _minor = _matrix.getMinor(_rowIndex, i);
								var _even = (_rowIndex + i) % 2 == 0 ? 1 : -1;
								_matrixStack.push(_minor);
								_multStack.push(this.ring.prod(_item, _mult));
								_signStack.push(_sign * _even);
							}
						}

					} else {
							for(var i = 0; i < _matrix.rowCount; i++) {

								var _item = _matrix.values[i][_colIndex];

								if(!this.ring.equals(_item, _zero)) {

									var _minor = _matrix.getMinor(i, _colIndex);
									var _even = (_colIndex + i) % 2 == 0 ? 1 : -1;
									_matrixStack.push(_minor);
									_multStack.push(this.ring.prod(_item, _mult));
									_signStask.push(_sign * _even);
							}
						}
					}
				}
			}	
		}

		this.determinant = _res;
	}

	return this.determinant;
}

Matrix.prototype.transponent = function() {

	var _values = [];

	for(var i = 0; i < this.rowCount; i++) {

		_values[i] = [];

		for(var j = 0; j < this.colCount; j++) {

			_values[i][j] = this.values[j][i];
		}
	}

	return new Matrix(this.ring, _values, this.rowCount, this.colCount);
}

Matrix.prototype.getAdjugate = function() {

	if(this.rowCount !== this.colCount) {

		throw new SyntaxError("Incorrect input.");
	}

	if(this.adjugate == undefined) {
		
		var _values = [];

		for(var i = 0; i < this.rowCount; i++) {

			_values[i] = [];			

			for(var j = 0; j < this.colCount; j++) {

				var _minor = this.getMinor(j, i);
				var _md = _minor.getDeterminant();
				var _even = (i + j) % 2 == 0 ? 1 : -1;
			
				if(_even < 0) {

					_md = this.ring.opposite(_md);
				} 
				_values[i][j] = _md; 
			}
		}

		this.adjugate = new Matrix(this.ring, _values, this.rowCount, this.colCount);
	}

	return this.adjugate;
}

Matrix.prototype.reverse = function() {

	var d = this.getDeterminant();
	var _dr = this.ring.reverse(d);
	return this.getAdjugate().mult(_dr);
}

Matrix.prototype.convertToE = function() {

	var _matrix = new Matrix(this.ring, this.values, this.rowCount, this.colCount);
	_matrix.convertToDiag();
	var _zero = this.ring.zero();
	var _one = this.ring.one();
	
	for(var i = _matrix.rowCount - 1; i >= 0; i--) {

		var _colNum = -1;

		for(var j = 0; j < _matrix.colCount; j++) {

			if(!_matrix.ring.equals(_matrix.values[i][j], _zero)) {

				_colNum = j;
				break;
			}
		}

		if(_colNum < 0) {

			continue;
		}

		var _noZero = _matrix.values[i][_colNum];
		var _iir = _matrix.ring.reverse(_noZero);
		_matrix.values[i][_colNum] = _one;

		for(var k = _colNum + 1; k < _matrix.colCount; k++) {

			_matrix.values[i][k] = _matrix.ring.prod(_matrix.values[i][k], _iir);
		}

		for(var j = 0; j < i; j++) {

			var _ji = _matrix.values[j][_colNum];
			_matrix.values[j][_colNum] = _zero;

			for(var k = _colNum + 1; k < _matrix.colCount; k++) {

				_temp = _matrix.ring.opposite(_matrix.ring.prod(_matrix.values[i][k], _ji));
				_matrix.values[j][k] = _matrix.ring.sum(_matrix.values[j][k], _temp);
			}
		}
	}

	return _matrix;
}

Matrix.solveLs = function(a) {

	var e = a.convertToE();
	var _freeVarsCnt = e.colCount - e.rowCount - 1;
	var _res = undefined;
	var _boundVarIndexes = [];
	var _zero = e.ring.zero();
	var _one = e.ring.one();
	
	for(var i = e.rowCount - 1; i >= 0; i--) {
	
		var _nonZeroIndex = -1;

		for(var j = 0; j < e.colCount; j++) {

			if(!e.ring.equals(e.values[i][j], _zero)) {

				_nonZeroIndex = j;
				break;
			}
		}

		if(_nonZeroIndex === e.colCount - 1) {

			return undefined;
		}

		if(_nonZeroIndex < 0) {

			_freeVarsCnt++;
			continue;
		}

		if(_res == undefined) {

			_res = new Matrix(e.ring, [], e.colCount - 1, _freeVarsCnt + 1);
		}

		var _cnt = 1;

		for(var j = e.colCount - 1; j > _nonZeroIndex; j--) {

			if(_boundVarIndexes.indexOf(j) < 0) {

				if(j === e.colCount - 1) {

					_res.values[_nonZeroIndex][_res.colCount - _cnt] = e.values[i][j];

				} else {

					_res.values[_nonZeroIndex][_res.colCount - _cnt] = e.ring.opposite(e.values[i][j]);
				}
				
				_cnt++;
			}

		} 

		_boundVarIndexes.push(_nonZeroIndex);
	}

	if(_res == undefined) {

		_res = new Matrix(e.ring, [], e.colCount - 1, _freeVarsCnt + 1);
	}

	var _colNum = 0;

	for(var i = 0; i < e.colCount - 1; i++) {

		if(_boundVarIndexes.indexOf(i) < 0) {

			_res.values[i][_colNum] = _one;
			_colNum++;
		}
	}

	return _res;
}

Matrix.prototype.tex = function() {

	var _sb = [];
	_sb.push('\\begin{pmatrix}');

	for(var i = 0; i < this.rowCount; i++) {

		for(var j = 0; j < this.colCount - 1; j++) {

			_sb.push(this.ring.tex(this.values[i][j]));
			_sb.push('&');
		}

		_sb.push(this.ring.tex(this.values[i][this.colCount - 1]));
		_sb.push('\\\\');
	}

	_sb.push('\\end{pmatrix}');
	return _sb.join('');
}

function MRing(ring, size) {

	this.ring = ring;
	this.size = size;
	this.z = new Matrix(this.ring, [], this.size, this.size);

	var _one = this.ring.one();
	var _zero = new Matrix(this.ring, [], this.size, this.size);	

	for(var i = 0; i < this.size; i++) {

		_zero.values[i][i] = _one;
	}

	this.o = _zero;
}

MRing.prototype = Object.create(Ring.prototype);
MRing.prototype.constructor = Ring;

MRing.prototype.ringTex = function() {

	return this.ring.ringTex() + '_{'+ this.size + ',' + this.size +'}';
}

MRing.prototype.tex = function(m) {

	return m.tex();
}

MRing.prototype.one = function() {

	return this.o;
}

MRing.prototype.zero = function() {

	return this.z;
}

MRing.prototype.opposite = function(m) {

	return m.opposite();
}

MRing.prototype.prod = function(m1, m2) {

	return m1.prod(m2);
} 

MRing.prototype.sum = function(m1, m2) {

	return m1.add(m2);
}

MRing.prototype.reverse = function(m) {

	return m.reverse();
}

MRing.prototype.getMatrixByElement = function(a) {

	var _mone = this.one();
	return _mone.mult(a);
}