
**NAME**

CreateMsgPort - Allocate and initialize a new message port  (V36)

**SYNOPSIS**

```
    CreateMsgPort()

```
struct [MsgPort](MsgPort) * CreateMsgPort(void);

**FUNCTION**

Allocates and initializes a new message port.  The message list
of the new port will be prepared for use (via NewList).  A signal
bit will be allocated, and the port will be set to signal your
task when a message arrives (PA_SIGNAL).

You *must* use [DeleteMsgPort](DeleteMsgPort) to delete ports created with
CreateMsgPort()!

RESULT
[MsgPort](MsgPort) - A new [MsgPort](MsgPort) structure ready for use, or NULL if out of
memory or signals.  If you wish to add this port to the public
port list, fill in the ln_Name and ln_Pri fields, then call
[AddPort](AddPort).  Don't forget RemPort()!

**SEE ALSO**

[DeleteMsgPort](DeleteMsgPort), [exec/AddPort](exec/AddPort), [exec/ports.h](exec/ports.h), [amiga.lib/CreatePort](amiga.lib/CreatePort)
