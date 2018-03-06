export var Authen;
(function (Authen) {
    var TokenDecoded = /** @class */ (function () {
        function TokenDecoded() {
            this._id = "";
            this.email = "";
            this.password = "";
        }
        return TokenDecoded;
    }());
    Authen.TokenDecoded = TokenDecoded;
})(Authen || (Authen = {}));
