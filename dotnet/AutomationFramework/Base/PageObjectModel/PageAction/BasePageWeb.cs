
using System;
/// <summary>
/// /=This class is base class for any page class
/// this contain method action in page
/// Ex: ClickOnSomeThing, DoSomePreCondition
/// </summary>
/// <typeparam name="WebElement"></typeparam>
/// <typeparam name="Validate"></typeparam>
namespace AutomationFrameWork.Base
{
    public class BasePageWeb<Singleton, WebElement, Validate> : PageInstance<Singleton>
        where WebElement : BaseWebElements, new()
        where Validate : BaseWebValidation<WebElement>, new()
        where Singleton : BasePageWeb<Singleton, WebElement, Validate>, new()
    {
        public BasePageWeb()
        {
        }
        protected WebElement Element
        {
            get
            {
                return new WebElement();
            }
        }
        public Validate Verify()
        {
            return new Validate();
        }
    }
}
