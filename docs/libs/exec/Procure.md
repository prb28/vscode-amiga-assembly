
**NAME**

Procure -- bid for a message lock (semaphore)

**SYNOPSIS**

```c
    result = Procure(semaphore, bidMessage)
    D0               A0         A1

    BYTE Procure(struct Semaphore *, struct Message *);

```
Links: [Semaphore](_0082) [Message](_0099) 

**FUNCTION**

This function is used to obtain a message based semaphore lock.  If
the lock is immediate, Procure() returns a true result, and the
bidMessage is not used.   If the semaphore is already locked,
Procure() returns false, and the task must wait for the bidMessage
to arrive at its reply port.

Straight &#034;Semaphores&#034; use the message system.  They are therefore
queueable, and users may wait on several of them at the same time.
This makes them more powerful than &#034;Signal Semaphores&#034;

INPUT
semaphore - a semaphore message port.  This port is used to queue
all pending lockers.  This port should be initialized with the
PA_IGNORE option, as the MP_SigTask field is used for a pointer to
the current locker message (not a task). New semaphore ports must
also have the SM_BIDS word initialized to -1.  If the semaphore is
public, it should be named, its priority set, and the added with
[AddPort](AddPort). [Message](_0099) port priority is often used for anti-deadlock
locking conventions.

RESULT
result - true when the semaphore is free.  In such cases no waiting
needs to be done.  If false, then the task should wait at its
bidMessage reply port.

BUGS
Procure() and [Vacate](Vacate) do not have proven reliability.

**SEE ALSO**

[Vacate](Vacate)
