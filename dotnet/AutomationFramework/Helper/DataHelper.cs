using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomationFrameWork.Helper
{
    public class DataHelper
    {        
        public static IEnumerable DataDrivenExcel(string path, string sheet, bool hasHeader = true)
        {
            DataTable _table= Utils.ExcelUtilities.Instance.GetExcelData(path, sheet, hasHeader);
            int col = _table.Columns.Count;
            int row = _table.Rows.Count;
            for (int i = 0; i < row; i++)
            {
                object[] _data = new object[col];
                for (int j = 0; j < col; j++)
                    _data[j] = _table.Rows[i][j].ToString();
                yield return _data;
            }         
        }        
    }
}
