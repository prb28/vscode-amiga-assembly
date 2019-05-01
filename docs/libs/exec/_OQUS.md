
**NAME**

DeletePort - free a message port created by [CreatePort](_OQTX)

**SYNOPSIS**

```c
    DeletePort(port)

    VOID DeletePort(struct MsgPort *);

```
Links: [MsgPort](_OOYY) 

**FUNCTION**

Frees a message port created by [CreatePort](_OQTX). All messages that
may have been attached to this port must have already been
replied before this function is called.

**INPUTS**

port - message port to delete

**SEE ALSO**

[CreatePort](_OQTX)
