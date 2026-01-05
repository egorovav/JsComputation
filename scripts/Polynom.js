function Polynom(ring, coeffs) {

	this.ring = ring;
	this.zero = ring.zero(); 
	this.one = ring.one();

	var _index = coeffs.length - 1;

	while(_index >= 0 && ring.equals(coeffs[_index], this.zero)) {
		
		_index--;
	}

	this.degree = _index;
	this.coeffs = [];

	for(var i = this.degree; i >= 0; i--) {

		if(coeffs[i] !== undefined) {

			this.coeffs[i] = coeffs[i];
		} else {
			
			this.coeffs[i] = this.zero;
		}
	}
}

Polynom.prototype.tex1 = function(varSign, isTab) {

	if(this.degree < 0)
		return "0";

	var _res = "";

	for(var i = this.degree; i >= 0; i--) {

		var c = this.coeffs[i];
		if(!this.ring.equals(c, this.zero)) {
			
			var _cs = this.ring.tex(c);
			if(i !== this.degree) {

				if(_cs[0] !== '-') {
					
					_res += "+";
				}
			}

			if(i !== 0) {
			
				if (this.ring.equals(c, this.one)) {

					_cs = "";
				}
				else if (this.ring.size < 0 && this.ring.equals(c, this.ring.opposite(this.one))) {
	
					_cs = "-";
				}
			}

			_res += _cs;
			
			if(i > 0) {

				_res += varSign;
			}

			if(i > 1) {

				_res += "^" + i;
			}
		}

		if(isTab && i != 0) {

			_res += "&";
		}
	}

	return _res;
}

Polynom.prototype.tex = function() {

	return this.tex1('x', false);
}

Polynom.prototype.mult = function(a) {

	var _index = this.degree;

	while(_index >= 0 && this.ring.equals(this.coeffs[_index], this.zero)) {

		_index--;
	}

	var _coeffs = [];

	for(var i = 0; i <= _index; i++) {

		_coeffs[i] = this.ring.prod(this.coeffs[i], a);
	}
	
	return new Polynom(this.ring, _coeffs);
}

Polynom.prototype.opposite = function() {

	var _minusOne = this.ring.opposite(this.one);
	return this.mult(_minusOne);
}

Polynom.prototype.add = function(a) {

	var _deg = Math.max(this.degree, a.degree);
	var _coeffs = [];	

	for(var i = 0; i <= _deg; i++) {

		var _s1 = this.coeffs[i] == undefined ? this.zero : this.coeffs[i];
		var _s2 = a.coeffs[i] == undefined ? this.zero : a.coeffs[i];

		_coeffs[i] = this.ring.sum(_s1, _s2);		
	}

	return new Polynom(this.ring, _coeffs);
}

Polynom.prototype.prod = function(a) {

	if(this.degree < 0 || a.degree < 0) {
		
		return new Polynom(this.ring, []);
	}

	var _deg = this.degree + a.degree;
	var _coeffs = [];

	for(var i = 0; i <= _deg; i++) {

		var _pi = this.zero;
		
		for(var j = 0; j <= i; j++) {

			var _aj = j <= this.degree ? this.coeffs[j] : this.zero;
			var _bi_j = i - j <= a.degree ? a.coeffs[i - j] : this.zero;
			_pi = this.ring.sum(_pi, this.ring.prod(_aj, _bi_j));
		}
		_coeffs[i] = _pi;
	}

	while (_coeffs.length > 0 && this.ring.equals(_coeffs[_coeffs.length - 1], this.zero)) {

		_coeffs.pop();
	}

	return new Polynom(this.ring, _coeffs);
}

