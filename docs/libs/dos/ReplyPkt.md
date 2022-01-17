
**NAME**

ReplyPkt -- replies a packet to the person who sent it to you (V36)

**SYNOPSIS**

```c
    ReplyPkt(packet, result1, result2)
               D1      D2       D3

    void ReplyPkt(struct DosPacket *, LONG, LONG)

```
Links: [DosPacket](_0078.md) 

**FUNCTION**

This returns a packet to the process which sent it to you.  In
addition, puts your pr_MsgPort address in dp_Port, so using ReplyPkt()
again will send the message to you.  (This is used in &#034;ping-ponging&#034;
packets between two processes).  It uses result 1 &#038; 2 to set the
dp_Res1 and dp_Res2 fields of the packet.

**INPUTS**

packet  - packet to reply, assumed to set up correctly.
result1 - first result
result2 - secondary result

**SEE ALSO**

[DoPkt](DoPkt.md), [SendPkt](SendPkt.md), [WaitPkt](WaitPkt.md), [IoErr](IoErr.md)
