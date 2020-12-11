using System.Collections.Generic;
using AutomationFrameWork.Reporter.ReportItems;
using System.IO;
using System.Web.UI;
using AutomationFrameWork.Extensions;
using AutomationFrameWork.Reporter.ReportUtils;

namespace AutomationFrameWork.Reporter.ReportElements.ReportSections
{
    internal class TestListSection
    {
        public string HtmlCode;

        public TestListSection (List<TestInformations> tests)
        {
            var treeCode = Tree.GetTreeCode(tests);
            var stringWriter = new StringWriter();
            using (var writer = new HtmlTextWriter(stringWriter))
            {
                writer
                    .Tag(HtmlTextWriterTag.Div,
                        () => writer
                            .Float("right")
                            .Div(() => writer
                                .DangerButton("Back", Output.Files.FullReportFile)
                            )
                    )
                    .Tag(HtmlTextWriterTag.Div, () => writer
                        .Write(treeCode)
                    );
            }
            HtmlCode = stringWriter.ToString();
        }
    }
}