Polynom.prototype.div = function(denumerator, isRight) {

	var remainders = [];
	var quot = new Polynom(this.ring, []);

	if(this.degree < denumerator.degree) {

		remainders.push(new Polynom(this.ring, this.coeffs));
		return { quot, remainders };
	}

	var _deg = this.degree - denumerator.degree;
	var _rem = new Polynom(this.ring, this.coeffs);
	var _minusOne = this.ring.opposite(this.one);
	var c = this.ring.reverse(denumerator.coeffs[denumerator.degree]);

	while(_rem.degree >= denumerator.degree) {

		var p = _rem.degree - denumerator.degree;
		var d = new Array(p + 1);
		d.fill(this.zero);

		if(isRight) {

			d[p] = this.ring.prod(_rem.coeffs[_rem.degree], c)
		} else {

			d[p] = this.ring.prod(c, _rem.coeffs[_rem.degree]);
		}

		var _dp = new Polynom(this.ring, d);
		quot = quot.add(_dp);
		var _dd;

		if(isRight) {

			_dd = _dp.prod(denumerator);
		} else {

			_dd = denumerator.prod(_dp);
		}

		remainders.push(new Polynom(this.ring, _dd.coeffs));
		_dd = _dd.mult(_minusOne);
		_rem = _rem.add(_dd);
		remainders.push(_rem);
	}

	var _shift = _deg - this.degree;

	for(var i = 0; i < _shift; i++) {
		
		quot.coeffs.unshift(this.zero);	
	} 

	return { quot, remainders };
}

Polynom.prototype.html = function(varSign, isUnderlined) {

	if(this.degree < 0) {

		return '<td>$0$</td>';
	}

	var _html = [];
	var _tdStyle = '';
	if(isUnderlined) {

		_tdStyle = 'style="border: solid 0 #060; border-bottom-width:1px"';
	}

	var _minNoZeroIndex = -1;

	for(var i = 0; i < this.degree; i++) {
	
		if(this.coeffs[i] !== this.zero) {

			_minNoZeroIndex = i;
			break;
		}	
	}

	for(var i = this.degree; i >= 0; i--) {

		var c = this.coeffs[i];
		
		if(!this.ring.equals(c, this.zero)) {
		
			_html.push('<td ' + _tdStyle + ' align="right">');
			_html.push('$');
			var _cs = this.ring.tex(c);

			if(i !== this.degree) {

				if(_cs[0] !== '-') {
					
					_html.push('+');
				}
			}

			if(i !== 0) {

				if(this.ring.equals(c, this.one)) {

					_cs = '';
				} else if (this.ring.size < 0 && this.ring.equals(c, this.ring.opposite(this.one))){

					_cs = '-';
				}
			} 

			_html.push(_cs);
			
			if(i > 0) {

				_html.push(varSign);
			}

			if(i > 1) {

				_html.push('^' + i);
			}

			_html.push('$');
		} else {

			if(i > _minNoZeroIndex) {

				_html.push('<td ' + _tdStyle + ' align="right">')

			} else {
				
				_html.push('<td>');
			}
		}

		_html.push('</td>');
	}

	return _html.join('');
}

Polynom.prototype.divHtml = function(denumerator, varSign) {

	var _div_res = this.div(denumerator);
	var quotient = _div_res.quot;
	var remainders = _div_res.remainders;

	var _html = [];

	_html.push('<table  border="0" cellspacing="0" cellpadding="0">');
	_html.push('<tr>');
	_html.push(this.html(varSign, false));
	_html.push('<td style="border: solid 0 #060; border-left-width:1px;border-bottom-width:1px">$');
	_html.push(denumerator.tex(varSign, false));
	_html.push('$</td>');
	_html.push('</tr>');
	_html.push('<tr>');
	_html.push(remainders[0].html(varSign, true));
	_html.push('<td style="border: solid 0 #060; border-left-width:1px;">$');
	_html.push(quotient.tex(varSign, true));
	_html.push('$</td>');
	_html.push('</tr>');

	var _isUnderlined = false;

	for(var i = 1; i < remainders.length; i++) {

		var _item = remainders[i];
		_isUnderlined = (i % 2 === 0);
		var _shift = this.degree - _item.degree;

		if(_item.degree < 0) {

			_shift--;
		}

		var _pref = new Array(_shift);
		_pref.fill('<td></td>');
		_html.push('<tr>');
		_html.push(_pref.join(''));
		_html.push(_item.html(varSign, _isUnderlined));
		_html.push('</tr>');
	}

	_html.push('</table>');

	var _res = _html.join('');
	// console.log(_res);

	return _res;
}

