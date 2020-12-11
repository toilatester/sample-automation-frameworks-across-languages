using AutomationFrameWork.Exceptions;
using OpenQA.Selenium;
using System.Threading;
using System;
using System.Reflection;
using System.Linq;

namespace AutomationFrameWork.Driver
{
    public static class DriverManager
    {
        private static ThreadLocal<object> _driverStored = new ThreadLocal<object>();
        /// <summary>
        /// This method return driver base on generic TypeofDriver
        /// Ex: GetDriver<IWebDriver> will return IWebDriver
        /// GetDriver<PhantomJSDriver> will return PhantomJSDriver
        /// </summary>        
        public static DriverType GetDriver<DriverType>()
        {
            return (DriverType)DriverStored;
        }

        /// <summary>
        /// This is use for stored driver 
        /// when running in paralell in single machine
        /// </summary>
        private static object DriverStored
        {
            get
            {
                if (_driverStored == null || _driverStored.Value == null)
                    throw new StepErrorException("Please call method 'StartDriver' before can get Driver");
                return _driverStored.Value;
            }
            set
            {
                _driverStored.Value = value;
            }
        }
        /// <summary>
        /// This method is use for instance driver
        /// </summary>
        /// <param name="factoryType"></param>
        /// <param name="type"></param>
        /// <param name="configuaration"></param>     
        public static void StartDriver(Browser type, DriverConfiguration driverConfiguaration = null)
        {
            driverConfiguaration = driverConfiguaration ?? new DriverConfiguration();
            Type foundClass = Assembly.GetExecutingAssembly().GetTypes()
                    .Where(item => item.Namespace == Constants.DRIVER_NAME_SPACE && item.Name.Equals(type.ToString(), StringComparison.OrdinalIgnoreCase))
                    .FirstOrDefault();

            if (foundClass != null)
            {
                object instance = Activator.CreateInstance(foundClass);
                Type classType = instance.GetType();
                MethodInfo method = classType.GetMethod("StartDriver", BindingFlags.Public | BindingFlags.InvokeMethod | BindingFlags.Instance);
                method.Invoke(instance, new object[] { driverConfiguaration });
                PropertyInfo property = classType.GetProperty("Driver");
                DriverStored= property.GetValue(instance, null);
            }
            else
                throw new OperationCanceledException("WebBrowser for" + type + " is not implemented"); 
        }
        /// <summary>
        /// This method is use for close and destroy driver
        /// </summary>
        public static void CloseDriver()
        {
            IWebDriver driver = (IWebDriver)DriverStored;
            driver.Quit();
            driver.Dispose();
            if (DriverStored != null)
                DriverStored = null;
        }
    }
}
