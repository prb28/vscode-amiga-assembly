
**NAME**

FreeArgs - Free allocated memory after [ReadArgs](ReadArgs.md) (V36)

**SYNOPSIS**

```c
    FreeArgs(rdargs)
               D1

    void FreeArgs(struct RDArgs *)

```
Links: [RDArgs](_0076.md) 

**FUNCTION**

Frees memory allocated to return arguments in from [ReadArgs](ReadArgs.md).  If
[ReadArgs](ReadArgs.md) allocated the [RDArgs](_0076.md) structure it will be freed.

**INPUTS**

rdargs - structure returned from [ReadArgs](ReadArgs.md)

**SEE ALSO**

[ReadArgs](ReadArgs.md), [ReadItem](ReadItem.md), [FindArg](FindArg.md)
