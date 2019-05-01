
**NAME**

RemLibrary -- remove a library from the system

**SYNOPSIS**

```c
    RemLibrary(library)
               A1

    void RemLibrary(struct Library *);

```
Links: [Library](_OOYC) 

**FUNCTION**

This function calls the library's EXPUNGE vector, which requests
that a library delete itself.  The library may refuse to do this if
it is busy or currently open. This is not typically called by user
code.

There are certain, limited circumstances where it may be
appropriate to attempt to specifically flush a certain [Library](_OOYC).
Example:

/* Attempts to flush the named library out of memory. */
#include [&#060;exec/types_h&#062;](_OOYV)
#include [&#060;exec/execbase_h&#062;](_OOYE)

void FlushLibrary(name)
STRPTR name;
{
struct [Library](_OOYC) *result;

Forbid();
if(result=(struct [Library](_OOYC) *)FindName(&#038;SysBase-&#062;LibList,name))
RemLibrary(result);
Permit();
}

**INPUTS**

library - pointer to a library node structure
