function Ring() {

	this.size = -1;
	this.IsField = false;
	this.values = [];
}

Ring.prototype.one = function() {

	return 1;
}

Ring.prototype.zero = function() {

	return 0;
}

Ring.prototype.sum = function(a, b) {

	if(a === undefined) {

		return b;
	}

	if(b === undefined) {

		return a;
	}

	return a + b;
}

Ring.prototype.prod = function(a, b) {

	if (a === undefined || b === undefined ) {

		return 0;
	}

	return a * b;
}

Ring.prototype.mult = function(t, mult) {
	
	var _sum = this.zero();

	for(var i = 0; i < mult; i++) {
		_sum = this.sum(_sum, t);
	}
	return _sum;
}

Ring.prototype.reverse = function(a) {

	return 1/a;
}

Ring.prototype.opposite = function(a) {

	return -a;
}

Ring.prototype.pow = function(b, p) {

	var _prod = this.one();

	for(var i = 0; i < p; i++) {
		_prod = this.prod(_prod, b);
	}
	return _prod;
}

Ring.prototype.equals = function(a, b) {

	return a === b;
}

Ring.prototype.tex = function(a) {

	return a.toString();
}

Ring.prototype.getValues = function() {

	if(values.length == 0 && this.size > 0) {

		for(var i = 0; i < this.size; i++) {

			values.push(i);
		}
	}

	return values	
}

Ring.prototype.ringTex = function() {

	var _values = this.getValues();

	var _res = [];

	_res.push('\\begin{tabular}{|');
	
	for(var i = 0; i < this.size + 1; i++) {

		_res.push('c|');
	}

	_res.push('}');
	_res.push('\\hline');
	_res.push('+');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('&');
		_res.push(this.tex(_values[i]));
	}

	_res.push('\\\\')
	_res.push('\\hline');

	for(var i = 0; i < this.size; i++) {

		_res.push(this.tex(_values[i]));
		
		for(var j = 0; j < this.size; j++) {

			_res.push('&');
			var _sum = this.sum(_values[i], _values[j]);
			_res.push(this.tex(_sum));
		}

		_res.push('\\\\')
		_res.push('\\hline');
	}

	_res.push('\\end{tabular}');
	_res.push('\\\\');
	_res.push('\\begin{tabular}{|');
	
	for(var i = 0; i < this.size + 1; i++) {

		_res.push('c|');
	}

	_res.push('}');
	_res.push('\\hline');
	_res.push('*');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('&');
		_res.push(this.tex(_values[i]));
	}

	_res.push('\\\\');
	_res.push('\\\\');
	_res.push('\\hline');

	for(var i = 0; i < this.size; i++) {

		_res.push(this.tex(_values[i]));
		
		for(var j = 0; j < this.size; j++) {

			_res.push('&');
			var _prod = this.prod(_values[i], _values[j]);
			_res.push(this.tex(_prod));
		}

		_res.push('\\\\')
		_res.push('\\hline');
	}

	_res.push('\\end{tabular}');

	return _res.join('');
}

Ring.prototype.htmlRingTex = function() {

	var _values = this.getValues();

	var _res = [];

	_res.push('<table>');
	_res.push('<tr>');
	_res.push('<td>');
	_res.push('<table class="solid">');
	_res.push('<tr>');
	_res.push('<td>$+$</td>');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('<td><b>$');
		_res.push(this.tex(_values[i]));
		_res.push('$</b></td>');
	}

	_res.push('</tr>');

	for(var i = 0; i < this.size; i++) {

		_res.push('<tr>');
		_res.push('<td><b>$');
		_res.push(this.tex(_values[i]));
		_res.push('$</b></td>');
		
		for(var j = 0; j < this.size; j++) {

			_res.push('<td>$');
			var _sum = this.sum(_values[i], _values[j]);
			_res.push(this.tex(_sum));
			_res.push('$</td>');
		}

		_res.push('</tr>');
	}

	_res.push('</table>');
	_res.push('</td>');
	
	_res.push('<td>');
	_res.push('<table class="solid">');
	_res.push('<tr>');
	_res.push('<td>$*$</td>');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('<td><b>$');
		_res.push(this.tex(_values[i]));
		_res.push('$</b></td>');
	}

	_res.push('</tr>');

	for(var i = 0; i < this.size; i++) {

		_res.push('<tr>');
		_res.push('<td><b>$');
		_res.push(this.tex(_values[i]));
		_res.push('$</b></td>');
		
		for(var j = 0; j < this.size; j++) {

			_res.push('<td>$');
			var _prod = this.prod(_values[i], _values[j]);
			_res.push(this.tex(_prod));
			_res.push('$</td>');
		}

		_res.push('</tr>');
	}

	_res.push('</table>');
	_res.push('</td>')
	_res.push('</tr>');
	_res.push('</table>');

	return _res.join('');
}

