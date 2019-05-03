
**NAME**

AbortIO - attempt to abort an in-progress I/O request

**SYNOPSIS**

```c
    AbortIO(iORequest)
            A1

    VOID AbortIO(struct IORequest *);

```
Links: [IORequest](_0094) 

**FUNCTION**

Ask a device to abort a previously started [IORequest](_0094).  This is done
by calling the device's ABORTIO vector, with your given [IORequest](_0094).


AbortIO is a command the device that may or may not grant.  If
successful, the device will stop processing the [IORequest](_0094), and
reply to it earlier than it would otherwise have done.

NOTE
AbortIO() does NOT [Remove](Remove) the [IORequest](_0094) from your ReplyPort, OR
wait for it to complete.  After an AbortIO() you must wait normally
for the reply message before actually reusing the request.

If a request has already completed when AbortIO() is called, no
action is taken.

EXAMPLE
AbortIO(timer_request);
WaitIO(timer_request);
/* [Message](_0099) is free to be reused */

**INPUTS**

iORequest - pointer to an I/O request block (must have been used
at least once.  May be active or finished).

**SEE ALSO**

[WaitIO](WaitIO), [DoIO](DoIO), [SendIO](SendIO), [CheckIO](CheckIO)
