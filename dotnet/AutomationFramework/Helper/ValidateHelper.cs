using AutomationFrameWork.ActionsKeys;
using OpenQA.Selenium;
using System.Drawing;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;
using AutomationFrameWork.Utils;
namespace AutomationFrameWork.Helper
{

    public class ValidateHelper
    {      
        private static readonly ValidateHelper _instance = new ValidateHelper();
        static ValidateHelper()
        {
        }
        public static ValidateHelper Instance
        {
            get
            {
                return _instance;
            }
        }
        /// <summary>
        /// This method is use for
        /// Return list of CSS value for verify
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        public Dictionary<string, string> ReturnActualCssValue(IWebElement element)
        {
            CSSHelper CssHelper = new CSSHelper();
            CssHelper.GetCssAttribute(CssHelper);
            Dictionary<string, string> ActualCssValue = new Dictionary<string, string>();
            ActualCssValue.Add("font-size", WebKeywords.Instance.GetCssValue(element, CssHelper.size));
            ActualCssValue.Add("font-family", WebKeywords.Instance.GetCssValue(element, CssHelper.family));
            ActualCssValue.Add("font-weight", WebKeywords.Instance.GetCssValue(element, CssHelper.weight));
            ActualCssValue.Add("line-height", WebKeywords.Instance.GetCssValue(element, CssHelper.height));
            ActualCssValue.Add("margin-top", WebKeywords.Instance.GetCssValue(element, CssHelper.top));
            ActualCssValue.Add("margin-bottom", WebKeywords.Instance.GetCssValue(element, CssHelper.bottom));
            ActualCssValue.Add("font-color", ConvertFontColor(WebKeywords.Instance.GetCssValue(element, CssHelper.color)));
            return ActualCssValue;
        }
        /// <summary>
        /// This method is use for
        /// Return list of Css value in expected file
        /// </summary>
        /// <param name="file"></param>
        /// User input file with contain relative of file Ex: ..//Resources//CSS.txt
        /// <param name="path"></param>
        /// User input path with contain Json xpah Ex: ['Parrent Root'].['Child Root'].
        /// <returns></returns>
        public Dictionary<string, string> ReturnExpectedCSSValue(string RelativeFilePath,string JSONXPath)
        {
            Dictionary<string, string> ExpectedCssValue = new Dictionary<string, string>();
            CSSHelper CssHelper = new CSSHelper();
            var expected = JsonConvert.DeserializeObject<CSSHelper>(Utilities.Instance.ReadJSONXPath(RelativeFilePath, JSONXPath));
            ExpectedCssValue.Add("font-size", expected.size);
            ExpectedCssValue.Add("font-family", expected.family);
            ExpectedCssValue.Add("font-weight", expected.weight);
            ExpectedCssValue.Add("line-height", expected.height);
            ExpectedCssValue.Add("margin-top", expected.top);
            ExpectedCssValue.Add("margin-bottom", expected.bottom);
            ExpectedCssValue.Add("font-color", expected.color);
            return ExpectedCssValue;

        }
        /// <summary>
        /// This method is use for
        /// Convert font color of element from ARGB to HEX Ex: (0,0,0,1)=> #ffffff
        /// </summary>
        /// <param name="colorFormat"></param>
        /// <returns></returns>
        private string ConvertFontColor(string colorFormat)
        {
            string color = string.Empty;
            if (colorFormat.Contains("rgba"))
            {
                color = ColorTranslator.ToHtml(Color.FromArgb(Int16.Parse(Regex.Split(colorFormat, @"\D+")[1]), Int16.Parse(Regex.Split(colorFormat, @"\D+")[2]), Int16.Parse(Regex.Split(colorFormat, @"\D+")[3])));
            }
            else
            {
                Console.WriteLine("Not correct in format and can not convert");
                color = colorFormat;
            }
            return color;
        }
    }

}