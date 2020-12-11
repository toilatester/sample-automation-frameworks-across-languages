const { expect } = require('chai');
const { Given, When, Then, Before } = require('cucumber');
const { wait } = require('../../core/wait');
const { LoginAPI } = require('../../eom/laura/login.api');

let loginApi = new LoginAPI();

Given('I send a request with email {string} and password {string}',
    async function login(email, password) {
        await loginApi
            .setEmail(email)
            .setPassword(password)
            .post();
    });

Then('I should see the response code is {int}',
    async function (expectedStatusCode) {
        let actualStatusCode = loginApi.responseCode;
        Logger.info("Actual Status Code: ", actualStatusCode);
        expect(actualStatusCode).to.be.equal(expectedStatusCode);
    });

Then('I should see the response contains jwtToken and username is {word}',
    async function (username) {
        let actualResponseBody = loginApi.responseBody;
        Logger.info("Actual Response Body: ", actualResponseBody);
        expect(actualResponseBody["jwtToken"]).to.be.an("String");
        expect(actualResponseBody["username"]).to.be.equal(username);
    });

