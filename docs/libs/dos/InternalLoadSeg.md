
**NAME**

InternalLoadSeg -- Low-level load routine (V36)

**SYNOPSIS**

```c
    seglist = InternalLoadSeg(fh,table,functionarray,stack)
    D0                        D0  A0        A1        A2

    BPTR InternalLoadSeg(BPTR,BPTR,LONG *,LONG *)

```
**FUNCTION**

Loads from fh.  Table is used when loading an overlay, otherwise
should be NULL.  Functionarray is a pointer to an array of functions.
Note that the current Seek position after loading may be at any point
after the last hunk loaded.  The filehandle will not be closed.  If a
stacksize is encoded in the file, the size will be stuffed in the
LONG pointed to by stack.  This LONG should be initialized to your
default value: InternalLoadSeg() will not change it if no stacksize
is found. Clears unused portions of Code and Data hunks (as well as
BSS hunks).  (This also applies to [LoadSeg](LoadSeg.md) and [NewLoadSeg](NewLoadSeg.md)).

If the file being loaded is an overlaid file, this will return
-(seglist).  All other results will be positive.

NOTE to overlay users: InternalLoadSeg() does NOT return seglist in
both D0 and D1, as [LoadSeg](LoadSeg.md) does.  The current ovs.asm uses [LoadSeg](LoadSeg.md),
and assumes returns are in D1.  We will support this for [LoadSeg](LoadSeg.md)
ONLY.

**INPUTS**

fh            - Filehandle to load from.
table         - When loading an overlay, otherwise ignored.
functionarray - Array of function to be used for read, alloc, and free.
FuncTable[0] -&#062;  Actual = ReadFunc(readhandle,buffer,length),DOSBase
D0                D1         A0     D0      A6
FuncTable[1] -&#062;  Memory = AllocFunc(size,flags), Execbase
D0                 D0   D1      a6
FuncTable[2] -&#062;  FreeFunc(memory,size), Execbase
A1     D0     a6
stack         - Pointer to storage (ULONG) for stacksize.

RESULT
seglist       - Seglist loaded or NULL.  NOT returned in D1!

BUGS
Really should use tags.

**SEE ALSO**

[LoadSeg](LoadSeg.md), [UnLoadSeg](UnLoadSeg.md), [NewLoadSeg](NewLoadSeg.md), [InternalUnLoadSeg](InternalUnLoadSeg.md)
