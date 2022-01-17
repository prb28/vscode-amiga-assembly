
**NAME**

AbortPkt -- Aborts an asynchronous packet, if possible. (V36)

**SYNOPSIS**

```c
    AbortPkt(port, pkt)
              D1    D2

    void AbortPkt(struct MsgPort *, struct DosPacket *)

```
Links: [MsgPort](_0099.md) [DosPacket](_0078.md) 

**FUNCTION**

This attempts to abort a packet sent earlier with [SendPkt](SendPkt.md) to a
handler.  There is no guarantee that any given handler will allow
a packet to be aborted, or if it is aborted whether function
requested completed first or completely.  After calling AbortPkt(),
you must wait for the packet to return before reusing it or
deallocating it.

**INPUTS**

port - port the packet was sent to
pkt  - the packet you wish aborted

BUGS
As of V37, this function does nothing.

**SEE ALSO**

[SendPkt](SendPkt.md), [DoPkt](DoPkt.md), [WaitPkt](WaitPkt.md)
