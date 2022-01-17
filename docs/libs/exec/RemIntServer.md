
**NAME**

RemIntServer -- remove an interrupt server from a server chain

**SYNOPSIS**

```c
    RemIntServer(intNum, interrupt)
                 D0      A1

    void RemIntServer(ULONG,struct Interrupt *);

```
Links: [Interrupt](_008C.md) 

**FUNCTION**

This function removes an interrupt server node from the given
server chain.

If this server was the last one on this chain, interrupts for this
chain are disabled.

**INPUTS**

intNum - the Paula interrupt bit (0..14)
interrupt - pointer to an interrupt server node

BUGS
Before V36 Kickstart, the feature that disables the interrupt
would not function.  For most server chains this does not
cause a problem.

**SEE ALSO**

[AddIntServer](AddIntServer.md), [hardware/intbits.h](_00CE.md)
