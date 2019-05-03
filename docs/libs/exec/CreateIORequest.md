
**NAME**

CreateIORequest() -- create an [IORequest](_0094) structure  (V36)

**SYNOPSIS**

```c
    ioReq = CreateIORequest( ioReplyPort, size );
                             A0           D0

    struct IORequest *CreateIORequest(struct MsgPort *, ULONG);

```
Links: [IORequest](_0094) [MsgPort](_0099) 

**FUNCTION**

Allocates memory for and initializes a new IO request block
of a user-specified number of bytes.  The number of bytes
must be at least as large as a &#034;struct Message&#034;.

**INPUTS**

ioReplyPort - Pointer to a port for replies (an initialized message
port, as created by [CreateMsgPort](CreateMsgPort) ).  If NULL, this
function fails.
size - the size of the IO request to be created.

RESULT
ioReq - A pointer to the new [IORequest](_0094) block, or NULL.

**SEE ALSO**

[DeleteIORequest](DeleteIORequest), [CreateMsgPort](CreateMsgPort), [amiga.lib/CreateExtIO](_0147)
