
**NAME**

AllocTrap -- allocate a processor trap vector

**SYNOPSIS**

```c
    trapNum = AllocTrap(trapNum)
    D0                  D0

    LONG AllocTrap(LONG);

```
**FUNCTION**

Allocate a trap number from the current task's pool.  These trap
numbers are those associated with the 68000 TRAP type instructions.
Either a particular number, or the next free number may be
allocated.

If the trap is already in use (or no free traps are available) a -1
is returned.

This function only affects the currently running task.

Traps are sent to the trap handler pointed at by tc_TrapCode.
Unless changed by user code, this points to a standard trap
handler.  The stack frame of the exception handler will be:

0(SP) = Exception vector number.  This will be in the
range of 32 to 47 (corresponding to the
Trap #1...Trap #15 instructions).
4(SP) = 68000/68010/68020/68030, etc. exception frame

tc_TrapData is not used.


**WARNING**

Traps may not be allocated or freed from exception handling code.
You are not allowed to write to the exception table yourself.  In
fact, on some machines you will have trouble finding it - the VBR
register may be used to remap its location.

**INPUTS**

trapNum - the desired trap number {of 0..15} or -1
for no preference.

**RESULTS**

trapNum - the trap number allocated {of 0..15}.  If no traps are
available, this function returns -1.  Instructions of the
form &#034;Trap #trapNum&#034; will be sent to the task's trap
handler.

**SEE ALSO**

[FreeTrap](FreeTrap.md)
