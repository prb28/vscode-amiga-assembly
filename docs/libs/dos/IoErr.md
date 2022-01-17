
**NAME**

IoErr -- Return extra information from the system

**SYNOPSIS**

```c
    error = IoErr()
      D0

    LONG IoErr(void)

```
**FUNCTION**

Most I/O routines return zero to indicate an error. When this
happens (or whatever the defined error return for the routine)
this routine may be called to determine more information. It is
also used in some routines to pass back a secondary result.

Note: there is no guarantee as to the value returned from IoErr()
after a successful operation, unless to specified by the routine.

**RESULTS**

error - integer

**SEE ALSO**

[Fault](Fault.md), [PrintFault](PrintFault.md), [SetIoErr](SetIoErr.md)
