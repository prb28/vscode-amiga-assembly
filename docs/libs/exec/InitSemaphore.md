
**NAME**

InitSemaphore -- initialize a signal semaphore

**SYNOPSIS**

```c
    InitSemaphore(signalSemaphore)
                  A0

    void InitSemaphore(struct SignalSemaphore *);

```
Links: [SignalSemaphore](_0082) 

**FUNCTION**

This function initializes a signal semaphore and prepares it for
use.  It does not allocate anything, but does initialize list
pointers and the semaphore counters.

Semaphores are often used to protect critical data structures
or hardware that can only be accessed by one task at a time.
After initialization, the address of the [SignalSemaphore](_0082) may be
made available to any number of tasks.  Typically a task will
try to [ObtainSemaphore](ObtainSemaphore), passing this address in.  If no other
task owns the semaphore, then the call will lock and return
quickly.  If more tasks try to [ObtainSemaphore](ObtainSemaphore), they will
be put to sleep.  When the owner of the semaphore releases
it, the next waiter in turn will be woken up.

Semaphores are often preferable to the old-style <a href="../Includes_and_Autodocs_2._guide/node0369.html">Forbid()/Permit()
type arbitration.  With <a href="../Includes_and_Autodocs_2._guide/node0369.html">Forbid()/Permit() *all* other tasks are
prevented from running.  With semaphores, only those tasks that
need access to whatever the semaphore protects are subject
to waiting.

INPUT
signalSemaphore -- a signal semaphore structure (with all fields
set to zero before the call)

**SEE ALSO**

[ObtainSemaphore](ObtainSemaphore), [ObtainSemaphoreShared](ObtainSemaphoreShared), [AttemptSemaphore](AttemptSemaphore),
[ReleaseSemaphore](ReleaseSemaphore), [exec/semaphores.h](_0082)
