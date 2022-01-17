
**NAME**

UnLockDosList -- Unlocks the Dos [List](_007D.md) (V36)

**SYNOPSIS**

```c
    UnLockDosList(flags)
                    D1

    void UnLockDosList(ULONG)

```
**FUNCTION**

Unlocks the access on the Dos [Device](_0087.md) [List](_007D.md).  You MUST pass the same
flags you used to lock the list.

**INPUTS**

flags - MUST be the same flags passed to (Attempt)LockDosList()

**SEE ALSO**

[AttemptLockDosList](AttemptLockDosList.md), [LockDosList](LockDosList.md), [Permit](../exec/Permit.md)
