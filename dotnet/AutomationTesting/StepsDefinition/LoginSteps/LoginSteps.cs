using TechTalk.SpecFlow;
using AutomationTesting.POM.HomePage;
using NUnit.Framework;
namespace AutomationTesting.StepsDefinition.LoginSteps
{
    [Parallelizable(ParallelScope.Self)]
    [Binding]
    public class LoginSteps
    {
        [Given(@"I have entered '(.*)' in browser")]
        public void GivenIHaveEnteredInBrowser (string url)
        {
            LoginPage.Instance.Navigate(url);
        }

        [When(@"I have entered '(.*)' into the username")]
        public void WhenIHaveEnteredIntoTheUsername (string username)
        {
            LoginPage.Instance.EnterUserName(username);
        }

        [When(@"I click on next button")]
        public void WhenIClickOnNextButton ()
        {
            LoginPage.Instance.ClickNext();
        }

        [When(@"I have entered '(.*)' into the password")]
        public void WhenIHaveEnteredIntoThePassword (string password)
        {
            LoginPage.Instance.EnterPass(password);
        }

        [When(@"i click login button")]
        public void WhenIClickLoginButton ()
        {
            LoginPage.Instance.ClickSignIn();
        }

        [Then(@"the login page display sucessfully with contain '(.*)'")]
        public void ThenTheLoginPageDisplaySucessfullyWithContain (string expected)
        {
            LoginPage.Instance.Verify().ValidateLoginSucesfully(expected);
        }
        [Then(@"The username error message display '(.*)'")]
        public void ThenTheUsernameErrorMessageDisplay (string expected)
        {
            LoginPage.Instance.Verify().ValidateUserNameErrorMsg(expected);
        }
        [Then(@"The login error message display '(.*)'")]
        public void ThenTheLoginErrorMessageDisplay (string expected)
        {
            LoginPage.Instance.Verify().ValidatePassErrorMsg(expected);
        }
    }
}