
**NAME**

FilePart -- Returns the last component of a path (V36)

**SYNOPSIS**

```c
    fileptr = FilePart( path )
    D0                   D1

    STRPTR FilePart( STRPTR )

```
**FUNCTION**

This function returns a pointer to the last component of a string path
specification, which will normally be the file name.  If there is only
one component, it returns a pointer to the beginning of the string.

**INPUTS**

path - pointer to an path string.  May be relative to the current
directory or the current disk.

RESULT
fileptr - pointer to the last component of the path.

EXAMPLE
FilePart(&#034;xxx:yyy/zzz/qqq&#034;) would return a pointer to the first 'q'.
FilePart(&#034;xxx:yyy&#034;) would return a pointer to the first 'y').

**SEE ALSO**

[PathPart](PathPart.md), [AddPart](AddPart.md)
