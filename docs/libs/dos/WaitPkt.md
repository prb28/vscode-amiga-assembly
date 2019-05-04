
**NAME**

WaitPkt -- Waits for a packet to arrive at your pr_MsgPort (V36)

**SYNOPSIS**

```c
    packet = WaitPkt()
    D0

    struct DosPacket *WaitPkt(void);

```
Links: [DosPacket](_0078) 

**FUNCTION**

Waits for a packet to arrive at your pr_MsgPort.  If anyone has
installed a packet wait function in pr_PktWait, it will be called.
The message will be automatically GetMsg()ed so that it is no longer
on the port.  It assumes the message is a dos packet.  It is NOT
guaranteed to clear the signal for the port.

RESULT
packet - the packet that arrived at the port (from ln_Name of message).

**SEE ALSO**

[SendPkt](SendPkt), [DoPkt](DoPkt), [AbortPkt](AbortPkt)
