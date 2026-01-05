var _par = document.querySelector('p');
var _body = document.querySelector('body');

var _Zn = new Zn(3);
var _pol1 = new Polynom(_Zn, [1, 1, 0, 0]);
var _pol2 = new Polynom(_Zn, [1, 1, 1, 1]);
var _sum = _pol1.add(_pol2);
_par.textContent += '$$' + _Zn.ringTex() + '$$';
_par.textContent += '$$('+ _pol1.tex() + ') + (' + _pol2.tex() + ') = ' + _sum.tex() +'$$';
var _pol3 = _sum.mult(2); 
_par.textContent += '$$2 * (' + _sum.tex() + ') = ' + _pol3.tex() + '$$'

var _prod = _pol1.prod(_pol2);
_par.textContent += '$$('+ _pol1.tex() + ') * (' + _pol2.tex() + ') = ' + _prod.tex() +'$$';

var _mults = _prod.factorisation();
_par.textContent += '$$' + _prod.tex() + ' = ';

for(var i = 0; i < _mults.length; i++) {

	_par.textContent += '(' + _mults[i].tex() + ')';
}

_par.textContent += '$$';

var _rational = new Rational();
_par.textContent += '$$' + _rational.ringTex() + '$$';

var _q12 = new Q(1, 2);
var _q_12 = new Q(-1, 2);
var _q1_2 = new Q(1, -2);

var _q32 = new Q(3, 2);
var _q_32 = new Q(-3, 2);
var _q3_2 = new Q(3, -2);

var _q1 = new Q(85239, 483);
var _q2 = new Q(483, 85239);

var _q010 = new Q(0, 10);

_par.textContent += 
'$$'+ _q12.tex()+','+_q_12.tex()+','+_q1_2.tex()+','+_q32.tex()+','+_q_32.tex()+','+_q3_2.tex()+','+_q1.tex()+','+_q2.tex()+','+_q010.tex()+'$$';

_par.textContent += 
'$$'+_q32.tex()+'+'+_q12.tex()+'='+_q32.add(_q12).tex()+';'+_q12.tex()+'*'+_q_12.tex()+'='+_q12.prod(_q_12).tex()+';'+_q32.reverse().tex()+'$$';

var _q_pol1 = new Polynom(_rational, [_q12, _q_12, _q32]); 
var _q_pol2 = new Polynom(_rational, [_q12, _q12, _q32]); 
var _q_mult1 = _q_pol1.prod(_q_pol2);
var _div_res = _q_mult1.div(_q_pol2, false);
_par.textContent += '$$\\left('+_q_pol1.tex()+'\\right)+\\left('+_q_pol2.tex()+'\\right)='+_q_pol1.add(_q_pol2).tex()+'$$'
_par.textContent += '$$\\left('+_q_pol1.tex()+'\\right)*\\left('+_q_pol2.tex()+'\\right)='+_q_mult1.tex()+'$$'
_par.textContent += '$$\\left('+_q_mult1.tex()+'\\right):\\left('+_q_pol2.tex()+'\\right)='+_div_res.quot.tex()+'$$'

var _q_pol3 = new Polynom(_rational, [new Q(-5, 1), new Q(8, 1), new Q(-3, 1), new Q(-4, 1), new Q(2, 1), new Q(0, 1), new Q(1, 1)]);
var _q_pol4 = new Polynom(_rational, [new Q(1, 1), new Q(-1, 1), new Q(1, 1), new Q(0, 1), new Q(0, 1), new Q(1, 1)]);
var _gcd = Polynom.getGCD(_q_pol3, _q_pol4);
_par.textContent += '$$\\gcd{(' + _q_pol3.tex()+','+_q_pol4.tex()+')}='+_gcd.gcd.tex()+'$$'

var _Zn5 = new Zn(5);
var _pol101 = new Polynom(_Zn5 , [1, 0, 1]);
var _pol11 = new Polynom(_Zn5 , [1, 1]);
_par.textContent += '$$' + _Zn5.ringTex() + '$$';
var _div_res2 = _pol101.div(_pol11, false);
var _rem = _div_res2.remainders[_div_res2.remainders.length - 1]
_par.textContent += '$$'+_pol101.tex()+'=('+_pol11.tex()+')*('+_div_res2.quot.tex()+')+'+_rem.tex()+'$$'
 
var _m1 = new Matrix(_Zn5, [[1, 2, 3], [4, 0, 1], [2, 3, 4]], 3, 3);
var _m2 = new Matrix(_Zn5, [[4, 3, 2], [1, 0, 4], [3, 2, 1]], 3, 3);
_par.textContent += '$$'+_m1.tex()+'+2*'+_m2.tex()+'='+_m1.tex()+'+'+_m2.mult(2).tex()+'='+_m1.add(_m2.mult(2)).tex()+'$$';
_par.textContent += '$$'+_m1.tex()+'*'+_m2.tex()+'='+_m1.prod(_m2).tex()+'$$';

