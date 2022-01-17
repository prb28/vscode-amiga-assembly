
**NAME**

OpenLibrary -- gain access to a library

**SYNOPSIS**

```c
    library = OpenLibrary(libName, version)
    D0                    A1       D0

    struct Library *OpenLibrary(STRPTR, ULONG);

```
Links: [Library](_009C.md) 

**FUNCTION**

This function returns a pointer to a library that was previously
installed into the system.  If the requested library is exists, and
if the library version is greater than or equal to the requested
version, then the open will succeed.

The device may exist in memory, or on disk; this is transparent to
the [OpenDevice](OpenDevice.md) caller.  Only Processes are allowed to call
OpenLibrary (since OpenLibrary may in turn call dos.library).

A full path name for the library name is legitimate.  For example
&#034;wp:libs/wp.library&#034;.  This allows the use of custom libraries
without requiring the user to copy the library into the system's
LIBS: directory.

NOTES
All calls to OpenLibrary should have matching calls to CloseLibrary!

Libraries on disk cannot be opened until after DOS has been
started.

As of V36 tasks can safely call OpenLibrary, though DOS may open
system requesters (e.g., asking the user to insert the Workbench
disk if LIBS: is not online).  You must call this function from a
DOS [Process](_0078.md) if you want to turn off DOS requesters.

**INPUTS**

libName - the name of the library to open

version - the version of the library required.

**RESULTS**

library - a library pointer for a successful open, else zero

BUGS
AmigaDOS file names are not case sensitive, but Exec lists are. If
the library name is specified in a different case than it exists on
disk, unexpected results may occur.

Prior to V36, tasks could not make OpenLibrary calls requiring disk
access (since tasks are not allowed to make dos.library calls).
Now OpenLibrary is protected from tasks.

The version number of the resident tag in disk based library must
match the version number of the library, or V36 may fail to load it.

**SEE ALSO**

[CloseLibrary](CloseLibrary.md)
