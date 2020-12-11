const { BaseAPI } = require("../base.api");

class LoginAPI extends BaseAPI {
    constructor() {
        super("/auth/sign_in");
    }

    /**
     * Set email param for this API. Call this function without parameter to delete email property in post data
     * @param {string} email 
     */
    setEmail(email) {
        if (email) {
            this.data["email"] = email;
        }
        else {
            delete this.data["email"];
        }
        return this;    // TODO: Testing for this usage
    }
    
    /**
     * Set password param for this API. Call this function without parameter to delete email property in post data
     * @param {string} email 
     */
    setPassword(password) {
        if (password) {
            this.data["password"] = password;
        }
        else {
            delete this.data["password"];
        }
        return this;    // TODO: Testing for this usage
    }
}

exports.LoginAPI = LoginAPI;
