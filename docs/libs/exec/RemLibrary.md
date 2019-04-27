
**NAME**

RemLibrary -- remove a library from the system

**SYNOPSIS**

```
    RemLibrary(library)
               A1

```
void RemLibrary(struct [Library](Library) *);

**FUNCTION**

This function calls the library's EXPUNGE vector, which requests
that a library delete itself.  The library may refuse to do this if
it is busy or currently open. This is not typically called by user
code.

There are certain, limited circumstances where it may be
appropriate to attempt to specifically flush a certain [Library](Library).
Example:

/* Attempts to flush the named library out of memory. */
#include [&#060;exec/types.h&#062;](&#060;exec/types.h&#062;)
#include [&#060;exec/execbase.h&#062;](&#060;exec/execbase.h&#062;)

void FlushLibrary(name)
STRPTR name;
{
struct [Library](Library) *result;

Forbid();
if(result=(struct [Library](Library) *)FindName(&#038;SysBase-&#062;LibList,name))
RemLibrary(result);
Permit();
}

**INPUTS**

library - pointer to a library node structure
