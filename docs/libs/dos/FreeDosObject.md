
**NAME**

FreeDosObject -- Frees an object allocated by [AllocDosObject](AllocDosObject) (V36)

**SYNOPSIS**

```c
    FreeDosObject(type, ptr)
                   D1   D2

    void FreeDosObject(ULONG, void *)

```
**FUNCTION**

Frees an object allocated by [AllocDosObject](AllocDosObject).  Do NOT call for
objects allocated in any other way.

**INPUTS**

type - type passed to [AllocDosObject](AllocDosObject)
ptr  - ptr returned by [AllocDosObject](AllocDosObject)

**SEE ALSO**

[AllocDosObject](AllocDosObject), [&#060;dos/dos.h&#062;](_0068)
