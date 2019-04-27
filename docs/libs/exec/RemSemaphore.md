
**NAME**

RemSemaphore -- remove a signal semaphore from the system

**SYNOPSIS**

```
    RemSemaphore(signalSemaphore)
                 A1

```
void RemSemaphore(struct [SignalSemaphore](SignalSemaphore) *);

**FUNCTION**

This function removes a signal semaphore structure from the
system's signal semaphore list.  Subsequent attempts to
rendezvous by name with this semaphore will fail.

**INPUTS**

signalSemaphore -- an initialized signal semaphore structure

**SEE ALSO**

[AddSemaphore](AddSemaphore), [FindSemaphore](FindSemaphore)
