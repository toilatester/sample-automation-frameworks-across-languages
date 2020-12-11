const {
	Given,
	When,
	Then
} = require('cucumber');
const {
	expect
} = require('chai');
const {
	LoggerHelper
} = require('../../helper/log4js');
const logger = new LoggerHelper("Common Step");
Given('Sample URL', function () {
	logger.logInfo("Given Sample URL");
	console.log("Given Sample URL");
	this.number = 10;
});

Given('There are {int} cucumbers', function (totalCucumbers) {
	logger.logInfo("There are {int} cucumbers");
	console.log("There are {int} cucumbers");
	this.sumCucumber = totalCucumbers;
});

When('I Input text to URL', function () {
	logger.logInfo("I Input text to URL");
	console.log("I Input text to URL");
	this.number += 1;
});

When('I eat {int} cucumbers', function (reduceCucumbers) {
	logger.logInfo("I eat {int} cucumbers");
	console.log("I eat {int} cucumbers");
	this.sumCucumber -= reduceCucumbers;
});

Then('Then console log input URL', function () {
	logger.logInfo("Then console log input URL");
	console.log("Then console log input URL");
	this.number += 1;
	expect(1).to.be.equal(2);
});

Then('I should have {int} cucumbers', function (expectNumber) {
	logger.logInfo("I should have {int} cucumbers");
	console.log("I should have {int} cucumbers");
	console.log(expectNumber);
	expect(expectNumber).to.be.equal(this.sumCucumber);
});

Then('I should have <start> <eat> <left> cucumbers', function (dataTable) {
	logger.logInfo("I should have <start> <eat> <left> cucumbers");
	console.log("I should have <start> <eat> <left> cucumbers");
});