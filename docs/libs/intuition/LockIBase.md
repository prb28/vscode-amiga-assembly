
**NAME**

LockIBase -- Invoke semaphore arbitration of [IntuitionBase](_00DC).

**SYNOPSIS**

```c
    Lock = LockIBase( LockNumber )
    D0                D0

    ULONG LockIBase( ULONG );

```
**FUNCTION**

Grabs Intuition internal semaphore so that caller may examine
[IntuitionBase](_00DC) safely.  This function is not a magic &#034;fix all my
race conditions&#034; panacea.

The idea here is that you can get the locks Intuition needs before
such [IntuitionBase](_00DC) fields as ActiveWindow and FirstScreen are
changed, or linked lists of windows and screens are changed.

Do Not Get Tricky with this entry point, and do not hold these locks
for long, as all Intuition input processing will wait for you to
surrender the lock by a call to [UnlockIBase](UnlockIBase).

NOTE WELL: A call to this function MUST be paired with a subsequent
call to [UnlockIBase](UnlockIBase), and soon, please.

NOTE WELL: Do not call any Intuition functions (nor any graphics,
layers, dos, or other high-level system function) while
holding this lock.

**INPUTS**

A long unsigned integer, LockNumber, specifies which of Intuition's
internal locks you want to get.  This parameter should be zero for all
forseeable uses of this function, which will let you examine active
fields and linked lists of screens and windows with safety.

RESULT
Returns another ULONG which should be passed to [UnlockIBase](UnlockIBase) to
surrender the lock gotten by this call.

BUGS
This function must not be called while holding any other system locks
such as layer or LayerInfo locks.

**SEE ALSO**

[UnlockIBase](UnlockIBase), [layers.library/LockLayerInfo](../layers/LockLayerInfo),
[exec.library/ObtainSemaphore](../exec/ObtainSemaphore)
