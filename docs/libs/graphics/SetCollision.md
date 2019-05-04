
**NAME**

SetCollision -- Set a pointer to a user collision routine.

**SYNOPSIS**

```c
    SetCollision(num, routine, GInfo)
                 D0   A0       A1

    void SetCollision(ULONG, VOID (*)(), struct GelsInfo *);

```
Links: [GelsInfo](_00AF) 

**FUNCTION**

Sets a specified entry (num) in the user's collision vectors table
equal to the address of the specified collision routine.

**INPUTS**

num     = collision vector number
routine = pointer to the user's collision routine
GInfo   = pointer to a [GelsInfo](_00AF) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [graphics/gels.h](_00C3)  [graphics/rastport.h](_00AF)
