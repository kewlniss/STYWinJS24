using System;

namespace WinRTHighPrecisionNumberComponent
{
    public sealed class HighPrecisionNumber
    {
        public HighPrecisionNumber()
        {
            LargeNumber = 9007199254740992 + 7;
        }

        public Int64 LargeNumber { get; set; }

        public string MyString { get { return LargeNumber.ToString(); } }

        public bool Compare(Int64 a, Int64 b) { return a == b; }
    }
}
