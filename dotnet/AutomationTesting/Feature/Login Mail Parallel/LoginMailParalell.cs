using NUnit.Framework;
using AutomationFrameWork.Driver;
using AutomationFrameWork.ActionsKeys;
using System.Collections.Generic;
using System;
using AutomationTesting.POM.HomePage;
using OpenQA.Selenium;

namespace AutomationTesting.Feature.Login_Mail_Parallel
{


    [TestFixture(Browser.ChromeDesktop)]
    [TestFixture(Browser.iPad)]
    [TestFixture(Browser.FirefoxDesktop)]
    [TestFixture(Browser.InternetExplorerDesktop)]
    [TestFixture(Browser.iPhone4)]
    [TestFixture(Browser.iPhone5)]
    [TestFixture(Browser.iPhone6)]
    [TestFixture(Browser.Nexus6)]
    [TestFixture(Browser.Nexus7)]
    [TestFixture(Browser.PhantomJSBrowser)]
    [Parallelizable(ParallelScope.Self)]
    class TestParalell
    {

        Browser _driver;        
        public TestParalell (Browser type)
        {
            _driver = type;    
        }
        [SetUp]
        public void SetUp ()
        {
            DriverManager.StartDriver(_driver);
        }
        [Test]     
        [Category("SearchGoogle")]
        public void LoginMailSucessfullyParalell ()
        {
            LoginPage.Instance.Navigate("https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier");
            LoginPage.Instance.EnterUserName("specflowdemo@gmail.com");
            LoginPage.Instance.ClickNext();
            LoginPage.Instance.EnterPass("0934058877");
            LoginPage.Instance.ClickSignIn();
            LoginPage.Instance.Verify().ValidateLoginSucesfully("specflowdemo@gmail.com");
            if(_driver==Browser.PhantomJSBrowser)
            Console.WriteLine(((OpenQA.Selenium.PhantomJS.PhantomJSDriver)DriverManager.GetDriver<IWebDriver>()).Title);
        }
        [Test]      
        [Category("SearchGoogle")]
        public void LoginMailWrongUserName ()
        {
            LoginPage.Instance.Navigate("https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier");
            LoginPage.Instance.EnterUserName("specflowdesamo@gmail.com");
            LoginPage.Instance.ClickNext();
            LoginPage.Instance.Verify().ValidateUserNameErrorMsg("Sorry, Google doesn't recognize that email. ");
        }
        [Test]  
        [Category("SearchGoogle")]
        public void LoginMailWrongPass ()
        {
            LoginPage.Instance.Navigate("https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier");
            LoginPage.Instance.EnterUserName("specflowdemo@gmail.com");
            LoginPage.Instance.ClickNext();
            LoginPage.Instance.EnterPass("dsadsaddas");
            LoginPage.Instance.ClickSignIn();
            LoginPage.Instance.Verify().ValidatePassErrorMsg("The email and password you entered don't match.");
        }
        [Test, TestCaseSource("GetTestData")]     
        [Category("SearchGoogle")]
        public void TestDataDriven1 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4 && _driver!=Browser.PhantomJSBrowser)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
             WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven2 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4||_driver!=Browser.PhantomJSBrowser)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven3 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven4 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")] 
        [Category("SearchGoogle")]
        public void TestDataDriven5 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]   
        [Category("SearchGoogle")]
        public void TestDataDriven6 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]  
        [Category("SearchGoogle")]
        public void TestDataDriven7 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven8 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven9 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [Test, TestCaseSource("GetTestData")]
        [Category("SearchGoogle")]
        public void TestDataDriven10 (string search)
        {
            WebKeywords.Instance.Navigate("https://google.com");
            if (_driver != Browser.iPhone4)
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("lst-ib")), search);
            else
                WebKeywords.Instance.SetText(DriverManager.GetDriver<IWebDriver>().FindElement(OpenQA.Selenium.By.Id("mib")), search);
        }
        [TearDown]
        public void TearDown ()
        {
            DriverManager.CloseDriver();
        }

        private static IEnumerable<String> GetTestData ()
        {
            String[] data = { "Samsung Galaxy Note 5", "Apple iPhone 6+", "QA Automation", "Selenium and Nunit", "FaceBook" };
            foreach (String temp in data)
            {
                yield return temp;
            }
        }
    }
}