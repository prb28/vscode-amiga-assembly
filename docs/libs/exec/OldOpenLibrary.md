
**NAME**

OldOpenLibrary -- obsolete [OpenLibrary](OpenLibrary)

**SYNOPSIS**

```c
    library = OldOpenLibrary(libName)
    D0                       A1

    struct Library *OldOpenLibrary(APTR);

```
Links: [Library](_009C) 

**FUNCTION**

The 1.0 release of the Amiga system had an incorrect version of
[OpenLibrary](OpenLibrary) that did not check the version number during the
library open.  This obsolete function is provided so that object
code compiled using a 1.0 system will still run.

This exactly the same as &#034;OpenLibrary(libName,0L);&#034;

**INPUTS**

libName - the name of the library to open

**RESULTS**

library - a library pointer for a successful open, else zero

**SEE ALSO**

[CloseLibrary](CloseLibrary)
