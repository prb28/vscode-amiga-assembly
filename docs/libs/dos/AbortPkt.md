
**NAME**

AbortPkt -- Aborts an asynchronous packet, if possible. (V36)

**SYNOPSIS**

```c
    AbortPkt(port, pkt)
              D1    D2

    void AbortPkt(struct MsgPort *, struct DosPacket *)

```
Links: [MsgPort](_0099) [DosPacket](_0078) 

**FUNCTION**

This attempts to abort a packet sent earlier with [SendPkt](SendPkt) to a
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

[SendPkt](SendPkt), [DoPkt](DoPkt), [WaitPkt](WaitPkt)
