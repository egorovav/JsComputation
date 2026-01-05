var _par = document.querySelector('p');
var _body = document.querySelector('body');

var _real = new Real();
var _real_polynom1 = new Polynom(_real, [1, -3, -3, 1]);
var _real_polynom2 = new Polynom(_real, [1, 1]);
_par.innerHTML += _real_polynom1.divHtml(_real_polynom2, 'x');