var _m3 = new Matrix(_Zn5, [[1, 2, 3, 1], [4, 0, 1, 1], [2, 3, 4, 1]], 3, 4);
var _m4 = new Matrix(_Zn5, [[4, 3, 2], [1, 0, 4], [3, 2, 1], [1, 1, 1]], 4, 3);
_par.textContent += '$$'+_m3.tex()+'*'+_m4.tex()+'='+_m3.prod(_m4).tex()+'$$';

_par.textContent += '$$A='+_m4.tex()+'\\Rightarrow{M}_A\\binom{1}{1}='+_m4.getMinor(1, 1).tex()+';M_A\\binom{2}{1}='+_m4.getMinor(2, 1).tex()+'$$';

var _r = new Rational();
_par.textContent += '$$' + _r.ringTex() + '$$';
var _m5 = new Matrix(_r, 
[
[new Q(1, 1), new Q(2, 1), new Q(3, 1), new Q(4, 1), new Q(1, 1)], 
[new Q(-3, 1), new Q(2, 1), new Q(-5, 1), new Q(13, 1), new Q(2, 1)], 
[new Q(1, 1), new Q(-2, 1), new Q(10, 1), new Q(4, 1), new Q(3, 1)], 
[new Q(-2, 1), new Q(9, 1), new Q(-8, 1), new Q(25, 1), new Q(4, 1)], 
[new Q(1, 1), new Q(2, 1), new Q(3, 1), new Q(4, 1), new Q(5, 1)]
], 5, 5);
var _m5d = _m5.getDeterminant();
var _m5dr = _m5d.reverse();
var _m5a = _m5.getAdjugate();
var _m5r = _m5.reverse();
_par.textContent += '$$A='+_m5.tex()+';|A|='+_m5d.tex()+';A^{-1}=|A|^{-1}A^*='+_m5dr.tex()+'*'+_m5a.tex()+'='+_m5r.tex()+';A*A^{-1}='+_m5.prod(_m5r).tex()+'$$';

var _m6 = new Matrix(_r,
[
[new Q(1, 1), new Q(5, 1), new Q(3, 1), new Q(1, 1)],
[new Q(-3, 1), new Q(-1, 1), new Q(-4, 1), new Q(2, 1)],
[new Q(2, 1), new Q(3, 1), new Q(1, 1), new Q(3, 1)],
], 3, 4);

var _m6e = _m6.convertToE();

var _m7 = new Matrix(_r, 
[
[new Q(12, 1), new Q(9, 1), new Q(3, 1), new Q(10, 1), new Q(13, 1)],
[new Q(4, 1), new Q(3, 1), new Q(1, 1), new Q(2, 1), new Q(3, 1)],
[new Q(8, 1), new Q(6, 1), new Q(2, 1), new Q(5, 1), new Q(7, 1)]
], 3, 5);

var _m7e = _m7.convertToE();

_par.textContent += '$$'+_m6.tex()+'\\sim'+_m6e.tex()+';'+_m7.tex()+'\\sim'+_m7e.tex()+'$$'

var _m6_1 = new Matrix(_r,
[
[new Q(1, 1), new Q(5, 1), new Q(3, 1)],
[new Q(-3, 1), new Q(-1, 1), new Q(-4, 1)],
[new Q(2, 1), new Q(3, 1), new Q(1, 1)],
], 3, 3);

var _m6_2 = new Matrix(_r,
[
[new Q(1, 1)],
[new Q(2, 1)],
[new Q(3, 1)],
], 3, 1);

var _res6 = Matrix.solveLs(_m6);


var _m7_1 = new Matrix(_r, 
[
[new Q(12, 1), new Q(9, 1), new Q(3, 1), new Q(10, 1)],
[new Q(4, 1), new Q(3, 1), new Q(1, 1), new Q(2, 1)],
[new Q(8, 1), new Q(6, 1), new Q(2, 1), new Q(5, 1)]
], 3, 4);


var _m7_2 = new Matrix(_r, 
[
[new Q(13, 1)],
[new Q(3, 1)],
[new Q(7, 1)]
], 3, 1);

var _res7 = Matrix.solveLs(_m7);

_par.textContent += '$$'+_m6_1.tex()+_res6.tex()+'='+_m6_2.tex()+'$$'

//+_m7_1.tex()+_res7.tex()+'='+_m7_2.tex()+_m7_2.tex()+_m7_2.tex()+

