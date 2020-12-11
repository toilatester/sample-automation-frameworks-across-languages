using NUnit.Framework;
using AutomationFrameWork.Driver;
using AutomationFrameWork.ActionsKeys;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Appium.Enums;
using AutomationTesting.POM.HomePage;
using OpenQA.Selenium.Appium;
namespace AutomationTesting.Feature.Login_Mail_Mobile
{
    class LoginMailInMobile
    {

        [SetUp]
        public void SetUp ()
        {          
            NodeFactory.Instance.StrartNodeServer("127.0.0.1", 6969, 6968, 6767);
            DesiredCapabilities caps = new DesiredCapabilities();
            caps.SetCapability("deviceName", "Note5");
            caps.SetCapability("udid", "0415313132353234");
            caps.SetCapability("browserName", MobileBrowserType.Chrome);          
            string _remoteUri = "http://" + NodeFactory.Instance.AddressNumber + ":" + NodeFactory.Instance.PortNumber + "/wd/hub";          
        }
        [Test]
        public void LoginMailSucessfullyMobile ()
        {
            DriverManager.StartDriver(Browser.Android);
            WebKeywords.Instance.Navigate("https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier");
            LoginPage.Instance.EnterUserName("specflowdemo@gmail.com");
            LoginPage.Instance.ClickNext();
            LoginPage.Instance.EnterPass("0934058877");
            LoginPage.Instance.ClickSignIn();
            LoginPage.Instance.Verify().ValidateLoginSucesfully("specflowdemo@gmail.com - Gmail");
        }
        [TearDown]
        public void TearDown ()
        {
            DriverManager.CloseDriver();
            NodeFactory.Instance.CloseNodeServer();
        }
    }
}