Polynom.prototype.divTex = function(denumerator, varSign) {

	var _div_res = this.div(denumerator);
	var quotient = _div_res.quot;
	var remainders = _div_res.remainders;

	var _tex = [];
	
	_tex.push('<p class="tex2jax_ignore">');
	_tex.push('\\extrarowheight=2pt');
	_tex.push('<br>');
	_tex.push('\\arraycolsep=0.05em');
	_tex.push('<br>');
	_tex.push('\\begin{array}{');
	
	for(var i = 0; i <= this.degree; i++) {

		_tex.push('r');
	}	

	_tex.push('@{\\,}r|l}');
	_tex.push('<br>');
	_tex.push(this.tex1(varSign, true));
	_tex.push('&&\\,');
	_tex.push(denumerator.tex1(varSign, false));
	_tex.push('\\\\');
	_tex.push('<br>');
	var _temp = this.degree + 3;
	_tex.push('\\cline{' + _temp + '-' + _temp + '}');
	var _secondString = remainders[0].tex1(varSign, true) + '&&\\,' + quotient.tex1(varSign, false) + '\\\\';
	_tex.push(_secondString);
	_tex.push('<br>');
	
	for(var i = 1; i < remainders.length; i++) {

		if(i % 2 === 1) {

			var s = this.degree - remainders[i - 1].degree + 1;
			_temp = s + denumerator.degree;
			_tex.push('\\cline{'+ s +'-'+ _temp +'}'); 
			_tex.push('<br>');
		}

		var _shift = this.degree - remainders[i].degree + 1;

		if(remainders[i].degree < 0) {

			_shift--;
		}

		var _pref = Array(_shift).join('&'); 
		_tex.push(_pref + remainders[i].tex1(varSign, true) + '\\\\');
		_tex.push('<br>');
	}	

	_tex.push('\\end{array}');
	_tex.push('</p>');

	return _tex.join('');
}

Polynom.getGCD = function(a, b) {

	var _zero = new Polynom(a.ring, []);
	var _one = new Polynom(a.ring, [a.ring.one()]);
	var gcd = _zero;
	var u, v;

	if(a.degree < 0) {

		u = _zero;
		v = (b.degree < 0 ? _zero : _one);
		gcd = b;
	} else if (b.degree < 0) {
	
		v = _zero;
		u = (a.degree < 0 ? _zero : _one);
		gcd = a;
	} else {

		var _r1 = b;
		var _q_res = a.div(b, false);
		var _r2 = _q_res.remainders;
		var gcd = b;
		var _u1 = _one;
		var _u2 = _zero;
		var _v1 = _one;
		var _v2 = _one;
		var q = _zero;

		if(_r2[_r2.length - 1].degree < 0) {

			_u1 = _zero;
		} else {

			_v1 = _q_res.quot.opposite();
		}

		var _temp1 = _zero;

		while(_r2[_r2.length - 1].degree >= 0) {

			gcd = _r2[_r2.length - 1];
			var _q_res1 = _r1.div(_r2[_r2.length - 1], false);
			q = _q_res1.quot;
			_r1 = gcd;
			_r2 = _q_res1.remainders;
			_temp1 = _u1;
			_u1 = _u2.add(_u1.opposite().prod(q));
			_u2 = _temp1;
			_temp1 = _v1;
			_v1 = _v2.add(_v1.opposite().prod(q));
			_v2 = _temp1; 
		}

		u = _u2;
		v = _v2;

		var _major = gcd.coeffs[gcd.degree];

		if(!a.ring.equals(_major, a.ring.one())) {

			var _major_1 = a.ring.reverse(_major);
			gcd = gcd.mult(_major_1);
		}

		var _sum = a.prod(u).add(b.prod(v));
		_major = _sum.coeffs[_sum.degree];

		if(!a.ring.equals(_major, a.ring.one())) {

			var _major_1 = a.ring.reverse(_major);
			u = u.mult(_major_1);
			v = v.mult(_major_1);
		}		
	}
	
	return {gcd, u, v};	
}

