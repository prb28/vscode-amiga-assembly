
**NAME**

SetExcept -- define certain signals to cause exceptions

**SYNOPSIS**

```c
    oldSignals = SetExcept(newSignals, signalMask)
    D0                     D0          D1

    ULONG SetExcept(ULONG,ULONG);

```
**FUNCTION**

This function defines which of the task's signals will cause a
private task exception.  When any of the signals occurs the task's
exception handler will be dispatched.  If the signal occurred prior
to calling SetExcept, the exception will happen immediately.

The user function pointed to by the task's tc_ExceptCode gets
called as:

newExcptSet = &#060;exceptCode&#062;(signals, exceptData),SysBase
D0                         D0       A1          A6

signals - The set of signals that caused this exception.  These
Signals have been disabled from the current set of signals
that can cause an exception.

exceptData - A copy of the task structure tc_ExceptData field.

newExcptSet - The set of signals in NewExceptSet will be re-
enabled for exception generation.  Usually this will be the
same as the Signals that caused the exception.

**INPUTS**

newSignals - the new values for the signals specified in
signalMask.
signalMask - the set of signals to be effected

**RESULTS**

oldSignals - the prior exception signals

EXAMPLE
Get the current state of all exception signals:
SetExcept(0,0)
Change a few exception signals:
SetExcept($1374,$1074)

**SEE ALSO**

[Signal](Signal.md), [SetSignal](SetSignal.md)
