
**NAME**

Examine -- Examine a directory or file associated with a lock

**SYNOPSIS**

```c
    success = Examine( lock, FileInfoBlock )
    D0                  D1        D2

    BOOL Examine(BPTR,struct FileInfoBlock *)

```
Links: [FileInfoBlock](_OOVX) [FileInfoBlock](_OOVX) 

**FUNCTION**

Examine() fills in information in the [FileInfoBlock](_OOVX) concerning the
file or directory associated with the lock. This information
includes the name, size, creation date and whether it is a file or
directory.  [FileInfoBlock](_OOVX) must be longword aligned.  Examine() gives
a return code of zero if it fails.

You may make a local copy of the [FileInfoBlock](_OOVX), as long as it is
never passed to [ExNext](ExNext).

**INPUTS**

lock      - BCPL pointer to a lock
infoBlock - pointer to a [FileInfoBlock](_OOVX) (MUST be longword aligned)

**RESULTS**

success - boolean

SPECIAL NOTE
[FileInfoBlock](_OOVX) must be longword-aligned.  [AllocDosObject](AllocDosObject) will
allocate them correctly for you.

**SEE ALSO**

[Lock](Lock), [UnLock](UnLock), [ExNext](ExNext), [ExamineFH](ExamineFH), [&#060;dos/dos.h&#062;](_OOVX), [AllocDosObject](AllocDosObject),
[ExAll](ExAll)
