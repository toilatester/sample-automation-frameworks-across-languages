using AutomationFrameWork.Reporter.ReportUtils;
using System.IO;

namespace AutomationFrameWork.Reporter.ReportElements.ReportSections
{
    public class MainInfoChart
    {
        public string JsCode;

        public void SaveScript (string path)
        {
            var fullPath = Path.Combine(path, Output.Files.StatsScript);
            File.WriteAllText(fullPath, JsCode);
        }

        public MainInfoChart (MainStatistics stats, string id)
        {
            var data = "[" + $"{{name: 'Passed', y: {stats.TotalPassed}, color: '" + ReportColors.TestPassed + "'}," +
                       $"{{name: 'Failed', y: {stats.TotalFailed}, color: '" + ReportColors.TestFailed + "'}," +
                       $"{{name: 'Broken', y: {stats.TotalBroken}, color: '" + ReportColors.TestBroken + "'}," +
                       $"{{name: 'Ignored', y: {stats.TotalIgnored}, color: '" + ReportColors.TestIgnored + "'}," +
                       $"{{name: 'Inconclusive', y: {stats.TotalInconclusive}, color: '" + ReportColors.TestInconclusive +
                       "'}" + "]";

            JsCode =
                $@"
                    $(function () {{
                        $('#{id}').highcharts({{       		
           	                chart: {{
            		                type: 'pie'
        		                }},
                            title: {{
                                text: 'Test results'
                            }},
                            series: 
                            [{{
                                name: 'Results',
                                data: {data}
                            }}]
                        }});
                }});";
        }
    }
}
