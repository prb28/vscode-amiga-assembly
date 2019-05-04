
**NAME**

CompareDates -- Compares two datestamps (V36)

**SYNOPSIS**

```c
    result = CompareDates(date1,date2)
    D0                     D1     D2

    LONG CompareDates(struct DateStamp *,struct DateStamp *)

```
Links: [DateStamp](_0068) [DateStamp](_0068) 

**FUNCTION**

Compares two times for relative magnitide.  &#060;0 is returned if date1 is
later than date2, 0 if they are equal, or &#062;0 if date2 is later than
date1.  NOTE: this is NOT the same ordering as strcmp!

**INPUTS**

date1, date2 - DateStamps to compare

RESULT
result -  &#060;0, 0, or &#062;0 based on comparison of two date stamps

**SEE ALSO**

[DateStamp](DateStamp), [DateToStr](DateToStr), [StrToDate](StrToDate)
