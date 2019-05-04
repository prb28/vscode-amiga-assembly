
**NAME**

[DateStamp](_0068) -- Obtain the date and time in internal format

**SYNOPSIS**

```c
    ds = DateStamp( ds );
    D0              D1

    struct DateStamp *DateStamp(struct DateStamp *)

```
Links: [DateStamp](_0068) [DateStamp](_0068) 

**FUNCTION**

DateStamp() takes a structure of three longwords that is set to the
current time.  The first element in the vector is a count of the
number of days.  The second element is the number of minutes elapsed
in the day.  The third is the number of ticks elapsed in the current
minute.  A tick happens 50 times a second.  DateStamp() ensures that
the day and minute are consistent.  All three elements are zero if
the date is unset. DateStamp() currently only returns even
multiples of 50 ticks.  Therefore the time you get is always an even
number of ticks.

Time is measured from Jan 1, 1978.

**INPUTS**

ds - pointer a struct [DateStamp](_0068)

**RESULTS**

The array is filled as described and returned (for pre-V36
compabability).

**SEE ALSO**

[DateToStr](DateToStr), [StrToDate](StrToDate), [SetFileDate](SetFileDate), [CompareDates](CompareDates)
