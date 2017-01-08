// ADD / REMOVE / HAS CLASS ========================================================
Node.prototype.hasClass = function (className) {
    if (this.classList) {
        return this.classList.contains(className);
    } else {
        return (-1 < this.className.indexOf(className));
    }
};

Node.prototype.addClass = function (className) {
    if (this.classList) {
        this.classList.add(className);
    } else if (!this.hasClass(className)) {
        var classes = this.className.split(" ");
        classes.push(className);
        this.className = classes.join(" ");
    }
    return this;
};

Node.prototype.removeClass = function (className) {
    if (this.classList) {
        this.classList.remove(className);
    } else {
        var classes = this.className.split(" ");
        classes.splice(classes.indexOf(className), 1);
        this.className = classes.join(" ");
    }
    return this;
};

// NUMBER REMAP
Number.prototype.remap = function ( in_min , in_max , out_min , out_max ) {
  var x = this
	if (x < in_min) { x = in_min }
	if (x > in_max) { x = in_max }
  	return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

var remap = function (x, in_min , in_max , out_min , out_max ) {
	if (x < in_min) { x = in_min }
	if (x > in_max) { x = in_max }
  	return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}


function extend(obj, props) {
    for(var prop in props) {
        if(props.hasOwnProperty(prop)) {
            obj[prop] = props[prop];
        }
    }
}
