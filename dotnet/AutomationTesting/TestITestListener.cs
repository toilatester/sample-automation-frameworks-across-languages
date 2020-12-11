using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using System.Runtime.CompilerServices;
using NUnit.Engine;
using AutomationFrameWork.Driver;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using AutomationFrameWork.Utils;
using AutomationFrameWork.ActionsKeys;
using System.Web.UI;
using System.IO;
using AutomationFrameWork.Extensions;
using System.Collections.ObjectModel;
using Mono.Collections.Generic;
using OpenQA.Selenium.Support.PageObjects;
using AutomationFrameWork.Driver.Interface;
using OpenQA.Selenium.Support;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.Events;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Appium;

namespace AutomationTesting
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
    [Parallelizable(ParallelScope.Self)]
    public class TestITestListener
    {
        public TestITestListener(Browser browserType)
        {
            _type = browserType;            
        }
        Browser _type;        
        object driverType;
        IWebDriver driver;       
        [Category("Capture Element Image")]
        [Test]
        public void Event ()
        {
            ChromeOptions op = new ChromeOptions();
            op.EnableMobileEmulation("Apple iPhone 4");
            //DriverFactory.Instance.DriverOption = op;          
            DriverManager.StartDriver(Browser.ChromeDesktop);
            IWebDriver driver = DriverManager.GetDriver<IWebDriver>();
            driver.Url = "https://www.whatismybrowser.com/";
            IWebElement el = driver.FindElement(By.XPath("//*[@id='holder']//*[@class='detection-primary content-block']"));
            WebKeywords.Instance.GetScreenShot();
            Utilities.Instance.GetWebElementBaseImage(el, formatType: System.Drawing.Imaging.ImageFormat.Jpeg);
            driver.Dispose();
            DriverManager.CloseDriver();
        }
        [Category("TestReportTemplate")]
        [Test]
        public void CreateHTML ()
        {
            string FullPage = string.Empty;
            var strWr = new StringWriter();
            using (var writer = new HtmlTextWriter(strWr))
            {
                writer.Write("<!DOCTYPE html>");
                writer.AddAttribute(HtmlTextWriterAttribute.Id,"Test");
                writer.RenderBeginTag(HtmlTextWriterTag.Head);
                writer.AddAttribute("http-equiv", "X-UA-Compatible");
                writer.AddAttribute("content", @"IE=edge");
                writer.AddAttribute("charset", "utf-8");
                writer.RenderBeginTag(HtmlTextWriterTag.Meta);
                writer.RenderEndTag();
                writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
                writer.AddAttribute(HtmlTextWriterAttribute.Type, "text/css");
                writer.AddAttribute(HtmlTextWriterAttribute.Href, @"D:\WorkSpace\Git\AutomationFramework\AutomationFramework\Base\Reporter\EmbeddedResources\Primer\primer.css");
                writer.RenderBeginTag(HtmlTextWriterTag.Link);
                writer.RenderEndTag();
                writer.NewLine = "\r\n";
                writer.AddAttribute(HtmlTextWriterAttribute.Id, "Div 1");              
                writer.AddStyleAttribute(HtmlTextWriterStyle.TextAlign, "center");
                writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.AddAttribute(HtmlTextWriterAttribute.Id, "testname");
                writer.RenderBeginTag(HtmlTextWriterTag.A);
                writer.RenderBeginTag(HtmlTextWriterTag.H1);
                writer.Write("Test this show in html page");                
                writer.NewLine = "\r\n";
                writer.RenderEndTag();        
                writer.RenderEndTag();
                writer.RenderEndTag();
                writer.RenderEndTag();               
                writer.Write("</html>");        
            }
            FullPage = strWr.ToString();
            File.WriteAllText(@"C:\Users\Minh\Desktop\New folder\TestReport.html", FullPage);
        }
        #region
        //Test FindContext
        [Test]
        [Parallelizable(ParallelScope.Self)]
        [Category("Context")]
        public void TestContextFind()
        {
            //IDriver<IWebDriver> test = new ChromeDesktop { Driver= new ChromeDesktop().StartDriver()};

            IWebDriver driver = new ChromeDriver();
            driver.Url = "http://www.google.com";
            driver.Navigate().GoToUrl("http://vtc.vn");
            driver.Navigate().Back();
            driver.FindElement(OpenQA.Selenium.By.Id("lst-ib")).SendKeys("test this show with long string ");

            driver.FindElement(OpenQA.Selenium.By.Id("lst-ib")).Clear();

            driver.FindElement(OpenQA.Selenium.By.Id("lst-ib")).SendKeys("test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string  test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string test this show with long string ");

            driver.Quit();
        }

        #endregion
        [Test]        
        [Category("WebDriverListner")]
        public void TestFactory()
        {
            
            IWebDriver driver = new FirefoxDriver();           
            driver = new EventFiringWebDriver(driver);
            ((EventFiringWebDriver)driver).Navigated+= new EventHandler<WebDriverNavigationEventArgs>(EventFiringInstance_Navigated);
            ((EventFiringWebDriver)driver).FindingElement += new EventHandler<FindElementEventArgs>(ClickEvent);
            driver.Url = "http://www.google.com";
            driver.FindElement(OpenQA.Selenium.By.Id("lst-ib"));        
            driver.Quit();
        }
        private void EventFiringInstance_Navigated(object sender, WebDriverNavigationEventArgs e)
        {
            Console.WriteLine(sender.ToString());
            Console.WriteLine("Test: "+e.Url);       
        }
        private void ClickEvent(object sender, FindElementEventArgs e)
        {
            Console.WriteLine(e.FindMethod.ToString());
        }
        [Test]
        [Category("TestListner")]
        public void TestAddInFailed()
        {
            POM.TestFramework.TestFrameworkAction.Instance.DoSomething("Minh Hoang Test");
            Assert.True(POM.TestFramework.TestFrameworkAction.Instance.CheckSingleton(),POM.TestFramework.TestFrameworkAction.Instance.Message);
            
        }
        [Test]
        [Category("TestListner")]
        public void TestAddInIgnore()
        {
            throw new IgnoreException("Ignore");
            POM.TestFramework.TestFrameworkAction.Instance.DoSomething("Minh Hoang Test");
            Assert.True(POM.TestFramework.TestFrameworkAction.Instance.CheckSingleton(), POM.TestFramework.TestFrameworkAction.Instance.Message);

        }
        [Test]
        [Category("TestListner")]
        public void TestAddInPass()
        {
            POM.TestFramework.TestFrameworkAction.Instance.DoSomething("Minh Hoang Test");
            Assert.True(!POM.TestFramework.TestFrameworkAction.Instance.CheckSingleton(), POM.TestFramework.TestFrameworkAction.Instance.Message);

        }
        [Test]
        [Category("Test Nested Class")]       
        public void TestAddInExplicit()
        {          
            POM.TestFramework.TestFrameworkAction.Instance.DoSomeThing().PrintSomeThing().Verify().ValidateFalse(true).ValidateTrue(true).ValidateString("TEst mnasda");
            POM.TestFramework.TestFrameworkAction.Instance.DoSomeThing().PrintSomeThing().Verify().ValidateFalse(true).ValidateTrue(true).ValidateString("TEsrsd");
        }
        [Test]
        [Category("Test MARIONETTE Driver")]
        public void TestMaruonetteDriver()
        {
            //System.Environment.SetEnvironmentVariable("webdriver.gecko.driver", @"D:\WorkSpace\Git\AutomationFramework\Drivers\geckodriver.exe");
            //FirefoxDriverService service = FirefoxDriverService.CreateDefaultService(@"D:\WorkSpace\Git\AutomationFramework\Drivers\", "geckodriver.exe");
            //service.Port = 64444;
            //service.FirefoxBinaryPath = @"C:\Program Files (x86)\Mozilla Firefox\firefox.exe";
            IWebDriver driver = new FirefoxDriver();
            driver.Url = "https://www.google.com";
            //driver.Quit();
        }
        [Test]
        [Category("HTMLUnit Driver")]
        public void TestHtmlUnit()
        {            
            var remoteServer = new Uri("http://localhost:6969/wd/hub/");
            DesiredCapabilities desiredCapabilities = DesiredCapabilities.HtmlUnit();
            desiredCapabilities.IsJavaScriptEnabled = true;
            var WebDriver = new RemoteWebDriver(remoteServer,desiredCapabilities);
           
            WebDriver.Manage().Timeouts().ImplicitlyWait(new TimeSpan(0, 0, 30));
            //go to url 
            WebDriver.Navigate().GoToUrl("https://www.kbb.com");
            Console.WriteLine(WebDriver.Title);
            WebDriver.Quit();
        }
        [Test,Category("Appium Test")]
        public void OpenSampleApp()
        {          
            DesiredCapabilities caps = new DesiredCapabilities();
            caps.SetCapability("deviceName", "Note5");
            caps.SetCapability("udid", "0415313132353234");
            caps.SetCapability("appActivity",".activities.login.LoginActivity");            
            //caps.SetCapability("appWaitActivity", ".activities.main.MainActivity");
            caps.SetCapability("appWaitPackage", "com.sample.directory");
            var driver = new AndroidDriver<AppiumWebElement>(new Uri("http://127.0.0.1:4723/wd/hub"), caps);
          
            driver.FindElement(By.Id("com.sample_technology.sampledirectory:id/userNameEditText")).SendKeys("minhhoang");
            driver.FindElement(By.Id("com.sample_technology.sampledirectory:id/passwordEditText")).SendKeys("sample@1234");
            driver.FindElement(By.Id("com.sample_technology.sampledirectory:id/loginBtn")).Click();
            System.Threading.Thread.Sleep(10000);
            driver.FindElement(By.Id("com.sample_technology.sampledirectory:id/editText")).SendKeys("minh hoang");
            Console.WriteLine(driver.FindElement(By.Id("com.sample_technology.sampledirectory:id/editText")).Text);
            System.Threading.Thread.Sleep(10000);
            driver.Quit();
        }
    }
}
