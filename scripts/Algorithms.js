// Return great common divisor of a, b and numbers U, V such as GCD = a * U + b * V.
getGCD = function(a, b) {

	var gcd = 0;

	if (a == 0)
        {
                u = 0;
                v = (b == 0 ? 0 : 1);
                gcd = b;
            }
            else if (b == 0)
            {
                v = 0;
                u = (a == 0 ? 0 : 1);
                gcd = a;
            }
            else
            {
                r1 = b;
                r2 = a % b;

                u1 = 1;
                u2 = 0;
                v1 = 1;
                v2 = 1;
                q = 0;

                if (r2 == 0)
                    u1 = 0;
                else
                    v1 = (-a - (-a % b)) / b;

                temp = 0;

                while (r2 != 0)
                {
                    q = (r1 - r1 % r2) / r2;
                    temp = r2;
                    r2 = r1 % r2;
                    r1 = temp;
                    temp = u1;
                    u1 = u2 - u1 * q;
                    u2 = temp;
                    temp = v1;
                    v1 = v2 - v1 * q;
                    v2 = temp;
                }

                u = u2;
                v = v2;
                gcd = r1;
            }

            if (gcd < 0)
            {
                gcd = -gcd;
                u = -u;
                v = -v;
            }

            return {gcd, u, v};
}

function PermutationIterator(length) { 

	this.Length = length;
	this.Position = length;
	this.InnerCurrent = undefined;
	
	if(length > 1) {

		this.InnerIterator = new PermutationIterator(length - 1);
	}
	else if(length === 1)
	{
		this.InnerIterator = [[]].values();
	}		
}

PermutationIterator.prototype.next = function() {

	if(this.Position > this.Length - 1) {
		
		this.Position = 0;
		var _innerNext = this.InnerIterator.next();
		
		if(_innerNext.done) {

			return { value : undefined, done : true }
		}
		else {
	
			this.InnerCurrent = _innerNext.value;
		}
	}

	var _current = this.InnerCurrent.slice(0);
	_current.splice(this.Position, 0, this.Length - 1);
	this.Position++;
	return { value : _current, done : false }
}

getInversionCount = function(perm) {

	var _permCount = 0;

	for(var i = 0; i < perm.length - 1; i++) {

		for(var j = i + 1; j < perm.length; j++) {

			if(perm[j] < perm[i])
				_permCount++;
		}
	}

	return _permCount;
} 