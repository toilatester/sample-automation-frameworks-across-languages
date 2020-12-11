using OpenQA.Selenium;
using AutomationFrameWork.Base;
using AutomationFrameWork.ActionsKeys;

namespace AutomationTesting.POM.HomePage
{
    class LoginPage : BasePageWeb<LoginPage, LoginElement, LoginValidate>
    {

        public void Navigate (string url)
        {
            WebKeywords.Instance.Navigate(url);
        }
        public void EnterUserName (string username)
        {
            WebKeywords.Instance.SetText(Element.txtUserName, username);
        }
        public void ClickNext ()
        {
            WebKeywords.Instance.Click(Element.btnNext);
        }
        public void ClickSignIn ()
        {
            WebKeywords.Instance.Click(Element.btnSignin);
        }
        public void EnterPass (string pass)
        {       
            WebKeywords.Instance.WaitElementToBeClickable(Element.waitTxtPass, 30);
            WebKeywords.Instance.SetText(Element.txtPassword, pass);
        }
    }
}