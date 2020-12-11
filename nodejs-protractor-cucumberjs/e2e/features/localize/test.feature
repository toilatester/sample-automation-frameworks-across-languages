Feature: Sample Feature for localization
As a user
I could change language of the page

    Scenario: Title is changed as selected language
        Given I am on Localize home page
        And Title is displayed in English
        When I change language into Espanol
        Then Title is displayed in Espanol