
**NAME**

DeleteMsgPort - Free a message port created by [CreateMsgPort](CreateMsgPort)  (V36)

**SYNOPSIS**

```
    DeleteMsgPort(msgPort)
                  a0

```
void DeleteMsgPort(struct [MsgPort](MsgPort) *);

**FUNCTION**

Frees a message port created by [CreateMsgPort](CreateMsgPort).  All messages that
may have been attached to this port must have already been
replied to.

**INPUTS**

msgPort - A message port.  NULL for no action.

**SEE ALSO**

[CreateMsgPort](CreateMsgPort), [amiga.lib/DeletePort](amiga.lib/DeletePort)