Polynom.prototype.equals = function(a) {

	if(this.degree !== a.degree) {

		return false;
	}

	if(this.degree < 0 && a.degree < 0) {

		return true;
	}

	if((this.degree < 0 && a.degree >= 0) || (this.degree >= 0 && a.degree < 0)) {

		return false;
	}

	for(var i = 0; i <= this.degree; i++) {

		if(!this.ring.equals(this.coeffs[i], a.coeffs[i])) {
			
			return false;
		}
	}

	return true;
}

Polynom.prototype.reverse = function() {

	if(this.degree !== 0) {

		throw new SyntaxError("Incorrect input.");
	}

	var _0r = this.ring.reverse(this.coeffs[0]);
	return new Polynom(this.ring, [_0r]);
}

Polynom.matrixCharPolynom = function(matrix) {

	if(matrix.rowCount !== matrix.colCount) {

		throw new SyntaxError("Incorrect input.")
	}

	var _msize = matrix.rowCount;
	var _one = matrix.ring.one();
	var _rx = new Rx(matrix.ring);
	var _values = [];

	for(var i = 0; i < _msize; i++) {

		_values[i] = [];

		for(var j = 0; j < _msize; j++) {

			var _minusMij = matrix.ring.opposite(matrix.values[i][j]);
			
			if(i === j) {
				
				_values[i][j] = new Polynom(matrix.ring, [_minusMij, _one]);

			} else {

				_values[i][j] = _rx.getPolynomByElement(_minusMij);
			}
		}
	}

	var _pmatrix = new Matrix(_rx, _values, _msize, _msize);
	var _xix = _pmatrix.getDeterminant();
	return _xix;	
}

Polynom.prototype.getValue = function(a) {

	    var p = this.one;
            var _res = this.zero;
            for (var i = 0; i <= this.degree; i++)
            {
                _res = this.ring.sum(_res, this.ring.prod(this.coeffs[i], p));
                p = this.ring.prod(p, a);
            }
            return _res;
}

Polynom.prototype.derivative = function() {

	if(this.degree === 0) {
		
		return new Polynom(this.ring, [0]);
	}

	var _coeffs = [];	

	for(var i = this.degree - 1; i >= 0; i--) {

		var _coeff = this.ring.mult(this.coeffs[i + 1], i + 1);

		if(_coeffs.Count === 0 && this.ring.equals(_coeff, this.zero)) {

			continue;

		} else {

			_coeffs.unshift(_coeff);
		}
	}

	return new Polynom(this.ring, _coeffs);
}

Polynom.prototype.getMatrixPolynom = function(size) {

	var _coeffs = [];
	var _mring = new MRing(this.ring, size);

	for(var i = 0; i <= this.degree; i++) {

		_coeffs[i] = _mring.getMatrixByElement(this.coeffs[i]);
	}

	return new Polynom(_mring, _coeffs);
}

