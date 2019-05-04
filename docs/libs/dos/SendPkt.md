
**NAME**

SendPkt -- Sends a packet to a handler (V36)

**SYNOPSIS**

```c
    SendPkt(packet, port, replyport)
             D1     D2      D3

    void SendPkt(struct DosPacket *,struct MsgPort *,struct MsgPort *)

```
Links: [DosPacket](_0078) [MsgPort](_0099) [MsgPort](_0099) 

**FUNCTION**

Sends a packet to a handler and does not wait.  All fields in the
packet must be initialized before calling this routine.  The packet
will be returned to replyport.  If you wish to use this with
[WaitPkt](WaitPkt), use the address or your pr_MsgPort for replyport.

**INPUTS**

packet - packet to send, must be initialized and have a message.
port   - pr_MsgPort of handler process to send to.
replyport - [MsgPort](_0099) for the packet to come back to.

NOTES
Callable from a task.

**SEE ALSO**

[DoPkt](DoPkt), [WaitPkt](WaitPkt), [AllocDosObject](AllocDosObject), [FreeDosObject](FreeDosObject), [AbortPkt](AbortPkt)
