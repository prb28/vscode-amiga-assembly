
**NAME**

FreeArgs - Free allocated memory after [ReadArgs](ReadArgs) (V36)

**SYNOPSIS**

```c
    FreeArgs(rdargs)
               D1

    void FreeArgs(struct RDArgs *)

```
Links: [RDArgs](_0076) 

**FUNCTION**

Frees memory allocated to return arguments in from [ReadArgs](ReadArgs).  If
[ReadArgs](ReadArgs) allocated the [RDArgs](_0076) structure it will be freed.

**INPUTS**

rdargs - structure returned from [ReadArgs](ReadArgs)

**SEE ALSO**

[ReadArgs](ReadArgs), [ReadItem](ReadItem), [FindArg](FindArg)
