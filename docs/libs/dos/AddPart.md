
**NAME**

AddPart -- Appends a file/dir to the end of a path (V36)

**SYNOPSIS**

```c
    success = AddPart( dirname, filename, size )
    D0                   D1        D2      D3

    BOOL AddPart( STRPTR, STRPTR, ULONG )

```
**FUNCTION**

This function adds a file, directory, or subpath name to a directory
path name taking into account any required separator characters.  If
filename is a fully-qualified path it will totally replace the current
value of dirname.

**INPUTS**

dirname  - the path to add a file/directory name to.
filename - the filename or directory name to add.  May be a relative
pathname from the current directory (example: foo/bar).
Can deal with leading '/'(s), indicating one directory up
per '/', or with a ':', indicating it's relative to the
root of the appropriate volume.
size     - size in bytes of the space allocated for dirname.  Must
not be 0.

RESULT
success - non-zero for ok, FALSE if the buffer would have overflowed.
If an overflow would have occured, dirname will not be
changed.

BUGS
Doesn't check if a subpath is legal (i.e. doesn't check for ':'s) and
doesn't handle leading '/'s in 2.0 through 2.02 (V36).  V37 fixes
this, allowing filename to be any path, including absolute.

**SEE ALSO**

Filepart(), [PathPart](PathPart.md)
