using System;


namespace AutomationFrameWork.Reporter.ReportAttributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class | AttributeTargets.Assembly, AllowMultiple = true)]
    public class TestRemark : Attribute
    {
        public TestRemark (string remarkMessage, string remarkDate)
        {
            RemarkMessage = remarkMessage;
            RemarkDate = DateTime.Parse(remarkDate);
        }

        public TestRemark (string remarkMessage, int year, int month, int day, int hour = 0, int minute = 0, int second = 0)
        {
            RemarkMessage = remarkMessage;
            RemarkDate = new DateTime(year, month, day, hour, minute, second);
        }

        public DateTime RemarkDate
        {
            get;
        }
        public string RemarkMessage
        {
            get;
        }
    }
}
