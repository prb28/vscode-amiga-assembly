
**NAME**

FreeScreenDrawInfo -- Finish using a [DrawInfo](_00DD.md) structure. (V36)

**SYNOPSIS**

```c
    FreeScreenDrawInfo( Screen, DrInfo )
                        A0      A1

    VOID FreeScreenDrawInfo( struct Screen *, struct DrawInfo * );

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) [DrawInfo](_00DD.md) 

**FUNCTION**

Declares that you are finished with the [DrawInfo](_00DD.md) structure
returned by [GetScreenDrawInfo](GetScreenDrawInfo.md).

**INPUTS**

[Screen](_00DD.md)           - pointer to screen passed to [GetScreenDrawInfo](GetScreenDrawInfo.md)
DrInfo      - pointer to [DrawInfo](_00DD.md) returned by [GetScreenDrawInfo](GetScreenDrawInfo.md)

RESULT
None

NOTES
This function, and [GetScreenDrawInfo](GetScreenDrawInfo.md), don't really do much, but
they provide an upward compatibility path.  That means that
if you misuse them today, they probably won't cause a problem,
although they may someday later.  So, please be very careful
only to use the [DrawInfo](_00DD.md) structure between calls to
[GetScreenDrawInfo](GetScreenDrawInfo.md) and FreeScreenDrawInfo(), and be sure
that you don't forget FreeScreenDrawInfo().

BUGS

**SEE ALSO**

[GetScreenDrawInfo](GetScreenDrawInfo.md)
