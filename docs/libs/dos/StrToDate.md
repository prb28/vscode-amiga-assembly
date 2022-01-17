
**NAME**

StrToDate -- Converts a string to a [DateStamp](_0068.md) (V36)

**SYNOPSIS**

```c
    success = StrToDate( datetime )
    D0                      D1

    BOOL StrToDate( struct DateTime * )

```
Links: [DateTime](_0060.md) 

**FUNCTION**

Converts a human readable ASCII string into an AmigaDOS
[DateStamp](_0068.md).

**INPUTS**

[DateTime](_0060.md) - a pointer to an initialized [DateTime](_0060.md) structure.

The [DateTime](_0060.md) structure should   be initialized as follows:

dat_Stamp  - ignored on input.

dat_Format - a format   byte which specifies the format of the
dat_StrDat.  This can   be any of the following (note:
If value used   is something other than those below,
the default of FORMAT_DOS is used):

FORMAT_DOS:       AmigaDOS format (dd-mmm-yy).

FORMAT_INT:       International format (yy-mmm-dd).

FORMAT_USA:       American format (mm-dd-yy).

FORMAT_CDN:       Canadian format (dd-mm-yy).

FORMAT_DEF:       default format for locale.

dat_Flags - a flags byte.  The only flag which affects this
function is:

DTF_SUBST:      ignored by this function
DTF_FUTURE:       If set, indicates that strings such
as (stored in dat_StrDate) &#034;Monday&#034;
refer to &#034;next&#034; monday. Otherwise,
if clear, strings like &#034;Monday&#034;
refer to &#034;last&#034; monday.

dat_StrDay - ignored bythis function.

dat_StrDate -   pointer to valid string representing the date.
This can be a &#034;DTF_SUBST&#034; style string such as
&#034;Today&#034; &#034;Tomorrow&#034; &#034;Monday&#034;, or it may be a string
as specified by the dat_Format byte.  This will be
converted to the ds_Days portion of the [DateStamp](_0068.md).
If this pointer is NULL, DateStamp-&#062;ds_Days will not
be affected.

dat_StrTime -   Pointer to a buffer which contains the time in
the ASCII format hh:mm:ss.  This will be converted
to the ds_Minutes and ds_Ticks portions of the
[DateStamp](_0068.md).  If this pointer is NULL, ds_Minutes and
ds_Ticks will be unchanged.

RESULT
success - a zero return indicates that a conversion could
not be performed. A non-zero return indicates that the
DateTime.dat_Stamp variable contains the converted
values.

**SEE ALSO**

[DateStamp](DateStamp.md), [DateToStr](DateToStr.md), [&#060;dos/datetime.h&#062;](_0060.md)
