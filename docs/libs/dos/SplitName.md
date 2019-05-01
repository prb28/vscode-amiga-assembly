
**NAME**

SplitName -- splits out a component of a pathname into a buffer (V36)

**SYNOPSIS**

```c
    newpos = SplitName(name, separator, buf, oldpos, size)
    D0                  D1      D2      D3     D4     D5

    WORD SplitName(STRPTR, UBYTE, STRPTR, WORD, LONG)

```
**FUNCTION**

This routine splits out the next piece of a name from a given file
name.  Each piece is copied into the buffer, truncating at size-1
characters.  The new position is then returned so that it may be
passed in to the next call to splitname.  If the separator is not
found within 'size' characters, then size-1 characters plus a null will
be put into the buffer, and the position of the next separator will
be returned.

If a a separator cannot be found, -1 is returned (but the characters
from the old position to the end of the string are copied into the
buffer, up to a maximum of size-1 characters).  Both strings are
null-terminated.

This function is mainly intended to support handlers.

**INPUTS**

name      - Filename being parsed.
separator - Separator charactor to split by.
buf       - Buffer to hold separated name.
oldpos    - Current position in the file.
size      - Size of buf in bytes (including null termination);

RESULT
newpos    - New position for next call to splitname.  -1 for last one.

**SEE ALSO**

[FilePart](FilePart), [PathPart](PathPart), [AddPart](AddPart)
