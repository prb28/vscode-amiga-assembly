
**NAME**

SuperState -- enter supervisor state with user stack

**SYNOPSIS**

```c
    oldSysStack = SuperState()
    D0

    APTR SuperState(void);

```
**FUNCTION**

Enter supervisor mode while running on the user's stack. The user
still has access to user stack variables.  Be careful though, the
user stack must be large enough to accommodate space for all
interrupt data -- this includes all possible nesting of interrupts.
This function does nothing when called from supervisor state.

**RESULTS**

oldSysStack - system stack pointer; save this.  It will come in
handy when you return to user state.  If the system
is already in supervisor mode, oldSysStack is zero.

**SEE ALSO**

[UserState/Supervisor](Supervisor.md)
