Feature: Log out
        When I logged in
    I could loggout successfully

    @Suite3
    Scenario: Loggout successfully
        Given I logged in with user "myusername" and password "SH@ring0ne"
        And I am on Sample App Home page
        When I log out
        Then I see Login Page displayed
