
**NAME**

SetIntVector -- set a new handler for a system interrupt vector

**SYNOPSIS**

```c
    oldInterrupt = SetIntVector(intNumber, interrupt)
    D0                          D0         A1

    struct Interrupt *SetIntVector(ULONG, struct Interrupt *);

```
Links: [Interrupt](_008C.md) [Interrupt](_008C.md) 

**FUNCTION**

This function provides a mechanism for setting the system interrupt
vectors.  These are non-sharable; setting a new interrupt handler
disconnects the old one.  Installed handlers are responsible for
processing, enabling and clearing the interrupt.  Note that interrupts
may have been left in any state by the previous code.

The IS_CODE and IS_DATA pointers of the [Interrupt](_008C.md) structure will
be copied into a private place by Exec.  A pointer to the previously
installed [Interrupt](_008C.md) structure is returned.

When the system calls the specified interrupt code, the registers are
setup as follows:

D0 - scratch
D1 - scratch (on entry: active
interrupts -&#062; equals INTENA &#038; INTREQ)

A0 - scratch (on entry: pointer to base of custom chips
for fast indexing)
A1 - scratch (on entry: Interrupt's IS_DATA pointer)

A5 - jump vector register (scratch on call)
A6 - Exec library base pointer (scratch on call)

all other registers must be preserved

**INPUTS**

intNum - the Paula interrupt bit number (0..14).  Only non-chained
interrupts should be set.  Use [AddIntServer](AddIntServer.md) for server
chains.
interrupt - a pointer to an [Interrupt](_008C.md) structure containing the
handler's entry point and data segment pointer.  A NULL
interrupt pointer will remove the current interrupt and
set illegal values for IS_CODE and IS_DATA.

By convention, the LN_NAME of the interrupt structure must
point a descriptive string so that other users may
identify who currently has control of the interrupt.

RESULT
A pointer to the prior interrupt structure which had control
of this interrupt.

**SEE ALSO**

[AddIntServer](AddIntServer.md),exec/interrupts.i,hardware/intbits.i
