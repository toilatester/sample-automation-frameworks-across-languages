using AutomationFrameWork.Reporter.ReportUtils;
using System;
using System.IO;
using System.Xml.Serialization;
namespace AutomationFrameWork.Reporter.ReportHelpers
{
    public static class ReportXMLHelper
    {
        public static void Save<T> (this T t, string fullPath) where T : class
        {
            try
            {
                var ser = new XmlSerializer(typeof(T));
                using (var fs = new FileStream(fullPath, FileMode.CreateNew))
                {
                    ser.Serialize(fs, t);
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Save exception");
            }
        }

        public static T Load<T> (string fullPath, string exceptionMessage = "") where T : class
        {
            try
            {
                T t;
                var ser = new XmlSerializer(typeof(T));
                using (var fs = new FileStream(fullPath, FileMode.Open))
                {
                    t = (T)ser.Deserialize(fs);
                }
                return t;
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, exceptionMessage.Equals("") ? "Load exception" : exceptionMessage);
                return null;
            }
        }
    }
}
