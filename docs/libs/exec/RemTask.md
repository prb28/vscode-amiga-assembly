
**NAME**

RemTask -- remove a task from the system

**SYNOPSIS**

```
    RemTask(task)
            A1

```
void RemTask(struct [Task](Task) *);

**FUNCTION**

This function removes a task from the system.  Deallocation of
resources should have been performed prior to calling this
function.  Removing some other task is very dangerous.  Generally
is is best to arrange for tasks to call RemTask(0L) on themselves.

RemTask will automagically free any memory lists attached to the
task's TC_MEMENTRY list.

**INPUTS**

task - pointer to the task node representing the task to be
removed.  A zero value indicates self removal, and will
cause the next ready task to begin execution.

BUGS
Before V36 if RemTask() was called on a task other than the current
task, and that task was created with [amiga.lib/CreateTask](amiga.lib/CreateTask), there was
a slight chance of a crash.  The problem can be hidden by bracketing
RemTask() with [Forbid()/Permit](Forbid()/Permit).

**SEE ALSO**

[AddTask](AddTask), [exec/AllocEntry](exec/AllocEntry), [amiga.lib/DeleteTask](amiga.lib/DeleteTask)
