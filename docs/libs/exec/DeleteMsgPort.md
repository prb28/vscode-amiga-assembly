
**NAME**

DeleteMsgPort - Free a message port created by [CreateMsgPort](CreateMsgPort.md)  (V36)

**SYNOPSIS**

```c
    DeleteMsgPort(msgPort)
                  a0

    void DeleteMsgPort(struct MsgPort *);

```
Links: [MsgPort](_0099.md) 

**FUNCTION**

Frees a message port created by [CreateMsgPort](CreateMsgPort.md).  All messages that
may have been attached to this port must have already been
replied to.

**INPUTS**

msgPort - A message port.  NULL for no action.

**SEE ALSO**

[CreateMsgPort](CreateMsgPort.md), [amiga.lib/DeletePort](_0153.md)
