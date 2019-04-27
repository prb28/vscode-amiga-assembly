
**NAME**

RemPort -- remove a message port from the system

**SYNOPSIS**

```
    RemPort(port)
            A1

```
void RemPort(struct [MsgPort](MsgPort) *);

**FUNCTION**

This function removes a message port structure from the system's
message port list.  Subsequent attempts to rendezvous by name with
this port will fail.

**INPUTS**

port - pointer to a message port

**SEE ALSO**

[AddPort](AddPort), [FindPort](FindPort)
