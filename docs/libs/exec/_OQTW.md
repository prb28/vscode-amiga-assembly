
**NAME**

CreateExtIO -- create an [IORequest](_OOYT) structure

**SYNOPSIS**

```c
    ioReq = CreateExtIO(port,ioSize);

    struct IORequest *CreateExtIO(struct MsgPort *, ULONG);

```
Links: [IORequest](_OOYT) [MsgPort](_OOYY) 

**FUNCTION**

Allocates memory for and initializes a new IO request block
of a user-specified number of bytes. The number of bytes
MUST be the size of a legal [IORequest](_OOYT) (or extended IORequest)
or very nasty things will happen.

**INPUTS**

port - an already initialized message port to be used for this IO
request's reply port. If this is NULL this function fails.
ioSize - the size of the IO request to be created.

RESULT
ioReq - a new IO Request block, or NULL if there was not enough memory

EXAMPLE
if (ioReq = CreateExtIO(CreatePort(NULL,0),sizeof(struct IOExtTD)))

**SEE ALSO**

[DeleteExtIO](_OQUR), [CreatePort](_OQTX), [exec_library/CreateMsgPort](CreateMsgPort)
