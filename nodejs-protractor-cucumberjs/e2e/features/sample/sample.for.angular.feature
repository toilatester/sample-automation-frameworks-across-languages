Feature: Sample feature for Angular page
    Test for waiting in Angular page

    @Suite1 @Suite2
    Scenario: Test with https://private.domain.com/
        Given I am on Sample App Login page
        When I login with user "myusername" and password "P@ssw0rd"
        Then I should see account icon displayed - HP
