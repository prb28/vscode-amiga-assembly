
**NAME**

SetFileDate -- Sets the modification date for a file or dir (V36)

**SYNOPSIS**

```c
    success = SetFileDate(name, date)
    D0                     D1    D2

    BOOL SetFileDate(STRPTR, struct DateStamp *)

```
Links: [DateStamp](_0068.md) 

**FUNCTION**

Sets the file date for a file or directory.  Note that for the Old
File System and the Fast File System, the date of the root directory
cannot be set.  Other filesystems may not support setting the date
for all files/directories.

**INPUTS**

name - Name of object
date - New modification date

RESULT
success - Success/failure indication

**SEE ALSO**

[DateStamp](DateStamp.md), [Examine](Examine.md), [ExNext](ExNext.md), [ExAll](ExAll.md)
