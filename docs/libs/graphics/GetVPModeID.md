
**NAME**

GetVPModeID -- get the 32 bit DisplayID from a [ViewPort](_OOBX). (V36)

**SYNOPSIS**

```c
    modeID =  GetVPModeID( vp )
    d0                     a0

    ULONG GetVPModeID( struct ViewPort *);

```
Links: [ViewPort](_OOBX) 

**FUNCTION**

returns the normal display modeID, if one is currently  associated
with this [ViewPort](_OOBX).

**INPUTS**

vp -- pointer to a [ViewPort](_OOBX) structure.

RESULT

modeID -- a 32 bit DisplayInfoRecord identifier associated with
this [ViewPort](_OOBX), or INVALID_ID.

NOTES
Test the return value of this function against INVALID_ID, not NULL.
(INVALID_ID is defined in [graphics/displayinfo.h](_OOBD).

BUGS

**SEE ALSO**

[graphics/displayinfo.h](_OOBD), [ModeNotAvailable](ModeNotAvailable)
