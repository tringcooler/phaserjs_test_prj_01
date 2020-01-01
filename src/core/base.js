var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

/*
var subclass = (function(_super) {
	__extends(subclass, _super);
	function subclass(arg) {
        var new_arg = null;
		_super.call(this, arg, new_arg);
	}
    subclass.prototype.method = function(arg) {
        var new_arg = null;
        return _super.prototype.method.call(this, arg, new_arg);
    };
    return subclass;
})(superclass)
*/

var __supermethod = this.__supermethod || function (_spr, _slf, mth) {
    if(_spr.prototype[mth]) {
        return _spr.prototype[mth].bind(_slf);
    } else {
        return function() {};
    }
};
