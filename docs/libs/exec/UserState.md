
**NAME**

UserState -- return to user state with user stack

**SYNOPSIS**

```c
    UserState(sysStack)
              D0

    void UserState(APTR);

```
**FUNCTION**

Return to user state with user stack, from supervisor state with
user stack.  This function is normally used in conjunction with the
[SuperState](SuperState.md) function above.

This function must not be called from the user state.

INPUT
sysStack - supervisor stack pointer

BUGS
This function is broken in V33/34 Kickstart.  Fixed in V1.31 setpatch.

**SEE ALSO**

[SuperState/Supervisor](Supervisor.md)