var _xix = Polynom.matrixCharPolynom(_m5);
var _mp = _xix.getMatrixPolynom(_m5.rowCount);
var _mres = _mp.getValue(_m5);
_par.textContent += '$$\\chi_A(x)='+ _xix.tex() + ';\\chi_A(A)=' + _mres.tex() + '$$'

var _GF2 = new Zn(2); 
var _mod = new Polynom(_GF2, [1, 1, 0, 1]); 
var _pxfx = new PxFx(_GF2, _mod); 
var _pxfx_one = _pxfx.one();
var _pxfx_zero = _pxfx.zero();

_par.textContent += '$$'+_pxfx.ringTex()+'$$';
var _pol9 = new Polynom(_pxfx, [_pxfx_one, _pxfx_zero, _pxfx_one, _pxfx_one]);

var _mults1 = _pol9.factorisation();

_par.textContent += '$$' + _pol9.tex() + ' = ';

for(var i = 0; i < _mults1.length; i++) {

	_par.textContent += '(' + _mults1[i].tex() + ')';
}

_par.textContent += '$$';

var _pol10 = new Polynom(_pxfx, [_pxfx_one, _pxfx_zero, _pxfx_one, _pxfx_one, _pxfx_one]);
var _prod = _pol9.prod(_pol10);
var _mults1 = _prod.factorisation();
_par.textContent += '$$(' + _pol9.tex() + ')(' + _pol10.tex() + ')=' + _prod.tex() + ' = ';

for(var i = 0; i < _mults1.length; i++) {

	_par.textContent += '(' + _mults1[i].tex() + ')';
}


_par.textContent += '$$';

//var _q = _prod.div(_pol9);
//_par.textContent +=  '$$' + _q.quot.tex() + '$$';

//MathJax.Hub.Queue(['Typeset', MathJax.Hub, _body]);

//var _fr = _pxfx.asFiniteRing(); 
//var _html = _fr.htmlRingTex();
var _html = _pxfx.htmlRingTex();

//_body.innerHTML += '$$'+_pxfx.ringTex()+'$$';
_body.innerHTML += _html;

var _mod1 = new Polynom(_GF2, [1, 0, 1, 1]); 
var _pxfx1 = new PxFx(_GF2, _mod1); 
//var _fr1 = _pxfx1.asFiniteRing(); 
//var _html1 = _fr1.htmlRingTex();
var _html1 = _pxfx1.htmlRingTex();

_body.innerHTML += '$$'+_pxfx1.ringTex()+'$$';
_body.innerHTML += _html1;

_body.innerHTML += '<br/>';

//_body.innerHTML += _pol101.html('x', true);
//_body.innerHTML += _q_mult1.divHtml(_q_pol2, 'x');

//_body.innerHTML += _q_mult1.divTex(_q_pol2, 'x');

var _pol21 = new Polynom(_GF2, [0, 1, 1, 1, 0, 1, 0, 0, 1]);
var _denum21 = new Polynom(_GF2, [1, 1, 0, 1]);
var _div_res21 = _pol21.div(_denum21);
//var _div_res21 = _pol21.div(_pol21);
//_body.innerHTML += _pol21.divHtml(_denum21, 'x');
//_body.innerHTML += _pol21.divTex(_denum21, 'x');
var _gcd21 = Polynom.getGCD(_pol21, _denum21);
_body.innerHTML += '$('+_pol21.tex()+','+_denum21.tex()+')='+_gcd21.gcd.tex()+'$'

var _mults21 = _div_res21.quot.factorisation();
_body.innerHTML += '$$'+_div_res21.quot.tex()+'=';
for(var i = 0; i < _mults21.length; i++) {

	_body.innerHTML += '(' + _mults21[i].tex() + ')';
}
_body.innerHTML += '$$';

var _GF3 = new Zn(3);
var _pol31 = new Polynom(_GF3, [0, 2, 1]);
var _pol32 = new Polynom(_GF3, [0, 1]);
var _pol33 = new Polynom(_GF3, [1, 2, 0, 1]);
var _prod31 = _pol31.prod(_pol31).prod(_pol31).prod(_pol32);
_body.innerHTML += _prod31.divHtml(_pol33, 'x');
_body.innerHTML += _prod31.divTex(_pol33, 'x');

var _pol41 = new Polynom(_r, [new Q(4, 1), new Q(4, 1), new Q(2, 1), new Q(1, 1), new Q(3, 1)]);
var _pol42 = new Polynom(_r, [new Q(3, 1), new Q(4, 1), new Q(5, 1)]);
_body.innerHTML += _pol41.divHtml(_pol42, 'x');


var _real = new Real();
var _real_polynom1 = new Polynom(_real, [1, -3, -3, 1]);
var _real_polynom2 = new Polynom(_real, [1, 1]);
_body.innerHTML += _real_polynom1.divHtml(_real_polynom2, 'x');
