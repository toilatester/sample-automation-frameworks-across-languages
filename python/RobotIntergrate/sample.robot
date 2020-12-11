*** Settings ***
Library         GUI.POM.RegisterPage.RegisterPage
Library         Core.Config.DriverFactory.DriverFactory
Library         SeleniumLibrary
Suite Setup      create driver
Suite Teardown  dispose driver
*** Test Cases ***
Sample Test
    open register page
    register with account  Test Another     anothernewemailsample@sample.com    12345678
    click register button
