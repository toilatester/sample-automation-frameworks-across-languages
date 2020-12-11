using AutomationFrameWork.Driver;
using NUnit.Framework;
using OpenQA.Selenium.PhantomJS;
using System;
using System.IO;

namespace AutomationTesting.DemoPhantomJS
{
    class NetworkSniffer
    {        
        [SetUp]
        public void SetUp()
        {
            DriverConfiguration configuration = new DriverConfiguration();
            var options = new PhantomJSOptions();
            options.AddAdditionalCapability("phantomjs.page.settings.UserAgent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36");
            var services = PhantomJSDriverService.CreateDefaultService();
            services.LogFile = "D:\\AutomationReport\\Log.txt";
            configuration.DriverServices = services;
            configuration.DesiredCapabilities = options;
            DriverManager.StartDriver(Browser.PhantomJSBrowser,configuration);
        }
        [Test,Description("Demo PhantomJS"),Category("Demo Network Sniffer")]
        public void DemoNetworkSniffer()
        {
            var driver = DriverManager.GetDriver<OpenQA.Selenium.PhantomJS.PhantomJSDriver>();           driver.ExecutePhantomJS(File.ReadAllText(@"D:\WorkSpace\Git\AutomationFramework\AutomationTesting\Feature\Demo Network Sniffer\netlog.js"));             
            driver.Url = "https://www.google.com";
            System.Console.WriteLine(driver.Title);

        }
        [TearDown]
        public void TearDown()
        {
            DriverManager.CloseDriver();
        }
    }
}
