const { default: axios } = require("axios");

const DEFAULT_HOST = "http://192.168.74.17";
const DEFAULT_PORT = 7000;
const DEFAULT_TIMEOUT = 10000;


class BaseAPI {
    constructor(path = "/") {
        this.path = path;
        this.headers = undefined;
        this.data = {};
        this.__response_body = undefined;
        this.__response_code = undefined;
    }

    get __baseRequest() {
        return axios.create({
            baseURL: `${DEFAULT_HOST}:${DEFAULT_PORT}`,
            timeout: DEFAULT_TIMEOUT,
            headers: {

            }
        })
    }

    /**
     * Get response body
     */
    get responseBody() {
        return this.__response_body;
    }

    /**
     * Get response code
     */
    get responseCode() {
        return this.__response_code;
    }

    /**
     * 
     * @param {Object} data . If not set, 
     * @param {AxiosRequestConfig} header 
     */
    async post(data = {}, header = {}) {
        try {
            // Get default data from class if data param is empty
            if (data) {
                data = this.data;
            }
            let result = await this.__baseRequest.post(this.path, data, { headers: header });
            this.parseResult(result)
        }
        catch (error) {
            this.parseResult(error.response)
        }
    }

    /**
     * Send a GET request and parse response into responseBody and responseCode
     * @param {Object} params 
     * @param {Object} headers 
     */
    async get(params = {}, headers = {}) {
        try {
            let result = this.__baseRequest.get(this.path, { headers: headers, params: params });
            this.parseResult(result)
        }
        catch (error) {
            this.parseResult(error.response)
        }
    }

    parseResult(result) {
        this.__response_body = result.data;
        this.__response_code = result.status;
    }
}

exports.BaseAPI = BaseAPI;
