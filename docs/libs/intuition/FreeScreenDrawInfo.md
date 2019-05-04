
**NAME**

FreeScreenDrawInfo -- Finish using a [DrawInfo](_00DD) structure. (V36)

**SYNOPSIS**

```c
    FreeScreenDrawInfo( Screen, DrInfo )
                        A0      A1

    VOID FreeScreenDrawInfo( struct Screen *, struct DrawInfo * );

```
Links: [Screen](_00DD) [Screen](_00DD) [DrawInfo](_00DD) 

**FUNCTION**

Declares that you are finished with the [DrawInfo](_00DD) structure
returned by [GetScreenDrawInfo](GetScreenDrawInfo).

**INPUTS**

[Screen](_00DD)           - pointer to screen passed to [GetScreenDrawInfo](GetScreenDrawInfo)
DrInfo      - pointer to [DrawInfo](_00DD) returned by [GetScreenDrawInfo](GetScreenDrawInfo)

RESULT
None

NOTES
This function, and [GetScreenDrawInfo](GetScreenDrawInfo), don't really do much, but
they provide an upward compatibility path.  That means that
if you misuse them today, they probably won't cause a problem,
although they may someday later.  So, please be very careful
only to use the [DrawInfo](_00DD) structure between calls to
[GetScreenDrawInfo](GetScreenDrawInfo) and FreeScreenDrawInfo(), and be sure
that you don't forget FreeScreenDrawInfo().

BUGS

**SEE ALSO**

[GetScreenDrawInfo](GetScreenDrawInfo)
