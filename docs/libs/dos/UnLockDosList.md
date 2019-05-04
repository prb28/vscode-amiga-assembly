
**NAME**

UnLockDosList -- Unlocks the Dos [List](_007D) (V36)

**SYNOPSIS**

```c
    UnLockDosList(flags)
                    D1

    void UnLockDosList(ULONG)

```
**FUNCTION**

Unlocks the access on the Dos [Device](_0087) [List](_007D).  You MUST pass the same
flags you used to lock the list.

**INPUTS**

flags - MUST be the same flags passed to (Attempt)LockDosList()

**SEE ALSO**

[AttemptLockDosList](AttemptLockDosList), [LockDosList](LockDosList), [Permit](../exec/Permit)
