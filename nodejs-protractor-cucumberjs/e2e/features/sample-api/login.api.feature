Feature: Sample API Test for Laura
    Test for Laura Login page

    @Suite4
    Scenario: Test with https://private.domain.com/
        Given I send a request with email "abcd@gmail.com" and password "564fbbae9c61193ee47630bda1841bdb"
        Then I should see the response code is 200
        And I should see the response contains jwtToken and username is hello
        And ABC