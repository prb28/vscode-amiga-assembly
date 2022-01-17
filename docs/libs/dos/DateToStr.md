
**NAME**

DateToStr -- Converts a [DateStamp](_0068.md) to a string (V36)

**SYNOPSIS**

```c
    success = DateToStr( datetime )
    D0                      D1

    BOOL DateToStr(struct DateTime *)

```
Links: [DateTime](_0060.md) 

**FUNCTION**

StamptoStr converts an AmigaDOS [DateStamp](_0068.md) to a human
readable ASCII string as requested by your settings in the
[DateTime](_0060.md) structure.

**INPUTS**

[DateTime](_0060.md) - a pointer to an initialized [DateTime](_0060.md) structure.

The [DateTime](_0060.md) structure should be initialized as follows:

dat_Stamp - a copy of the datestamp you wish to convert to
ascii.

dat_Format - a format   byte which specifies the format of the
dat_StrDate.  This can be any of the following
(note: If value used is something other than those
below, the default of FORMAT_DOS is used):

FORMAT_DOS:     AmigaDOS format (dd-mmm-yy).

FORMAT_INT:     International format (yy-mmm-dd).

FORMAT_USA:     American format (mm-dd-yy).

FORMAT_CDN:     Canadian format (dd-mm-yy).

FORMAT_DEF:     default format for locale.

dat_Flags - a   flags byte.  The only flag which affects this
function is:

DTF_SUBST:      If set, a string such as Today,
Monday, etc., will be used instead
of the dat_Format specification if
possible.
DTF_FUTURE:     Ignored by this function.

dat_StrDay - pointer to a buffer to receive the day of the
week string.  (Monday, Tuesday, etc.). If null, this
string will not be generated.

dat_StrDate -   pointer to a buffer to receive the date
string, in the format requested by dat_Format,
subject to possible modifications by DTF_SUBST.  If
null, this string will not be generated.

dat_StrTime -   pointer to a buffer to receive the time of day
string. If NULL, this will not be generated.

RESULT
success - a zero return indicates that the [DateStamp](_0068.md) was
invalid, and could not be converted.  Non-zero
indicates that the call succeeded.

**SEE ALSO**

[DateStamp](DateStamp.md), StrtoDate(), [&#060;dos/datetime.h&#062;](_0060.md)
