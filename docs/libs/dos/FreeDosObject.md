
**NAME**

FreeDosObject -- Frees an object allocated by [AllocDosObject](AllocDosObject.md) (V36)

**SYNOPSIS**

```c
    FreeDosObject(type, ptr)
                   D1   D2

    void FreeDosObject(ULONG, void *)

```
**FUNCTION**

Frees an object allocated by [AllocDosObject](AllocDosObject.md).  Do NOT call for
objects allocated in any other way.

**INPUTS**

type - type passed to [AllocDosObject](AllocDosObject.md)
ptr  - ptr returned by [AllocDosObject](AllocDosObject.md)

**SEE ALSO**

[AllocDosObject](AllocDosObject.md), [&#060;dos/dos.h&#062;](_0068.md)
