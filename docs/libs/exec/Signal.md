
**NAME**

Signal -- signal a task

**SYNOPSIS**

```c
    Signal(task, signals)
           A1    D0

    void Signal(struct Task *,ULONG);

```
Links: [Task](_008E) 

**FUNCTION**

This function signals a task with the given signals.  If the task
is currently waiting for one or more of these signals, it will be
made ready and a reschedule will occur. If the task is not waiting
for any of these signals, the signals will be posted to the task
for possible later use. A signal may be sent to a task regardless
of whether its running, ready, or waiting.

This function is considered &#034;low level&#034;.  Its main purpose is to
support multiple higher level functions like [PutMsg](PutMsg).

This function is safe to call from interrupts.

INPUT
task - the task to be signalled
signals - the signals to be sent

**SEE ALSO**

Wait, [SetSignal](SetSignal)
