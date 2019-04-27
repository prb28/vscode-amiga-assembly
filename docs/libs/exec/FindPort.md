
**NAME**

FindPort -- find a given system message port

**SYNOPSIS**

```
    port = FindPort(name)
    D0              A1

```
struct [MsgPort](MsgPort) *FindPort(STRPTR);

**FUNCTION**

This function will search the system message port list for a port
with the given name.  The first port matching this name will be
returned.  No arbitration of the port list is done.  This function
MUST be protected with A [Forbid()/Permit](Forbid()/Permit) pair!

EXAMPLE
#include [&#060;exec/types.h&#062;](&#060;exec/types.h&#062;)
struct [MsgPort](MsgPort) *FindPort();

ULONG SafePutToPort(message, portname)
struct [Message](Message) *message;
STRPTR          portname;
{
struct [MsgPort](MsgPort) *port;

Forbid();
port = FindPort(portname);
if (port)
PutMsg(port,message);
Permit();
return((ULONG)port); /* If zero, the port has gone away */
}

INPUT
name - name of the port to find

RETURN
port - a pointer to the message port, or zero if
not found.
