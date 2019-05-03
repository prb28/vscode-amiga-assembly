
**NAME**

GetMsg -- get next message from a message port

**SYNOPSIS**

```c
    message = GetMsg(port)
    D0               A0

    struct Message *GetMsg(struct MsgPort *);

```
Links: [Message](_0099) [MsgPort](_0099) 

**FUNCTION**

This function receives a message from a given message port. It
provides a fast, non-copying message receiving mechanism. The
received message is removed from the message port.

This function will not wait.  If a message is not present this
function will return zero.  If a program must wait for a message,
it can [Wait](Wait) on the signal specified for the port or use the
[WaitPort](WaitPort) function.  There can only be one task waiting for any
given port.

Getting a message does not imply to the sender that the message is
free to be reused by the sender.  When the receiver is finished
with the message, it may [ReplyMsg](ReplyMsg) it back to the sender.


Getting a signal does NOT always imply a message is ready.  More
than one message may arrive per signal, and signals may show up
without messages.  Typically you must loop to GetMsg() until it
returns zero, then [Wait](Wait) or [WaitPort](WaitPort).

INPUT
port - a pointer to the receiver message port

RESULT
message - a pointer to the first message available.  If
there are no messages, return zero.
Callers must be prepared for zero at any time.

**SEE ALSO**

[PutMsg](PutMsg), [ReplyMsg](ReplyMsg), [WaitPort](WaitPort), Wait, [exec/ports.h](_0099)
