
**NAME**

RemSemaphore -- remove a signal semaphore from the system

**SYNOPSIS**

```c
    RemSemaphore(signalSemaphore)
                 A1

    void RemSemaphore(struct SignalSemaphore *);

```
Links: [SignalSemaphore](_0082.md) 

**FUNCTION**

This function removes a signal semaphore structure from the
system's signal semaphore list.  Subsequent attempts to
rendezvous by name with this semaphore will fail.

**INPUTS**

signalSemaphore -- an initialized signal semaphore structure

**SEE ALSO**

[AddSemaphore](AddSemaphore.md), [FindSemaphore](FindSemaphore.md)
