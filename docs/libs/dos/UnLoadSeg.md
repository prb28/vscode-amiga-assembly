
**NAME**

UnLoadSeg -- Unload a seglist previously loaded by [LoadSeg](LoadSeg.md)

**SYNOPSIS**

```c
    success = UnLoadSeg( seglist )
    D0                     D1

    BOOL UnLoadSeg(BPTR)

```
**FUNCTION**

Unload a seglist loaded by [LoadSeg](LoadSeg.md).  'seglist' may be zero.
Overlaid segments will have all needed cleanup done, including
closing files.

**INPUTS**

seglist - BCPL pointer to a segment identifier

**RESULTS**

success - returns 0 if a NULL seglist was passed or if it failed
to close an overlay file.  NOTE: this function returned
a random value before V36!

**SEE ALSO**

[LoadSeg](LoadSeg.md), [InternalLoadSeg](InternalLoadSeg.md), [InternalUnLoadSeg](InternalUnLoadSeg.md)
