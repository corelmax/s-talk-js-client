export var Authen;
(function (Authen) {
    class TokenDecoded {
        constructor() {
            this._id = "";
            this.email = "";
            this.password = "";
        }
    }
    Authen.TokenDecoded = TokenDecoded;
})(Authen || (Authen = {}));
