using System;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Extensions;
using System.Web.UI;
namespace AutomationFrameWork.Reporter.ReportElements.TestReportHtml
{
    public static class TestResultSection
    {
        public static HtmlTextWriter AddTestResult (this HtmlTextWriter writer, TestInformations test, string id = "")
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, id.Equals("") ? "table-cell" : id);
            writer.AddStyleAttribute(HtmlTextWriterStyle.Padding, "20px");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);

            writer.RenderBeginTag(HtmlTextWriterTag.P);
            writer.AddTag(HtmlTextWriterTag.B, "Test full name: ");
            writer.Write(test.FullName);
            writer.RenderEndTag(); //P

            writer.RenderBeginTag(HtmlTextWriterTag.P);
            writer.AddTag(HtmlTextWriterTag.B, "Test name: ");
            writer.Write(test.Name);
            writer.RenderEndTag(); //P

            writer.RenderBeginTag(HtmlTextWriterTag.P);
            writer.AddTag(HtmlTextWriterTag.B, "Test duration: ");
            writer.Write(TimeSpan.FromSeconds(test.TestDuration).ToString(@"hh\:mm\:ss\:fff"));
            writer.RenderEndTag(); //P

            writer.RenderBeginTag(HtmlTextWriterTag.P);
            writer.AddTag(HtmlTextWriterTag.B, "Time period: ");
            var start = test.DateTimeStart.ToString("dd.MM.yy HH:mm:ss.fff");
            var end = test.DateTimeFinish.ToString("dd.MM.yy HH:mm:ss.fff");
            writer.Write(start + " - " + end);
            writer.RenderEndTag(); //P

            writer.AddStyleAttribute(HtmlTextWriterStyle.BackgroundColor, test.GetColor());
            writer.RenderBeginTag(HtmlTextWriterTag.P);
            writer.RenderBeginTag(HtmlTextWriterTag.B);
            writer.Write("Test result: ");
            writer.RenderEndTag(); //B
            writer.Write(test.Result);
            writer.RenderEndTag(); //P

            writer.RenderEndTag(); //DIV
            return writer;
        }
    }
}