Polynom.factorisation = function(ax) {

	var _one = ax.ring.one();
	var _zero = ax.ring.zero();
	var _minusOne = ax.ring.opposite(_one);
	var _pzero = new Polynom(ax.ring, [_zero]);
	var _pone = new Polynom(ax.ring, [_one]);

	var p = ax.ring.size;
	var _res = [];

	if(ax.degree < 2) {

		return _res;
	}

	var _derivative = ax.derivative();
	var _gcd = Polynom.getGCD(ax, _derivative).gcd;

	if(_gcd.degree > 0) {

		if(!_derivative.equals(_pzero)) {

			_res.push(_gcd);
			_res.push(ax.div(_gcd).quot);
			
		} else {

			p = ax.ring.simpleSubfieldSize;
			var c = Math.round(ax.degree / p);
			var d = Math.round(ax.ring.size / p);
			var _coeffs = [];

			for(var i = 0; i <= c; i++) {

				_coeffs[i] = ax.ring.pow(ax.coeffs[p * i], d);
			}

			for(var i = 0; i < p; i++) {

				_res.push(new Polynom(ax.ring, _coeffs));
			}
		}

		return _res;
	}

	var _aij_vals = [];
	for(var i = 1; i < ax.degree; i++) {

		var _coeffs = [];
		_coeffs[p * i] = _one;
		_coeffs[i] = _minusOne;
		var _pol = new Polynom(ax.ring, _coeffs);
		var _remainders = _pol.div(ax).remainders;		
		var _ai = _remainders[_remainders.length - 1];

		for(var j = 0; j <= _ai.degree; j++) {

			if(_aij_vals[j] == undefined) {
				
				_aij_vals[j] = [];
			}

			_aij_vals[j][i - 1] = _ai.coeffs[j];
		} 
	}

	var _aij = new Matrix(ax.ring, _aij_vals, ax.degree, ax.degree);

	var _matrix = Matrix.solveLs(_aij);
	var _solvation = [];
	_solvation[0] = _zero;
	var isResEmpty = true;

	for(var i = 0; i < _matrix.rowCount; i++) {
	
		if(_solvation[i + 1] == undefined) {

			_solvation[i + 1] = _zero;
		}

		for(var j = 0; j < _matrix.colCount; j++) {

			_solvation[i + 1] = ax.ring.sum(_solvation[i + 1], _matrix.values[i][j]);
		}

		isResEmpty = ax.ring.equals(_solvation[i + 1], _zero);
	}

	if(!isResEmpty) {

		var _pp = new Polynom(ax.ring, _solvation);
		var _gcd1 = _pone;
		var _values = ax.ring.getValues();		

		for(var i = 0; i < _values.length; i++) {

			var _ppp = new Polynom(ax.ring, _pp.coeffs);
			_ppp.coeffs[0] = _ppp.ring.sum(_values[i], _ppp.coeffs[0]);
			_gcd1 = Polynom.getGCD(ax, _ppp).gcd;		
	
			if(!_gcd1.equals(_pone)) {

				_res.push(_gcd1);
				var _quot = ax.div(_gcd1).quot;
				_res.push(_quot);
				break;				
			}
		}
	}

	return _res;
} 

Polynom.prototype.factorisation = function() {

	var _res = [];
	var _stack = [];
	_stack.push(this);

	while(_stack.length > 0) {

		var _polynom = _stack.pop();
		var _multipliers = Polynom.factorisation(_polynom);

		if(_multipliers.length === 0) {

			_res.push(_polynom);

		} else {

			for(var i = 0; i < _multipliers.length; i++) {

				_stack.push(_multipliers[i]);
			}
		}
	}
	
	return _res;
}

function Rx(ring) {

	this.ring = ring;
	this.z = new Polynom(this.ring, [this.ring.zero()]);
	this.o = new Polynom(this.ring, [this.ring.one()]);
}

Rx.prototype = Object.create(Ring.prototype);
Rx.prototype.constructor = Ring;

Rx.prototype.ringTex = function() {

	return this.ring.ringTeX() + "[x]";
}

Rx.prototype.tex = function(ax) {

	return ax.tex();
}

Rx.prototype.one = function() {

	return this.o;
}

Rx.prototype.zero = function() {

	return this.z;
}

Rx.prototype.equals = function(ax, bx) {

	return ax.equals(bx);
}

Rx.prototype.opposite = function(ax) {

	return ax.opposite();
}

Rx.prototype.prod = function(ax, bx) {

	return ax.prod(bx);
}

