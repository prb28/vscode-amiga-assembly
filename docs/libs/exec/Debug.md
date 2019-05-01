
**NAME**

Debug -- run the system debugger

**SYNOPSIS**

```c
    Debug(flags)
          D0

    void Debug(ULONG);

```
**FUNCTION**

This function calls the system debugger.  By default this debugger
is &#034;ROM-WACK&#034;.  Other debuggers are encouraged to take over this
entry point (via [SetFunction](SetFunction)) so that when an application calls
Debug(), the alternative debugger will get control.  Currently a
zero is passed to allow future expansion.

NOTE
The Debug() call may be made when the system is in a questionable
state; if you have a [SetFunction](SetFunction) patch, make few assumptions, be
prepared for [Supervisor](Supervisor) mode, and be aware of differences in the
Motorola stack frames on the 68000,'10,'20, and '30.

**SEE ALSO**

[SetFunction](SetFunction)
your favorite debugger's manual
the ROM-WACK chapter of the ROM Kernel Manual
