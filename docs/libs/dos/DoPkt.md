
**NAME**

DoPkt -- Send a dos packet and wait for reply (V36)

**SYNOPSIS**

```c
    result1 = DoPkt(port,action,arg1,arg2,arg3,arg4,arg5)
    D0               D1    D2    D3   D4   D5   D6   D7

    LONG DoPkt(struct MsgPort *,LONG,LONG,LONG,LONG,LONG,LONG)

```
Links: [MsgPort](_0099.md) 

**FUNCTION**

Sends a packet to a handler and waits for it to return.  Any secondary
return will be available in D1 AND from [IoErr](IoErr.md).  DoPkt() will work
even if the caller is an exec task and not a process; however it will
be slower, and may fail for some additional reasons, such as being
unable to allocate a signal.  DoPkt() uses your pr_MsgPort for the
reply, and will call pr_PktWait.  (See BUGS regarding tasks, though).

Only allows 5 arguments to be specified.  For more arguments (packets
support a maximum of 7) create a packet and use <a href="../Includes_and_Autodocs_2._guide/node030F.html">SendPkt()/WaitPkt().

**INPUTS**

port    - pr_MsgPort of the handler process to send to.
action  - the action requested of the filesystem/handler
arg1, arg2, arg3, arg4,arg5 - arguments, depend on the action, may not
be required.

RESULT
result1 - the value returned in dp_Res1, or FALSE if there was some
problem in sending the packet or recieving it.
result2 - Available from [IoErr](IoErr.md) AND in register D1.

BUGS
Using DoPkt() from tasks doesn't work in V36. Use [AllocDosObject](AllocDosObject.md),
[PutMsg](../exec/PutMsg.md), and <a href="../Includes_and_Autodocs_2._guide/node035A.html">WaitPort()/GetMsg() for a workaround, or you can call
[CreateNewProc](CreateNewProc.md) to start a process to do Dos I/O for you.  In V37,
DoPkt() will allocate, use, and free the [MsgPort](_0099.md) required.

NOTES
Callable from a task (under V37 and above).

**SEE ALSO**

[AllocDosObject](AllocDosObject.md), [FreeDosObject](FreeDosObject.md), [SendPkt](SendPkt.md), [WaitPkt](WaitPkt.md),
[CreateNewProc](CreateNewProc.md), [AbortPkt](AbortPkt.md)
