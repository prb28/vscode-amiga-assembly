
**NAME**

Rename -- Rename a directory or file

**SYNOPSIS**

```c
    success = Rename( oldName, newName )
    D0                D1       D2

    BOOL Rename(STRPTR, STRPTR)

```
**FUNCTION**

Rename() attempts to rename the file or directory specified as
'oldName' with the name 'newName'. If the file or directory
'newName' exists, Rename() fails and returns an error. Both
'oldName' and the 'newName' can contain a directory specification.
In this case, the file will be moved from one directory to another.

Note: it is impossible to Rename() a file from one volume to
another.

**INPUTS**

oldName - pointer to a null-terminated string
newName - pointer to a null-terminated string

**RESULTS**

success - boolean

**SEE ALSO**

[Relabel](Relabel.md)