Rx.prototype.reverse = function(ax) {

	return ax.reverse();
}

Rx.prototype.sum = function(ax, bx) {

	return ax.add(bx);
}

Rx.prototype.getPolynomByElement = function(a) {

	return new Polynom(this.ring, [a]);
}

function PxFx(ring, mod) {

	this.z = new Polynom(ring, [ring.zero()]);
	this.o = new Polynom(ring, [ring.one()]);

	this.ring = ring;
	this.mod = mod;
	this.values = [this.z];
	this.size = Math.pow(ring.size, mod.degree);
	this.simpleSubfieldSize = ring.size; 	
}

PxFx.prototype = Object.create(Ring.prototype);
PxFx.prototype.constructor = Ring;

PxFx.prototype.ringTex = function() {

	return this.ring.ringTex() + '[x]/' + this.mod.tex();
}

PxFx.prototype.getValues = function() {

	if(this.values.length === 1) {

		var _coeffs = [];

		for(var i = 0; i < this.mod.degree; i++) {
		
			_coeffs[i] = 0;
		}
	
		for(var i = 0; i < this.size - 1; i++) {

			var _currentCoeff = 0;
		
			while(_currentCoeff < this.mod.degree && ++_coeffs[_currentCoeff] >= this.ring.size) {

				_coeffs[_currentCoeff] = 0;
				_currentCoeff++;
			}
		
			var _value = new Polynom(this.ring, _coeffs.slice(0));
			this.values.push(_value);
		}
	}

	return this.values;
}

PxFx.prototype.zero = function() {

	return this.z;
}

PxFx.prototype.one = function() {

	return this.o;
}

PxFx.prototype.equals = function(ax, bx) {

	return ax.equals(bx);	
}

PxFx.prototype.tex = function(ax) {

	return '[' + ax.tex1('y', false) + ']';
}

PxFx.prototype.opposite = function(ax) {

	return ax.opposite();
}

PxFx.prototype.sum = function(ax, bx) {

	return ax.add(bx);
}

PxFx.prototype.prod = function(ax, bx) {

	var _res = ax.prod(bx);

	if(_res.degree >= this.mod.degree) {

		var _remainders = _res.div(this.mod).remainders;
		_res = _remainders == undefined ? this.z : _remainders[_remainders.length - 1];
	}

	return _res;
}

PxFx.prototype.reverse = function(ax) {

	var _gcd = Polynom.getGCD(ax, this.mod);

	if(!_gcd.gcd.equals(this.o)) {

		return undefined;
	}

	var _reverse = _gcd.u;
	
	if(u.degree >= this.mod.degree) {

		var _remainders = _reverse.div(this.mod).remainders;
		_reverse = _remainders == undefined ? this.z : _remainders[_remainders.length - 1];
	}

	return _reverse;
}

// should use only for small size rings.

PxFx.prototype.asFiniteRing = function() {

	var addTable = [];
	var multTable = [];
	var _values = this.getValues();

	for(var i = 0; i < this.size; i++) {

		addTable[i] = [];	
		multTable[i] = [];	

		for(var j = 0; j < this.size; j++) {

			var _sum = _values[i].add(_values[j]);
			var _remainders = _sum.div(this.mod).remainders;
			var _rem = _remainders == undefined ? this.z : _remainders[_remainders.length - 1];

			var _prod = _values[i].prod(_values[j]);
			var _remainders1 = _prod.div(this.mod).remainders;
			var _rem1 = _remainders1 == undefined ? this.z : _remainders1[_remainders1.length - 1];
			
			for(var k = 0; k < this.size; k++) {
				
				if(_values[k].equals(_rem)) {

					addTable[i][j] = k;
				}
	
				if(_values[k].equals(_rem1)) {
					
					multTable[i][j] = k;
				}
			}
		}
	}

	return new FiniteRing(addTable, multTable, this.simpleSubfieldSize);
}