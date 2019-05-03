
**NAME**

CloseLibrary -- conclude access to a library

**SYNOPSIS**

```c
    CloseLibrary(library)
                 A1

    void CloseLibrary(struct Library *);

```
Links: [Library](_009C) 

**FUNCTION**

This function informs the system that access to the given library
has been concluded.  The user must not reference the library or any
function in the library after this close.

Starting with V36, it is safe to pass a NULL instead of
a library pointer.

**INPUTS**

library - pointer to a library node

NOTE
[Library](_009C) writers must pass a SegList pointer or NULL back from their
open point.  This value is used by the system, and not visible as
a return code from CloseLibrary.

**SEE ALSO**

[OpenLibrary](OpenLibrary)
