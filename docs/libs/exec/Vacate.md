
**NAME**

Vacate -- release a message lock (semaphore)

**SYNOPSIS**

```c
    Vacate(semaphore)
           A0

    void Vacate(struct Semaphore *);

```
Links: [Semaphore](_0082) 

**FUNCTION**

This function releases a previously locked semaphore (see
the [Procure](Procure) function).
If another task is waiting for the semaphore, its bidMessage
will be sent to its reply port.

INPUT
semaphore - the semaport message port representing the
semaphore to be freed.

BUGS
[Procure](Procure) and Vacate() do not have proven reliability.

**SEE ALSO**

[Procure](Procure)
