namespace SMPS.Domain.Enums
{
    public enum PaymentStatus
    {
        Pending = 1,    // STK Push sent, waiting for callback
        Completed = 2,  // ResultCode == 0 (Success)
        Failed = 3,     // ResultCode != 0 (Failed due to timeout, invalid PIN, etc.)
        Cancelled = 4   // ResultCode == 1032 (User explicitly cancelled the prompt)
    }
}