function Real() {

	Ring.call();
	this.IsField = true;
}

Real.prototype = Object.create(Ring.prototype);
Real.prototype.constructor = Ring;

Real.prototype.ringTex = function() {

	return "\\\mathbb{R}";
}

function Zn(mod) {

	Ring.call();

	this.mod = mod
	this.size = mod;
	this.simpleSubfieldSize = mod;

	this.isField = true;

	if(mod > 2)
	{

        	var _sqr = Math.sqrt(this.mod);

        	for (var i = 2; i < _sqr + 1; i++)
        	{
        		if(this.mod % i === 0)
                	{
                		this.isField = false;
                		break;
                	}
		}
	}
}

Zn.prototype = Object.create(Ring.prototype);
Zn.prototype.constructor = Ring;

Zn.prototype.prod = function(a, b) {

	return Ring.prototype.prod(a, b) % this.mod;
}

Zn.prototype.sum = function(a, b) {

	return Ring.prototype.sum(a, b) % this.mod;
}

Zn.prototype.opposite = function(a) {

	if (a === 0) {

		return 0;
	}

	return this.mod - a % this.mod;
}

Zn.prototype.reverse = function(a) {

	var _res = getGCD(a, this.mod);

	if(_res.gcd !== 1) {

		return 0;
	}

	return _res.u > 0 ? u : this.mod + u;
}

Zn.prototype.equals = function(a, b) {
	
	return (a % this.mod) === (b % this.mod);
}

Zn.prototype.leftReverse = function(a) {

	return this.reverse(a);
}

Zn.prototype.rightReverse = function(a) {
	
	return this.reverse(a);
}

Zn.prototype.ringTex = function() {

	return '\\\mathbb{Z}_{' + this.mod + '}';
}

function Q(numerator, denumerator) {

	if(numerator > Number.MAX_SAFE_INTEGER || numerator < Number.MIN_SAFE_INTEGER
		|| denumerator > Number.MAX_SAFE_INTEGER || denumerator < Number.MIN_SAFE_INTEGER || denumerator === 0) {

		throw new SyntaxError("Incorrect input.")
	}


	if(numerator !== 0) {

		var _num = Math.abs(numerator);
		var _denum = Math.abs(denumerator);
		var _sign = Math.sign(numerator * denumerator);
		var _gcd = getGCD(_num, _denum);

		this.numerator = _sign * _num / _gcd.gcd;
		this.denumerator = _denum / _gcd.gcd;	
	} else {

		this.numerator = 0;
		this.denumerator = 1;
	}
}

Q.prototype.tex = function() {

	if (this.numerator === 0) {

		return '0';
	}
	
	var _rem = this.numerator % this.denumerator;
	var _int = Math.abs((this.numerator - _rem) / this.denumerator);
	var _res = "";
	if(this.numerator < 0) {

		_res += '-';
	}

	if(_int > 0) {

		_res += _int.toString();
	}
	
	if(_rem !== 0) {

		_res += '\\frac{' + Math.abs(_rem).toString() + '}{' + this.denumerator.toString() + '}';
	}

	return _res;
}

Q.prototype.prod = function(a) {

	if(a.numerator > Number.MAX_SAFE_INTEGER || a.numerator < Number.MIN_SAFE_INTEGER
		|| a.denumerator > Number.MAX_SAFE_INTEGER || a.denumerator < Number.MIN_SAFE_INTEGER) {

		throw new SyntaxError("Incorrect input.")
	}

	var _num = this.numerator * a.numerator;
	var _denum = this.denumerator * a.denumerator;
	return new Q(_num, _denum);
}

Q.prototype.div = function(a) {

	if(a.numerator > Number.MAX_SAFE_INTEGER || a.numerator < Number.MIN_SAFE_INTEGER
		|| a.denumerator > Number.MAX_SAFE_INTEGER || a.denumerator < Number.MIN_SAFE_INTEGER) {

		throw new SyntaxError("Incorrect input.")
	}

	var _num = this.numerator * a.denumerator;
	var _denum = this.denumerator * a.numerator;
	return new Q(_num, _denum);
}

Q.prototype.add = function(a) {


	if(a.numerator > Number.MAX_SAFE_INTEGER || a.numerator < Number.MIN_SAFE_INTEGER
		|| a.denumerator > Number.MAX_SAFE_INTEGER || a.denumerator < Number.MIN_SAFE_INTEGER) {

		throw new SyntaxError("Incorrect input.")
	}

	var _s1 = this.numerator * a.denumerator;
	var _s2 = a.numerator * this.denumerator;
	var _num = _s1 + _s2;
	var _denum = this.denumerator * a.denumerator;
	return new Q(_num, _denum);
	
}

