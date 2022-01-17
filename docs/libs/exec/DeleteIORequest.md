
**NAME**

DeleteIORequest() - Free a request made by [CreateIORequest](CreateIORequest.md)  (V36)

**SYNOPSIS**

```c
    DeleteIORequest( ioReq );
                     a0

    void DeleteIORequest(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

Frees up an IO request as allocated by [CreateIORequest](CreateIORequest.md).

**INPUTS**

ioReq - A pointer to the [IORequest](_0094.md) block to be freed, or NULL.
This function uses the mn_Length field to determine how
much memory to free.

**SEE ALSO**

[CreateIORequest](CreateIORequest.md), [amiga.lib/DeleteExtIO](_0152.md)
