using AutomationFrameWork.Utils;
using System.IO;
using Newtonsoft.Json;

namespace AutomationFrameWork.Helper
{
    public class CSSHelper
    {
        public string size { get; set; }
        public string family { get; set; }
        public string weight { get; set; }
        public string height { get; set; }
        public string top { get; set; }
        public string bottom { get; set; }
        public string color { get; set; }

        public void GetCssAttribute(CSSHelper css)
        {            
            var item = JsonConvert.DeserializeObject<CSSHelper>(File.ReadAllText(Utilities.Instance.GetRelativePath("Resources//CSS.txt")));
            css.size = item.size;
            css.family = item.family;
            css.weight = item.weight;
            css.height = item.height;
            css.top = item.top;
            css.bottom = item.bottom;
            css.color = item.color;
        }
    }

   
}
