/// <summary>
/// /=This class is base class for any page class
/// this contain method action in page
/// Ex: ClickOnSomeThing, DoSomePreCondition
/// </summary>
/// <typeparam name="MobileElement"></typeparam>
/// <typeparam name="Validate"></typeparam>
namespace AutomationFrameWork.Base
{
    public class BasePageMobile<Singleton, MobileElement, Validate> : PageInstance<Singleton>
        where MobileElement : BaseMobileElements, new()
        where Validate : BaseMobileValidation<MobileElement>, new()
        where Singleton : BasePageMobile<Singleton, MobileElement, Validate>, new()
    {
        public BasePageMobile()
        {
        }
        protected MobileElement Element
        {
            get
            {
                return new MobileElement();
            }
        }
        public Validate Verify()
        {
            return new Validate();
        }
    }
}
