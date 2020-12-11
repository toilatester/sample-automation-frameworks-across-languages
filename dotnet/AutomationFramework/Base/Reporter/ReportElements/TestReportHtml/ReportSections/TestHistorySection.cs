using System.Web.UI;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Reporter.ReportUtils;

namespace AutomationFrameWork.Reporter.ReportElements.TestReportHtml
{
    public static class TestHistorySection
    {
        public static HtmlTextWriter AddTestHistory (this HtmlTextWriter writer, TestInformations test, string id = "")
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, id.Equals("") ? "table-cell" : id);
            writer.AddStyleAttribute(HtmlTextWriterStyle.Padding, "20px");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            writer.AddAttribute(HtmlTextWriterAttribute.Id, Output.GetHistoryChartId(test.Guid, test.DateTimeFinish));
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            writer.RenderEndTag();//DIV
            writer.RenderEndTag();//DIV
            return writer;
        }
    }
}
