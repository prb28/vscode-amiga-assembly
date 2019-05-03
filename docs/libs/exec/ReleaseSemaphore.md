
**NAME**

ReleaseSemaphore -- make signal semaphore available to others

**SYNOPSIS**

```c
    ReleaseSemaphore(signalSemaphore)
                     A0

    void ReleaseSemaphore(struct SignalSemaphore *);

```
Links: [SignalSemaphore](_0082) 

**FUNCTION**

ReleaseSemaphore() is the inverse of [ObtainSemaphore](ObtainSemaphore). It makes
the semaphore lockable to other users.  If tasks are waiting for
the semaphore and this this task is done with the semaphore then
the next waiting task is signalled.

Each [ObtainSemaphore](ObtainSemaphore) call must be balanced by exactly one
ReleaseSemaphore() call.  This is because there is a nesting count
maintained in the semaphore of the number of times that the current
task has locked the semaphore. The semaphore is not released to
other tasks until the number of releases matches the number of
obtains.

Needless to say, havoc breaks out if the task releases more times
than it has obtained.

INPUT
signalSemaphore -- an initialized signal semaphore structure

NOTE
This call is guaranteed to preserve all registers.

**SEE ALSO**

[InitSemaphore](InitSemaphore), [ObtainSemaphore](ObtainSemaphore), [ObtainSemaphoreShared](ObtainSemaphoreShared)
