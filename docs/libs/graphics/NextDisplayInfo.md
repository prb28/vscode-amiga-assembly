
**NAME**

NextDisplayInfo -- iterate current displayinfo identifiers (V36)

**SYNOPSIS**

```c
    next_ID = NextDisplayInfo(last_ID)
    D0                        D0

    ULONG NextDisplayInfo(ULONG);

```
**FUNCTION**

The basic iteration function with which to find all records in the
graphics database.  Using each ID in succession, you can then call
[FindDisplayInfo](FindDisplayInfo) to obtain the handle associated with each ID.
Each ID is a 32-bit Key which uniquely identifies one record.
The INVALID_ID is special, and indicates the end-of-list.

**INPUTS**

last_ID - previous displayinfo identifier
or INVALID_ID if beginning iteration.

RESULT
next_ID - subsequent displayinfo identifier
or INVALID_ID if no more records.

BUGS

**SEE ALSO**

[FindDisplayInfo](FindDisplayInfo), [GetDisplayInfoData](GetDisplayInfoData)
[graphics/displayinfo.h](_00BD)
