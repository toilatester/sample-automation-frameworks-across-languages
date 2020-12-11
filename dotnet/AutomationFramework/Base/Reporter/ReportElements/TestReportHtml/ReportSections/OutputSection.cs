using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Extensions;
using System.Web.UI;

namespace AutomationFrameWork.Reporter.ReportElements.TestReportHtml
{
    public static class OutputSection
    {
        public static HtmlTextWriter AddOutput (this HtmlTextWriter writer, TestInformations test, string testOutput, string id = "")
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Id, id.Equals("") ? "table-cell" : id);
            writer.AddStyleAttribute(HtmlTextWriterStyle.Padding, "20px");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            if (test.HasOutput)
            {
                writer.RenderBeginTag(HtmlTextWriterTag.P);
                writer.AddTag(HtmlTextWriterTag.B, "Test output: ");
                writer.Write(NunitTestHtml.GenerateTxtView(testOutput));
                writer.RenderEndTag(); //P
            }
            else
            {
                writer.Write("Test output is empty");
            }
            writer.RenderEndTag();//DIV
            return writer;
        }
    }
}
