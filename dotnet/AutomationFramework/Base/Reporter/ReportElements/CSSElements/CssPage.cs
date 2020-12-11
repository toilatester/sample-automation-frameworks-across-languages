﻿using System.Collections.Generic;
using System.IO;

namespace AutomationFrameWork.Reporter.ReportElements.CSSElements
{
    public class CssPage
    {
        private string _style;

        public void AddStyle (string style)
        {
            _style += style;
        }

        public void AddStyles (List<string> styles)
        {
            foreach (var style in styles)
            {
                _style += style;
            }
        }

        public void SavePage (string fullPath)
        {
            File.WriteAllText(fullPath, _style);
        }

    }
}
