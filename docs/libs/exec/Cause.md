
**NAME**

Cause -- cause a software interrupt

**SYNOPSIS**

```c
   Cause(interrupt)
         A1

   void Cause(struct Interrupt *);

```
Links: [Interrupt](_008C) 

**FUNCTION**

This function causes a software interrupt to occur.  If it is
called from user mode (and processor level 0), the software
interrupt will preempt the current task.  This call is often used
by high-level hardware interrupts to defer medium-length processing
down to a lower interrupt level.  Note that a software interrupt is
still a real interrupt, and must obey the same restrictions on what
system function it may call.

Currently only 5 software interrupt priorities are implemented:
-32, -16, 0, +16, and +32.  Priorities in between are truncated,
values outside the -32/+32 range are not allowed.

NOTE
When setting up the [Interrupt](_008C) structure, set the node type to
NT_INTERRUPT, or NT_UNKOWN.

IMPLEMENTATION
1&#062; Checks if the node type is NT_SOFTINT.  If so does nothing since
the softint is already pending.  No nest count is maintained.
2&#062; Sets the node type to NT_SOFTINT.
3&#062; Links into one of the 5 priority queues.
4&#062; Pokes the hardware interrupt bit used for softints.

The node type returns to NT_INTERRUPT after removal from the list.

**INPUTS**

interrupt - pointer to a properly initialized interrupt node

BUGS
Unlike other Interrupts, SoftInts must preserve the value of A6.
