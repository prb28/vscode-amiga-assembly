
**NAME**

UnLockDosList -- Unlocks the Dos [List](_OOWD) (V36)

**SYNOPSIS**

```c
    UnLockDosList(flags)
                    D1

    void UnLockDosList(ULONG)

```
**FUNCTION**

Unlocks the access on the Dos [Device](_OOXW) [List](_OOWD).  You MUST pass the same
flags you used to lock the list.

**INPUTS**

flags - MUST be the same flags passed to (Attempt)LockDosList()

**SEE ALSO**

[AttemptLockDosList](AttemptLockDosList), [LockDosList](LockDosList), [Permit](_OSVY)
