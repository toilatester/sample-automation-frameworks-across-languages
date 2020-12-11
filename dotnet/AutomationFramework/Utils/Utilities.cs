using AutomationFrameWork.Driver;
using AutomationFrameWork.Exceptions;
using AutomationFrameWork.Helper;
using Newtonsoft.Json.Linq;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AutomationFrameWork.Utils
{
    public class Utilities
    {
        private static readonly Utilities _instance = new Utilities();
        static Utilities ()
        {
        }
        public static Utilities Instance
        {
            get
            {
                return _instance;
            }
        }
        /// <summary>
        /// This method is use for
        /// get file in project with relative path
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public string GetRelativePath (string path)
        {
            //return Path.GetFullPath(Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory)), "..//" + path));           
            System.Console.WriteLine(Path.Combine(Path.GetFullPath(Directory.GetParent(Directory.GetCurrentDirectory()).FullName),path));
            return Path.GetFullPath(Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName,path));
        }
        /// <summary>
        /// This method is use for
        /// return JSON in string get by JSONXPath
        /// </summary>
        /// <param name="file"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public string ReadJSONXPath (string RelativeFilePath, string JSONXPath)
        {
            JObject json = JObject.Parse(File.ReadAllText(GetRelativePath(RelativeFilePath)));
            if (json.SelectToken(JSONXPath) == null)
                throw new InvalidOperationException("Can not find JSON data with JSON path '" + JSONXPath + "', please input correct JSONXPath, Ex: ['Parrent Root'].['Child Root'] ");
            return json.SelectToken(JSONXPath).ToString();
        }
        /// <summary>
        /// This method is use for
        /// Return text in source text by using regular expression
        /// </summary>
        /// <param name="source"></param>
        /// <param name="regex"></param>
        /// <returns></returns>
        public List<string> FindMatchText (string sourceText,string regexText)
        {
            if (regexText == null || regexText.Trim().Length == 0 || regexText.Length==0)
                throw new StepErrorException("Regular Expression cannot null or blank");           
            List<String> returnMatchText = new List<string>();
            try 
            {              
                Regex regex = new Regex(regexText);               
                foreach (Match match in regex.Matches(sourceText))
                {
                    returnMatchText.Add(match.Value);
                }
            }
            catch (ArgumentException)
            {
                throw new StepErrorException("Regular Expression is invalid");
            }
            if (returnMatchText.Count==0)
                throw new StepErrorException("Not found match text in source text");
            return returnMatchText;
        }
        /// <summary>
        /// This method is use for
        /// capture image of element
        /// can use for report and UI testing
        /// </summary>
        /// <param name="element"></param>
        /// <param name="path"></param>
        /// <param name="creationTime"></param>
        /// <param name="formatType"></param>
        public void GetWebElementBaseImage (object element,string path= null, DateTime creationTime = default(DateTime), ImageFormat formatType = null)
        {
            var now = DateTime.Now;
            var screenName = string.Format("screenshot_{0}.{1}", now.ToString("yyyyMMddHHmmssfff"), (formatType ?? ImageFormat.Png).ToString().ToLower());
            path = path ?? Utilities.Instance.GetRelativePath("BaseImage\\");
            Directory.CreateDirectory(path);
            creationTime = creationTime.Equals(default(DateTime)) ? now : creationTime;
            var screenshot = (DriverManager.GetDriver<IWebDriver>() as ITakesScreenshot).GetScreenshot();                
            using (MemoryStream stream = new MemoryStream(screenshot.AsByteArray))
            {
                using (Bitmap bitmap = new Bitmap(stream))
                {
                    var elementScreenShot = (IWebElement)element;
                    RectangleF part = new RectangleF(elementScreenShot.Location.X, elementScreenShot.Location.Y, elementScreenShot.Size.Width, elementScreenShot.Size.Height);
                    using (Bitmap bn = bitmap.Clone(part, bitmap.PixelFormat))
                    {
                        bn.Save(path+screenName, (formatType ?? ImageFormat.Png));
                    }
                }
            }

        }
    }
}
