
**NAME**

Disable -- disable interrupt processing.

**SYNOPSIS**

```c
    Disable();

    void Disable(void);

```
**FUNCTION**

Prevents interrupts from being handled by the system, until a
matching [Enable](Enable) is executed.  Disable() implies [Forbid](Forbid).

DO NOT USE THIS CALL WITHOUT GOOD JUSTIFICATION.  THIS CALL IS
VERY DANGEROUS!

**RESULTS**

All interrupt processing is deferred until the task executing makes
a call to [Enable](Enable) or is placed in a wait state.  Normal task
rescheduling does not occur while interrupts are disabled.  In order
to restore normal interrupt processing, the programmer must execute
exactly one call to [Enable](Enable) for every call to Disable().

IMPORTANT REMINDER:

It is important to remember that there is a danger in using
disabled sections.  Disabling interrupts for more than ~250
microseconds will prevent vital system functions (especially serial
I/0) from operating in a normal fashion.

Think twice before using Disable(), then think once more.
After all that, think again.  With enough thought, the need
for a Disable() can often be eliminated.  For the user of many
device drivers, a write to disable *only* the particular interrupt
of interest can replace a Disable().  For example:
MOVE.W  #INTF_PORTS,_intena
Do not use a macro for Disable(), insist on the real thing.

This call may be made from interrupts, it will have the effect
of locking out all higher-level interrupts (lower-level interrupts
are automatically disabled by the CPU).

Note: In the event of a task entering a [Wait](Wait) after disabling
interrupts, the system &#034;breaks&#034; the disabled state and runs
normally until the task which called Disable() is rescheduled.

NOTE
This call is guaranteed to preserve all registers.

**SEE ALSO**

Forbid, Permit, Enable
