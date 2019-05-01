
**NAME**

SetIoErr -- Sets the value returned by [IoErr](IoErr) (V36)

**SYNOPSIS**

```c
    oldcode = SetIoErr(code)
    D0                  D1

    LONG SetIoErr(LONG);

```
**FUNCTION**

This routine sets up the secondary result (pr_Result2) return code
(returned by the [IoErr](IoErr) function).

**INPUTS**

code - Code to be returned by a call to [IoErr](IoErr).

RESULT
oldcode - The previous error code.

**SEE ALSO**

[IoErr](IoErr), [Fault](Fault), [PrintFault](PrintFault)
