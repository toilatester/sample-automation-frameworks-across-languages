using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// <summary>
/// This class will crate Page Object-initinal element for any validation method 
/// extend from this class
/// </summary>
/// <typeparam name="WebElement"></typeparam>
namespace AutomationFrameWork.Base
{
    public class BaseWebValidation<WebElement> 
        where WebElement : BaseWebElements, new()
    {
        protected WebElement Element
        {
            get
            {
                return new WebElement();
            }
        }
    }
}
