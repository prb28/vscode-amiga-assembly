
**NAME**

IsFileSystem -- returns whether a Dos handler is a filesystem (V36)

**SYNOPSIS**

```c
    result = IsFileSystem(name)
    D0                     D1

    BOOL IsFileSystem(STRPTR)

```
**FUNCTION**

Returns whether the device is a filesystem or not.  A filesystem
supports seperate files storing information.  It may also support
sub-directories, but is not required to.  If the filesystem doesn't
support this new packet, IsFileSystem() will use Lock(&#034;:&#034;,...) as
an indicator.

**INPUTS**

name   - Name of device in question, with trailing ':'.

RESULT
result - Flag to indicate if device is a file system

**SEE ALSO**

[Lock](Lock.md)
