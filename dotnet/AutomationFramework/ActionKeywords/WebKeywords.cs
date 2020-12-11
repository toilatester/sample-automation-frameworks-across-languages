using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using AutomationFrameWork.Driver;
using OpenQA.Selenium.Internal;
using System.Collections.ObjectModel;
using AutomationFrameWork.Exceptions;
using OpenQA.Selenium.Interactions;
using System.Drawing.Imaging;

namespace AutomationFrameWork.ActionsKeys
{
    public class WebKeywords
    {
        private static readonly WebKeywords _instance = new WebKeywords();      
        private WebKeywords()
        {            
        }
        static WebKeywords()
        {
        }      
        public static WebKeywords Instance
        {
            get
            {               
                return _instance;
            }
        }
        /// <summary>
        /// This method is use for 
        /// navigate to URL
        /// User can use param with Uri Ex: /home/contact
        /// </summary>
        /// <param name="url"></param>
        public void Navigate(String url)
        {
            if (!(url.StartsWith("http://") || url.StartsWith("https://")))
                throw new StepErrorException("URL is invalid format and cannot open page");
            DriverManager.GetDriver<IWebDriver>().Navigate().GoToUrl(url);
        }
        /// <summary>
        /// This method will naviagte to URL 
        /// It require param with exactly in URL format 
        /// Ex: https://github.com/minhhoangvn http://github.com/minhhoangvn
        /// </summary>
        /// <param name="url"></param>
        public void OpenUrl(String url)
        {
            if (!(url.StartsWith("http://") || url.StartsWith("https://")))
                throw new StepErrorException("URL is invalid format and cannot open page");
           DriverManager.GetDriver<IWebDriver>().Url = url;
        }
        /// <summary>
        /// This method is use for
        /// select option from dropdown list or combobox
        /// </summary>
        /// <param name="element"></param>
        /// <param name="type"></param>
        /// <param name="options"></param>
        public void Select(IWebElement element, SelectType type, string options)
        {
            SelectElement select = new SelectElement(element);
            switch (type)
            {
                case SelectType.SelectByIndex:
                    try
                    {
                        select.SelectByIndex(Int32.Parse(options));
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.GetBaseException().ToString());
                        throw new ArgumentException("Please input numberic on selectOption for SelectType.SelectByIndex");
                    }
                    break;
                case SelectType.SelectByText:
                    select.SelectByText(options);
                    break;
                case SelectType.SelectByValue:
                    select.SelectByValue(options);
                    break;
                default:
                    throw new Exception("Get error in using Selected");
            }
        }
        /// <summary>
        /// This method use for 
        /// click 
        /// </summary>
        /// <param name="element"></param>
        public void Click(IWebElement element)
        {
            Actions _action = new Actions(DriverManager.GetDriver<IWebDriver>());
            _action.MoveToElement(element).Build().Perform();
            element.Click();
        }
        /// <summary>
        /// This method user for 
        /// enter text 
        /// </summary>
        /// <param name="element"></param>
        /// <param name="text"></param>
        public void SetText(IWebElement element, string text)
        {
            try
            {
                element.Clear();
                element.SendKeys(text);
            }
            catch (WebDriverException e)
            {
                throw new StepErrorException("Element is not enable for set text" +"\r\n"+"error: " + e.Message);
            }
           
        }
        /// <summary>
        /// This method use for 
        /// wait element ready to click 
        /// </summary>
        /// <param name="locatorValue"></param>
        /// <param name="timeOut"></param>
        public void WaitElementToBeClickable(By locatorValue, int timeOut)
        {
            try
            {
                WebDriverWait wait = new WebDriverWait(DriverManager.GetDriver<IWebDriver>(), TimeSpan.FromSeconds(timeOut));
                wait.Until(ExpectedConditions.ElementToBeClickable(locatorValue));
            }
            catch (WebDriverTimeoutException e)
            {
                throw new OperationCanceledException("Get "+e.Message+", "+locatorValue+" is not ready for clickable");
            }
        }
        /// <summary>
        /// This method use for 
        /// wait element visible on DOM
        /// </summary>
        /// <param name="locatorValue"></param>
        /// <param name="timeOut"></param>
        public void WaitElementVisible (By locatorValue, int timeOut)
        {
            try
            {
                WebDriverWait wait = new WebDriverWait(DriverManager.GetDriver<IWebDriver>(), TimeSpan.FromSeconds(timeOut));
                wait.Until(ExpectedConditions.ElementIsVisible(locatorValue));
            }
            catch (WebDriverTimeoutException e)
            {
                throw new OperationCanceledException("Get " + e.Message + ", " + locatorValue + " is not visible");
            }
        }
        /// <summary>
        /// This method use for 
        /// wait title of page contain string user want
        /// </summary>
        /// <param name="title"></param>
        /// <param name="timeOut"></param>
        public void WaitTitleContains(string title, int timeOut)
        {
            try { 
            WebDriverWait wait = new WebDriverWait(DriverManager.GetDriver<IWebDriver>(), TimeSpan.FromSeconds(timeOut));
            wait.Until(ExpectedConditions.TitleContains(title));
            }
            catch (WebDriverTimeoutException e)
            {
                throw new OperationCanceledException("Get " + e.Message + ", [" + title + "] is not displayed in WebPage title [" +DriverManager.GetDriver<IWebDriver>().Title+"]");
            }
        }
        /// <summary>
        /// This method use for 
        /// get attribute of element in DOM
        /// </summary>
        /// <param name="element"></param>
        /// <param name="attribute"></param>
        /// <returns></returns>
        public string GetAttribute(IWebElement element, string attribute)
        {
            return element.GetAttribute(attribute);
        }
        /// <summary>
        /// This method use for Driver title of page
        /// </summary>
        /// <returns></returns>
        public string GetTitle()
        {
            return DriverManager.GetDriver<IWebDriver>().Title;
        }
        /// <summary>
        /// This method is use for
        /// return value of css
        /// </summary>
        /// <param name="element"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public string GetCssValue (IWebElement element, string value)
        {
            return element.GetCssValue(value);
        }
        /// <summary>
        /// This method is use for
        /// return source code of current page
        /// </summary>
        /// <returns></returns>
        public string GetPageSource ()
        {
            return DriverManager.GetDriver<IWebDriver>().PageSource;
        }
        /// <summary>
        /// This method use for 
        /// wait page load completed
        /// </summary>
        /// <param name="driver"></param>
        /// <param name="time"></param>
        public void WaitForPageToLoad(int time)
        {
            TimeSpan timeout = new TimeSpan(0, 0, time);
            WebDriverWait wait = new WebDriverWait(DriverManager.GetDriver<IWebDriver>(), timeout);
            IJavaScriptExecutor javascript =DriverManager.GetDriver<IWebDriver>() as IJavaScriptExecutor;
            if (javascript == null)
                throw new ArgumentException("driver", "Driver must support javascript execution");
            wait.Until((d) =>
            {
                try
                {
                    return javascript.ExecuteScript("return document.readyState").Equals("complete");
                }
                catch (InvalidOperationException e)
                {
                    //Window is no longer available
                    return e.Message.ToLower().Contains("unable to Driver browser");
                }
                catch (WebDriverException e)
                {
                    //Browser is no longer available
                    return e.Message.ToLower().Contains("unable to connect");
                }
                catch (Exception)
                {
                    return false;
                }
            });
        }
        /// <summary>
        /// This method use for
        /// set attribute of element
        /// </summary>
        /// <param name="element"></param>
        /// <param name="attributeName"></param>
        /// <param name="value"></param>
        public void SetAttribute(IWebElement element, string attributeName, string value)
        {
            IWrapsDriver wrappedElement = element as IWrapsDriver;
            if (wrappedElement == null)
                throw new ArgumentException("element", "Element must wrap a web driver");

            IWebDriver driver = wrappedElement.WrappedDriver;
            IJavaScriptExecutor javascript = driver as IJavaScriptExecutor;
            if (javascript == null)
                throw new ArgumentException("element", "Element must wrap a web driver that supports javascript execution");
            javascript.ExecuteScript("arguments[0].setAttribute(arguments[1], arguments[2])", element, attributeName, value);
        }
        /// <summary>
        /// This method use for 
        /// clear any text on text field
        /// </summary>
        /// <param name="element"></param>
        public void ClearText(IWebElement element)
        {
            element.Clear();
        }
        /// <summary>
        /// This method is use for
        /// Execute javascript
        /// </summary>
        /// <param name="driver"></param>
        /// <returns></returns>
        public IJavaScriptExecutor JavaScript(IWebDriver driver)
        {
            return (IJavaScriptExecutor)driver;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public void GetScreenShot (string path = null, DateTime creationTime = default(DateTime), ImageFormat formatType = null)
        {
            var now = DateTime.Now;           
            var screenName = string.Format("screenshot_{0}.{1}", now.ToString("yyyyMMddHHmmssfff"), (formatType ?? ImageFormat.Png).ToString().ToLower());
            path = path ?? Utils.Utilities.Instance.GetRelativePath("Screenshot\\");           
            System.IO.Directory.CreateDirectory(path);     
            creationTime = creationTime.Equals(default(DateTime)) ? now : creationTime; 
            (DriverManager.GetDriver<IWebDriver>() as ITakesScreenshot).GetScreenshot().SaveAsFile(path+screenName,(formatType ?? ImageFormat.Png));
        }
        public void GetScreenShotElement ()
        {
            
        }    
        /// <summary>
        /// This method is use for
        /// return element
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public IWebElement FindElement(string value)
        {
            IWebElement element=null;
            string LocatorType = value.Split(';')[0];
            string LocatorValue = value.Split(';')[1];
            switch (LocatorType.ToLower())
            {
                case "id":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.Id(LocatorValue));
                    break;
                case "name":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.Name(LocatorValue));
                    break;
                case "xpath":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.XPath(LocatorValue));
                    break;
                case "tag":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.TagName(LocatorValue));
                    break;
                case "link":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.LinkText(LocatorValue));
                    break;
                case "css":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.CssSelector(LocatorValue));
                    break;
                case "class":
                    element =DriverManager.GetDriver<IWebDriver>().FindElement(By.ClassName(LocatorValue));
                    break;
                default:
                    throw new ArgumentException("Support FindElement with 'id' 'name' 'xpath' 'tag' 'link' 'css' 'class'");
            }
            return element;
        }
        /// <summary>
        /// This method is use for
        /// return elements in list
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ReadOnlyCollection<IWebElement> FindElements (string value)
        {
            ReadOnlyCollection<IWebElement> elements = null;
            string LocatorType = value.Split(';')[0];
            string LocatorValue = value.Split(';')[1];
            switch (LocatorType.ToLower())
            {
                case "id":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.Id(LocatorValue));
                    break;
                case "name":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.Name(LocatorValue));
                    break;
                case "xpath":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.XPath(LocatorValue));
                    break;
                case "tag":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.TagName(LocatorValue));
                    break;
                case "link":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.LinkText(LocatorValue));
                    break;
                case "css":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.CssSelector(LocatorValue));
                    break;
                case "class":
                    elements =DriverManager.GetDriver<IWebDriver>().FindElements(By.ClassName(LocatorValue));
                    break;
                default:
                    throw new ArgumentException("Support FindElement with 'id' 'name' 'xpath' 'tag' 'link' 'css' 'class'");
            }
            return elements;
        }
    }
}
/// <summary>
/// This is enum for select option in keywords select
/// </summary>
public enum SelectType
{
    SelectByIndex,
    SelectByText,
    SelectByValue,
}
