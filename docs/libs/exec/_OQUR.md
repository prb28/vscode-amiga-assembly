
**NAME**

DeleteExtIO - return memory allocated for extended IO request

**SYNOPSIS**

```c
    DeleteExtIO(ioReq);

    VOID DeleteExtIO(struct IORequest *);

```
Links: [IORequest](_OOYT) 

**FUNCTION**

Frees up an IO request as allocated by [CreateExtIO](_OQTW).

**INPUTS**

ioReq - the [IORequest](_OOYT) block to be freed, or NULL.

**SEE ALSO**

[CreateExtIO](_OQTW)
