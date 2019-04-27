
**NAME**

AttemptSemaphore -- try to obtain without blocking

**SYNOPSIS**

```
    success = AttemptSemaphore(signalSemaphore)
    D0                         A0

```
LONG AttemptSemaphore(struct [SignalSemaphore](SignalSemaphore) *);

**FUNCTION**

This call is similar to [ObtainSemaphore](ObtainSemaphore), except that it will not
block if the semaphore could not be locked.

INPUT
signalSemaphore -- an initialized signal semaphore structure

RESULT
success -- TRUE if the semaphore was locked, false if some
other task already possessed the semaphore.

NOTE
This call does NOT preserve registers.

**SEE ALSO**

[ObtainSemaphore](ObtainSemaphore) [ObtainSemaphoreShared](ObtainSemaphoreShared), [ReleaseSemaphore](ReleaseSemaphore),
[exec/semaphores.h](exec/semaphores.h)
