
**NAME**

ReplyMsg -- put a message to its reply port

**SYNOPSIS**

```c
    ReplyMsg(message)
             A1

    void ReplyMsg(struct Message *);

```
Links: [Message](_0099) 

**FUNCTION**

This function sends a message to its reply port.  This is usually
done when the receiver of a message has finished and wants to
return it to the sender (so that it can be re-used or deallocated,
whatever).

This call may be made from interrupts.

INPUT
message - a pointer to the message

IMPLEMENTATION
1&#062; Places &#034;NT_REPLYMSG&#034; into LN_TYPE.
2&#062; Puts the message to the port specified by MN_REPLYPORT
If there is no replyport, sets LN_TYPE to &#034;NT_FREEMSG&#034; (use this
feature only with extreeme care).

**SEE ALSO**

[GetMsg](GetMsg), [PutMsg](PutMsg), [exec/ports.h](_0099)
