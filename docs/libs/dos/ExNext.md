
**NAME**

ExNext -- Examine the next entry in a directory

**SYNOPSIS**

```c
    success = ExNext( lock, FileInfoBlock )
    D0                 D1        D2

    BOOL ExNext(BPTR, struct FileInfoBlock *)

```
Links: [FileInfoBlock](_0068) [FileInfoBlock](_0068) 

**FUNCTION**

This routine is passed a directory lock and a [FileInfoBlock](_0068) that
have been initialized by a previous call to [Examine](Examine), or updated
by a previous call to ExNext().  ExNext() gives a return code of zero
on failure.  The most common cause of failure is reaching the end
of the list of files in the owning directory.  In this case, [IoErr](IoErr)
will return ERROR_NO_MORE_ENTRIES and a good exit is appropriate.

So, follow these steps to examine a directory:
1) Pass a Lock and a [FileInfoBlock](_0068) to [Examine](Examine).  The lock must
be on the directory you wish to examine.
2) Pass ExNext() the same lock and [FileInfoBlock](_0068).
3) Do something with the information returned in the [FileInfoBlock](_0068).
Note that the fib_DirEntryType field is positive for directories,
negative for files.
4) Keep calling ExNext() until it returns FALSE.  Check [IoErr](IoErr)
to ensure that the reason for failure was ERROR_NO_MORE_ENTRIES.

Note: if you wish to recursively scan the file tree and you find
another directory while ExNext()ing you must Lock that directory and
[Examine](Examine) it using a new [FileInfoBlock](_0068).  Use of the same
[FileInfoBlock](_0068) to enter a directory would lose important state
information such that it will be impossible to continue scanning
the parent directory.  While it is permissible to [UnLock](UnLock) and [Lock](Lock)
the parent directory between ExNext() calls, this is NOT recommended.
Important state information is associated with the parent lock, so
if it is freed between ExNext() calls this information has to be
rebuilt on each new ExNext() call, and will significantly slow down
directory scanning.

It is NOT legal to [Examine](Examine) a file, and then to ExNext() from that
[FileInfoBlock](_0068).       You may make a local copy of the [FileInfoBlock](_0068), as
long as it is never passed back to the operating system.

**INPUTS**

lock - BCPL pointer to a lock originally used for the [Examine](Examine) call
infoBlock - pointer to a [FileInfoBlock](_0068) used on the previous [Examine](Examine)
or ExNext() call.

**RESULTS**

success - boolean

SPECIAL NOTE
[FileInfoBlock](_0068) must be longword-aligned.  [AllocDosObject](AllocDosObject) will
allocate them correctly for you.

**SEE ALSO**

[Examine](Examine), [Lock](Lock), [UnLock](UnLock), [IoErr](IoErr), [ExamineFH](ExamineFH), [AllocDosObject](AllocDosObject),
[ExAll](ExAll)
