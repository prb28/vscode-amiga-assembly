
**NAME**

InternalUnLoadSeg -- Unloads a seglist loaded with [InternalLoadSeg](InternalLoadSeg.md)
(V36)

**SYNOPSIS**

```c
    success = InternalUnLoadSeg(seglist,FreeFunc)
      D0                          D1       A1

    BOOL InternalUnLoadSeg(BPTR,void (*)(STRPTR,ULONG))

```
**FUNCTION**

Unloads a seglist using freefunc to free segments.  Freefunc is called
as for [InternalLoadSeg](InternalLoadSeg.md).  NOTE: will call [Close](Close.md) for overlaid
seglists.

**INPUTS**

seglist  - Seglist to be unloaded
FreeFunc - Function called to free memory

RESULT
success - returns whether everything went OK (since this may close
files).  Also returns FALSE if seglist was NULL.

BUGS
Really should use tags

**SEE ALSO**

[LoadSeg](LoadSeg.md), [UnLoadSeg](UnLoadSeg.md), [InternalLoadSeg](InternalLoadSeg.md), NewUnLoadSeg(), [Close](Close.md)
