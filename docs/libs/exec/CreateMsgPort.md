
**NAME**

CreateMsgPort - Allocate and initialize a new message port  (V36)

**SYNOPSIS**

```c
    CreateMsgPort()

    struct MsgPort * CreateMsgPort(void);

```
Links: [MsgPort](_0099.md) 

**FUNCTION**

Allocates and initializes a new message port.  The message list
of the new port will be prepared for use (via NewList).  A signal
bit will be allocated, and the port will be set to signal your
task when a message arrives (PA_SIGNAL).

You *must* use [DeleteMsgPort](DeleteMsgPort.md) to delete ports created with
CreateMsgPort()!

RESULT
[MsgPort](_0099.md) - A new [MsgPort](_0099.md) structure ready for use, or NULL if out of
memory or signals.  If you wish to add this port to the public
port list, fill in the ln_Name and ln_Pri fields, then call
[AddPort](AddPort.md).  Don't forget RemPort()!

**SEE ALSO**

[DeleteMsgPort](DeleteMsgPort.md), [exec/AddPort](AddPort.md), [exec/ports.h](_0099.md), [amiga.lib/CreatePort](_0148.md)
