
**NAME**

Examine -- Examine a directory or file associated with a lock

**SYNOPSIS**

```c
    success = Examine( lock, FileInfoBlock )
    D0                  D1        D2

    BOOL Examine(BPTR,struct FileInfoBlock *)

```
Links: [FileInfoBlock](_0068.md) [FileInfoBlock](_0068.md) 

**FUNCTION**

Examine() fills in information in the [FileInfoBlock](_0068.md) concerning the
file or directory associated with the lock. This information
includes the name, size, creation date and whether it is a file or
directory.  [FileInfoBlock](_0068.md) must be longword aligned.  Examine() gives
a return code of zero if it fails.

You may make a local copy of the [FileInfoBlock](_0068.md), as long as it is
never passed to [ExNext](ExNext.md).

**INPUTS**

lock      - BCPL pointer to a lock
infoBlock - pointer to a [FileInfoBlock](_0068.md) (MUST be longword aligned)

**RESULTS**

success - boolean

SPECIAL NOTE
[FileInfoBlock](_0068.md) must be longword-aligned.  [AllocDosObject](AllocDosObject.md) will
allocate them correctly for you.

**SEE ALSO**

[Lock](Lock.md), [UnLock](UnLock.md), [ExNext](ExNext.md), [ExamineFH](ExamineFH.md), [&#060;dos/dos.h&#062;](_0068.md), [AllocDosObject](AllocDosObject.md),
[ExAll](ExAll.md)
