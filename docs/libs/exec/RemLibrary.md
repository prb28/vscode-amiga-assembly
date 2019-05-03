
**NAME**

RemLibrary -- remove a library from the system

**SYNOPSIS**

```c
    RemLibrary(library)
               A1

    void RemLibrary(struct Library *);

```
Links: [Library](_009C) 

**FUNCTION**

This function calls the library's EXPUNGE vector, which requests
that a library delete itself.  The library may refuse to do this if
it is busy or currently open. This is not typically called by user
code.

There are certain, limited circumstances where it may be
appropriate to attempt to specifically flush a certain [Library](_009C).
Example:

/* Attempts to flush the named library out of memory. */
#include [&#060;exec/types.h&#062;](_0096)
#include [&#060;exec/execbase.h&#062;](_009E)

void FlushLibrary(name)
STRPTR name;
{
struct [Library](_009C) *result;

Forbid();
if(result=(struct [Library](_009C) *)FindName(&#038;SysBase-&#062;LibList,name))
RemLibrary(result);
Permit();
}

**INPUTS**

library - pointer to a library node structure
