
**NAME**

ReleaseSemaphoreList -- make a list of semaphores available

**SYNOPSIS**

```c
    ReleaseSemaphoreList(list)
                         A0

    void ReleaseSemaphoreList(struct List *);

```
Links: [List](_007D.md) 

**FUNCTION**

ReleaseSemaphoreList() is the inverse of [ObtainSemaphoreList](ObtainSemaphoreList.md). It
releases each element in the semaphore list.

Needless to say, havoc breaks out if the task releases more times
than it has obtained.

INPUT
list -- a list of signal semaphores

**SEE ALSO**

[ObtainSemaphoreList](ObtainSemaphoreList.md)
