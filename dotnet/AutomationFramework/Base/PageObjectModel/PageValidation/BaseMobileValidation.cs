using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutomationFrameWork.Base;
namespace AutomationFrameWork.Base
/// <summary>
/// This class will crate Page Object-initinal element for any validation method 
/// extend from this class
/// </summary>
/// <typeparam name="MobileElement"></typeparam>
{
    public class BaseMobileValidation<MobileElement>
        where MobileElement : BaseMobileElements, new()
    {
        protected MobileElement Element
        {
            get
            {
                return new MobileElement();
            }
        }
    }
}
