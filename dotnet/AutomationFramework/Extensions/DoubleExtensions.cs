using System.Globalization;

namespace AutomationFrameWork.Extensions
{
    public static class DoubleExtensions
    {
        public static string ToJsString (this double number)
        {
            return $@"{number.ToString(CultureInfo.InvariantCulture).Replace(",", ".")}";
        }
    }
}
