
**NAME**

AddSemaphore -- initialize then add a signal semaphore to the system

**SYNOPSIS**

```c
    AddSemaphore(signalSemaphore)
                 A1

    void AddSemaphore(struct SignalSemaphore *);

```
Links: [SignalSemaphore](_0082) 

**FUNCTION**

This function attaches a signal semaphore structure to the system's
public signal semaphore list.  The name and priority fields of the
semaphore structure must be initialized prior to calling this
function.  If you do not want to let others rendezvous with this
semaphore, use [InitSemaphore](InitSemaphore) instead.

If a semaphore has been added to the naming list, you must be
careful to remove the semaphore from the list (via RemSemaphore)
before deallocating its memory.

Semaphores that are linked together in an allocation list (which
[ObtainSemaphoreList](ObtainSemaphoreList) would use) may not be added to the system
naming list, because the facilities use the link field of the
signal semaphore in incompatible ways

**INPUTS**

signalSemaphore -- an signal semaphore structure

BUGS
Does not work in Exec &#060;V36.  Instead use this code:

#include [&#060;exec/execbase.h&#062;](_009E)
#include [&#060;exec/nodes.h&#062;](_0091)
extern struct [ExecBase](_009E) *SysBase;
...
void LocalAddSemaphore(s)
struct [SignalSemaphore](_0082) *s;
{
s-&#062;ss_Link.ln_Type=NT_SIGNALSEM;
InitSemaphore(s);
Forbid();
Enqueue(&#038;SysBase-&#062;SemaphoreList,s);
Permit();
}

**SEE ALSO**

[RemSemaphore](RemSemaphore), [FindSemaphore](FindSemaphore), [InitSemaphore](InitSemaphore)
