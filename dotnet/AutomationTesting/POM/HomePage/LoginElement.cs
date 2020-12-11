using AutomationFrameWork.Base;
using OpenQA.Selenium;
namespace AutomationTesting.POM.HomePage
{
    public class LoginElement : BaseWebElements
    {
        public IWebElement txtUserName
        {
            get
            {
                return WebDriver.FindElement(By.Id("Email"));
            }
        }
        public IWebElement btnNext
        {
            get
            {
                return WebDriver.FindElement(By.Id("next"));
            }
        }
        public IWebElement txtPassword
        {
            get
            {
                return WebDriver.FindElement(By.Id("Passwd"));
            }
        }
        public IWebElement btnSignin
        {
            get
            {
                return WebDriver.FindElement(By.Id("signIn"));
            }
        }
        public IWebElement lblErrorUserMsg
        {
            get
            {
                return WebDriver.FindElement(By.Id("errormsg_0_Email"));
            }
        }
        public By waitLblErrorUserMsg
        {
            get
            {
                return By.Id("errormsg_0_Email");
            }
        }
        public IWebElement lblErrorPassMsg
        {
            get
            {
                return WebDriver.FindElement(By.Id("errormsg_0_Passwd"));
            }
        }
        public By waitLblErrorPassMsg
        {
            get
            {
                return By.Id("errormsg_0_Passwd");
            }
        }
        public By waitTxtPass
        {
            get
            {
                return By.Id("Passwd");
            }
        }       
    }
}