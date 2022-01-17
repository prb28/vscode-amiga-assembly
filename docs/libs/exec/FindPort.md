
**NAME**

FindPort -- find a given system message port

**SYNOPSIS**

```c
    port = FindPort(name)
    D0              A1

    struct MsgPort *FindPort(STRPTR);

```
Links: [MsgPort](_0099.md) 

**FUNCTION**

This function will search the system message port list for a port
with the given name.  The first port matching this name will be
returned.  No arbitration of the port list is done.  This function
MUST be protected with A <a href="../Includes_and_Autodocs_2._guide/node0369.html">Forbid()/Permit() pair!

EXAMPLE
#include [&#060;exec/types.h&#062;](_0096.md)
struct [MsgPort](_0099.md) *FindPort();

ULONG SafePutToPort(message, portname)
struct [Message](_0099.md) *message;
STRPTR          portname;
{
struct [MsgPort](_0099.md) *port;

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
