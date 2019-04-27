
**NAME**

DeleteIORequest() - Free a request made by [CreateIORequest](CreateIORequest)  (V36)

**SYNOPSIS**

```
    DeleteIORequest( ioReq );
                     a0

```
void DeleteIORequest(struct [IORequest](IORequest) *);

**FUNCTION**

Frees up an IO request as allocated by [CreateIORequest](CreateIORequest).

**INPUTS**

ioReq - A pointer to the [IORequest](IORequest) block to be freed, or NULL.
This function uses the mn_Length field to determine how
much memory to free.

**SEE ALSO**

[CreateIORequest](CreateIORequest), [amiga.lib/DeleteExtIO](amiga.lib/DeleteExtIO)
