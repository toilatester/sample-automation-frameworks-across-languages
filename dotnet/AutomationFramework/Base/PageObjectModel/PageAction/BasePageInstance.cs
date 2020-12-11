using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomationFrameWork.Base
{
    public abstract class PageInstance<PageObject> 
    where PageObject : new()
    {
        private static readonly Lazy<PageObject> _instance = new Lazy<PageObject>(() => new PageObject());

        public static PageObject Instance
        {
            get
            {
                return _instance.Value;
            }
        }
    }
}
