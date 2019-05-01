
**NAME**

InternalUnLoadSeg -- Unloads a seglist loaded with [InternalLoadSeg](InternalLoadSeg)
(V36)

**SYNOPSIS**

```c
    success = InternalUnLoadSeg(seglist,FreeFunc)
      D0                          D1       A1

    BOOL InternalUnLoadSeg(BPTR,void (*)(STRPTR,ULONG))

```
**FUNCTION**

Unloads a seglist using freefunc to free segments.  Freefunc is called
as for [InternalLoadSeg](InternalLoadSeg).  NOTE: will call [Close](Close) for overlaid
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

[LoadSeg](LoadSeg), [UnLoadSeg](UnLoadSeg), [InternalLoadSeg](InternalLoadSeg), NewUnLoadSeg(), [Close](Close)
