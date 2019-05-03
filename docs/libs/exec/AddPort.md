
**NAME**

AddPort -- add a public message port to the system

**SYNOPSIS**

```c
    AddPort(port)
            A1

    void AddPort(struct MsgPort *);

```
Links: [MsgPort](_0099) 

**FUNCTION**

This function attaches a message port structure to the system's
public message port list, where it can be found by the [FindPort](FindPort)
function.  The name and priority fields of the port structure must
be initialized prior to calling this function.  If the user does
not require the priority field, it should be initialized to zero.

Only ports that will be searched for with [FindPort](FindPort) need to
be added to the system list.  In addition, adding ports is often
useful during debugging.  If the port will be searched for,
the priority field should be at least 1 (to avoid the large number
of inactive ports at priority zero).  If the port will be searched
for often, set the proritiry in the 50-100 range (so it will be
before other less used ports).

Once a port has been added to the naming list, you must be careful
to remove the port from the list (via RemPort) before deallocating
its memory.

NOTE
A point of confusion is that clearing a [MsgPort](_0099) structure to all
zeros is not enough to prepare it for use.  As mentioned in the
Exec chapter of the ROM Kernel Manual, the [List](_007D) for the [MsgPort](_0099)
must be initialized.  This is automatically handled by AddPort(),
and [amiga.lib/CreatePort](_0148).  This initialization can be done manually
with [amiga.lib/NewList](_0161) or the assembly NEWLIST macro.

Do not AddPort an active port.

**INPUTS**

port - pointer to a message port

**SEE ALSO**

[RemPort](RemPort), [FindPort](FindPort), [amiga.lib/CreatePort](_0148), [amiga.lib/NewList](_0161)
