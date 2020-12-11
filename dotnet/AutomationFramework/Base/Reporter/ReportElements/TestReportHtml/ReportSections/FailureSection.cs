using System.Web.UI;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Extensions;

namespace AutomationFrameWork.Reporter.ReportElements.TestReportHtml
{
    public static class FailureSection
    {
        public static HtmlTextWriter AddFailure (this HtmlTextWriter writer, TestInformations test, string id = "")
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, id.Equals("") ? "table-cell" : id);
            writer.AddStyleAttribute(HtmlTextWriterStyle.Padding, "20px");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            if (!test.IsSuccess())
            {
                writer.RenderBeginTag(HtmlTextWriterTag.P);
                writer.AddTag(HtmlTextWriterTag.B, "Message: ");
                writer.Write(NunitTestHtml.GenerateTxtView(test.TestMessage));
                writer.RenderEndTag(); //P
                writer.RenderBeginTag(HtmlTextWriterTag.P);
                writer.AddTag(HtmlTextWriterTag.B, "Stack trace: ");
                writer.Write(NunitTestHtml.GenerateTxtView(test.TestStackTrace));
                writer.RenderEndTag(); //P
            }
            else
            {
                writer.Write("Test was successful, there is no failure message");
            }
            writer.RenderEndTag();//DIV
            return writer;
        }
    }
}
