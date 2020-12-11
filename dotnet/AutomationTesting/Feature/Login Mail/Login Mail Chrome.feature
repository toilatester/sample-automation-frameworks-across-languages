Feature: Login Mail Chrome
	In order to send mail
	I want to be login to mail mail account

	
	
Scenario: Login Mail Sucessfully
	Given I start 'Chrome' browser to run
	Given I have entered 'https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier' in browser
	When I have entered 'specflowdemo@gmail.com' into the username
	And I click on next button
	And I have entered '0934058877' into the password
	And i click login button
	Then the login page display sucessfully with contain 'specflowdemo@gmail.com - Gmail'
                                                          

Scenario: Login mail with wrong user name
	Given I start 'Chrome' browser to run
	Given I have entered 'https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier' in browser
	When I have entered 'specflowdemotestthisnotvaliduser@gmail.com' into the username
	And I click on next button
	Then The username error message display 'Sorry, Google doesn't recognize that email. '
Scenario: Login mail with wrong pass
	Given I start 'Chrome' browser to run
	Given I have entered 'https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier' in browser
	When I have entered 'specflowdemo@gmail.com' into the username
	And I click on next button
	And I have entered '09340588773421321' into the password
	And i click login button
	Then The login error message display 'The email and password you entered don't match.'
