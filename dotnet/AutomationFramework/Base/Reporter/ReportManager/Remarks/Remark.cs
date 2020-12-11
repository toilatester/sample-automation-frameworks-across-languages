using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomationFrameWork.Reporter.Remarks
{
    public class Remark
    {
        public Remark (DateTime remarkDate, string remarkMessage)
        {
            RemarkDate = remarkDate;
            RemarkMessage = remarkMessage;
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