Q.prototype.equals = function(a) {

	return this.numerator === a.numerator && this.denumerator === a.denumerator;
}

Q.prototype.real = function() {
	
	return this.numerator / this.denumerator;
}

Q.prototype.opposite = function() {

	return new Q(-this.numerator, this.denumerator);
}

Q.prototype.reverse = function() {

	return new Q(this.denumerator, this.numerator);
}

function Rational() {

	this.z = new Q(0, 1);
	this.o = new Q(1, 1);
	this.isField = true;
}

Rational.prototype = Object.create(Ring.prototype);
Rational.prototype.constructor = Ring;

Rational.prototype.zero = function() {

	return this.z;
}

Rational.prototype.one = function() {

	return this.o;
}

Rational.prototype.opposite = function(a) {

	return a.opposite();
} 

Rational.prototype.sum = function(a, b) {

	if (a === undefined) {

		return b.add(this.z);
	}

	if (b === undefined) {

		return a.add(this.z);
	}

	return a.add(b);
}

Rational.prototype.prod = function(a, b) {

	if (a === undefined || b === undefined ) {

		return this.z;
	}
	
	return a.prod(b);
}

Rational.prototype.reverse = function(a) {
	
	return a.reverse();
}

Rational.prototype.equals = function(a, b) {

	return a.equals(b);
}

Rational.prototype.ringTex = function() {

	return '\\\mathbb{Q}';
}

Rational.prototype.tex = function(a) {

	return a.tex();
}

function FiniteRing(addTable, multTable, simpleSubfieldSize) {

	if(addTable.length !== multTable.length) {

		throw new SyntaxError("Incorrect input.");
	}

	this.addTable = addTable;
	this.multTable = multTable;
	this.size = addTable.length;
	this.simpleSubfieldSize = simpleSubfieldSize;
}

FiniteRing.prototype = Object.create(Ring.prototype);
FiniteRing.prototype.constructor = Ring;

/*
FiniteRing.prototype.htmlRingTex = function() {

	var _res = [];

	_res.push('<table>');
	_res.push('<tr>');
	_res.push('<td>');
	_res.push('<table class="solid">');
	_res.push('<tr>');
	_res.push('<td>+</td>');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('<td><b>');
		_res.push(i.toString());
		_res.push('</b></td>');
	}

	_res.push('</tr>');

	for(var i = 0; i < this.size; i++) {

		_res.push('<tr>');
		_res.push('<td><b>');
		_res.push(i.toString());
		_res.push('</b></td>');
		
		for(var j = 0; j < this.size; j++) {

			_res.push('<td>');
			_res.push(this.addTable[i][j].toString());
			_res.push('</td>');
		}

		_res.push('</tr>');
	}

	_res.push('</table>');
	_res.push('</td>');
	
	_res.push('<td>');
	_res.push('<table class="solid">');
	_res.push('<tr>');
	_res.push('<td>*</td>');

	for(var i = 0; i < this.size; i++) {
		
		_res.push('<td><b>');
		_res.push(i.toString());
		_res.push('</b></td>');
	}

	_res.push('</tr>');

	for(var i = 0; i < this.size; i++) {

		_res.push('<tr>');
		_res.push('<td><b>');
		_res.push(i.toString());
		_res.push('</b></td>');
		
		for(var j = 0; j < this.size; j++) {

			_res.push('<td>');
			_res.push(this.multTable[i][j].toString());
			_res.push('</td>');
		}

		_res.push('</tr>');
	}

	_res.push('</table>');
	_res.push('</td>')
	_res.push('</tr>');
	_res.push('</table>');

	return _res.join('');
}
*/

FiniteRing.prototype.reverse = function(a) {

	for(var i = 0; i < this.size; i++) {

		if(this.multTable[a][i] === 1) {

			return i;
		}
	}

	return undefined;
}

FiniteRing.prototype.opposite = function(a) {

	for(var i = 0; i < this.size; i++) {

		if(this.addTable[a][i] === 0) {

			return i;
		}
	}

	return undefined;
}

FiniteRing.prototype.prod = function(a, b) {

	return this.multTable[a][b]; 
}

FiniteRing.prototype.sum = function(a, b) {

	return this.addTable[a][b]; 
}

FiniteRing.prototype.rightReverse = function(a) {

	for(var i = 0; i < this.size; i++) {
		
		if(this.multTable[i][a] === 1) {
	
			return i;
		}
	}

	return undefined;
}