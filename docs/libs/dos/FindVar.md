
**NAME**

FindVar -- Finds a local variable (V36)

**SYNOPSIS**

```c
    var = FindVar( name, type )
    D0              D1    D2

    struct LocalVar * FindVar(STRPTR, ULONG )

```
Links: [LocalVar](_0073.md) 

**FUNCTION**

Finds a local variable structure.

**INPUTS**

name - pointer to an variable name.  Note variable names follow
filesystem syntax and semantics.

type - type of variable to be found (see [&#060;dos/var.h&#062;](_0073.md))

RESULT

var  - pointer to a [LocalVar](_0073.md) structure or NULL

**SEE ALSO**

[GetVar](GetVar.md), [SetVar](SetVar.md), [DeleteVar](DeleteVar.md), [&#060;dos/var.h&#062;](_0073.md)
