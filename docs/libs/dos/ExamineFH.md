
**NAME**

ExamineFH -- Gets information on an open file (V36)

**SYNOPSIS**

```c
    success = ExamineFH(fh, fib)
    D0                  D1  D2

    BOOL ExamineFH(BPTR, struct FileInfoBlock *)

```
Links: [FileInfoBlock](_0068.md) 

**FUNCTION**

Examines a filehandle and returns information about the file in the
[FileInfoBlock](_0068.md).  There are no guarantees as to whether the fib_Size
field will reflect any changes made to the file size it was opened,
though filesystems should attempt to provide up-to-date information
for it.

**INPUTS**

fh  - Filehandle you wish to examine
fib - [FileInfoBlock](_0068.md), must be longword aligned.

RESULT
success - Success/failure indication

**SEE ALSO**

[Examine](Examine.md), [ExNext](ExNext.md), [ExAll](ExAll.md), [Open](Open.md), [AllocDosObject](AllocDosObject.md)
