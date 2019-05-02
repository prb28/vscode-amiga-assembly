
**NAME**

CreateIORequest() -- create an [IORequest](_OOYT) structure  (V36)

**SYNOPSIS**

```c
    ioReq = CreateIORequest( ioReplyPort, size );
                             A0           D0

    struct IORequest *CreateIORequest(struct MsgPort *, ULONG);

```
Links: [IORequest](_OOYT) [MsgPort](_OOYY) 

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
ioReq - A pointer to the new [IORequest](_OOYT) block, or NULL.

**SEE ALSO**

[DeleteIORequest](DeleteIORequest), [CreateMsgPort](CreateMsgPort), [amiga.lib/CreateExtIO](_OQTW)
