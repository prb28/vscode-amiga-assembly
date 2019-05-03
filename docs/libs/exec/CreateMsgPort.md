
**NAME**

CreateMsgPort - Allocate and initialize a new message port  (V36)

**SYNOPSIS**

```c
    CreateMsgPort()

    struct MsgPort * CreateMsgPort(void);

```
Links: [MsgPort](_0099) 

**FUNCTION**

Allocates and initializes a new message port.  The message list
of the new port will be prepared for use (via NewList).  A signal
bit will be allocated, and the port will be set to signal your
task when a message arrives (PA_SIGNAL).

You *must* use [DeleteMsgPort](DeleteMsgPort) to delete ports created with
CreateMsgPort()!

RESULT
[MsgPort](_0099) - A new [MsgPort](_0099) structure ready for use, or NULL if out of
memory or signals.  If you wish to add this port to the public
port list, fill in the ln_Name and ln_Pri fields, then call
[AddPort](AddPort).  Don't forget RemPort()!

**SEE ALSO**

[DeleteMsgPort](DeleteMsgPort), [exec/AddPort](AddPort), [exec/ports.h](_0099), [amiga.lib/CreatePort](_0148)
