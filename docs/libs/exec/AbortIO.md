
**NAME**

AbortIO - attempt to abort an in-progress I/O request

**SYNOPSIS**

```c
    AbortIO(iORequest)
            A1

    VOID AbortIO(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

Ask a device to abort a previously started [IORequest](_0094.md).  This is done
by calling the device's ABORTIO vector, with your given [IORequest](_0094.md).


AbortIO is a command the device that may or may not grant.  If
successful, the device will stop processing the [IORequest](_0094.md), and
reply to it earlier than it would otherwise have done.

NOTE
AbortIO() does NOT [Remove](Remove.md) the [IORequest](_0094.md) from your ReplyPort, OR
wait for it to complete.  After an AbortIO() you must wait normally
for the reply message before actually reusing the request.

If a request has already completed when AbortIO() is called, no
action is taken.

EXAMPLE
AbortIO(timer_request);
WaitIO(timer_request);
/* [Message](_0099.md) is free to be reused */

**INPUTS**

iORequest - pointer to an I/O request block (must have been used
at least once.  May be active or finished).

**SEE ALSO**

[WaitIO](WaitIO.md), [DoIO](DoIO.md), [SendIO](SendIO.md), [CheckIO](CheckIO.md)
