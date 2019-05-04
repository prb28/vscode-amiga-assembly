
**NAME**

GetScreenDrawInfo -- Get pointer to rendering information. (V36)

**SYNOPSIS**

```c
    DrInfo = GetScreenDrawInfo( Screen )
    D0                          A0

    struct DrawInfo *GetScreenDrawInfo( struct Screen * );

```
Links: [Screen](_00DD) [DrawInfo](_00DD) [Screen](_00DD) 

**FUNCTION**

Returns a pointer to a [DrawInfo](_00DD) structure derived from the
screen passed.  This data structure is READ ONLY.  The field
dri_Version identifies which version of struct [DrawInfo](_00DD) you
are given a pointer to.

**INPUTS**

[Screen](_00DD)        - pointer to a valid, open screen.

RESULT
DrInfo - pointer to a system-allocated [DrawInfo](_00DD) structure,
as defined in [intuition/screens.h](_00DD).

NOTES
Some information in the [DrawInfo](_00DD) structure may in the future
be calculated the first time this function is called for a
particular screen.

You must call [FreeScreenDrawInfo](FreeScreenDrawInfo) when you are done using the
returned pointer.

This function does not prevent a screen from closing.  Apply it
only to the screens you opened yourself, or apply a protocol
such as [LockPubScreen](LockPubScreen).

WARNING: Until further notice, the pointer returned does not
remain valid after the screen is closed.

This function and [FreeScreenDrawInfo](FreeScreenDrawInfo) don't really do much now,
but they provide an upward compatibility path.  That means that
if you misuse them today, they probably won't cause a problem,
although they may someday later.  So, please be very careful
only to use the [DrawInfo](_00DD) structure between calls to
GetScreenDrawInfo() and [FreeScreenDrawInfo](FreeScreenDrawInfo), and be sure
that you don't forget [FreeScreenDrawInfo](FreeScreenDrawInfo).

BUGS
Does not reflect to changes in screen modes, depth, or pens.

**SEE ALSO**

[FreeScreenDrawInfo](FreeScreenDrawInfo), [LockPubScreen](LockPubScreen), [intuition/screens.h](_00DD)
