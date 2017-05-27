/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * HttpStatusCode.
 */
"use strict";
var HttpStatusCode = (function () {
    function HttpStatusCode() {
    }
    return HttpStatusCode;
}());
HttpStatusCode.success = 200;
HttpStatusCode.noContent = 204;
HttpStatusCode.fail = 500;
HttpStatusCode.requestTimeout = 408;
HttpStatusCode.duplicateLogin = 1004;
exports.HttpStatusCode = HttpStatusCode;
