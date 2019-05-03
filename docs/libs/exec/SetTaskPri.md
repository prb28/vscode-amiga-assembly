
**NAME**

SetTaskPri -- get and set the priority of a task

**SYNOPSIS**

```c
    oldPriority = SetTaskPri(task, priority)
    D0-0:8                   A1    D0-0:8

    BYTE SetTaskPri(struct Task *,LONG);

```
Links: [Task](_008E) 

**FUNCTION**

This function changes the priority of a task regardless of its
state.  The old priority of the task is returned.  A reschedule is
performed, and a context switch may result.

To change the priority of the currently running task, pass the
result of FindTask(0); as the task pointer.

**INPUTS**

task - task to be affected
priority - the new priority for the task

RESULT
oldPriority - the tasks previous priority
