
**NAME**

Alert -- alert the user of an error

**SYNOPSIS**

```c
    Alert(alertNum)
          D7

    void Alert(ULONG);

```
**FUNCTION**

Alerts the user of a serious system problem.  This function will
bring the system to a grinding halt, and do whatever is necessary
to present the user with a message stating what happened.
Interrupts are disabled, and an attempt to post the alert is made.
If that fails, the system is reset.  When the system comes up
again, Exec notices the cause of the failure and tries again to
post the alert.

If the Alert is a recoverable type, this call MAY return.

This call may be made at any time, including interrupts.

POST-MORTEM DIAGNOSIS
There are several options for determining the cause of a crash.
Descriptions of each alert number can be found in the &#034;alerts.h&#034;
include file.  Low numbers not mentioned in the include file
represent 68000 exceptions, see a 68000 manual for details.  The
most common numbers are:
$00000003 - Address Error
$00000004 - Illegal Instruction

A remote terminal can be attached to the Amiga's first built-in
serial port.  Set the communication parameters to 9600 baud, 8 bits,
no parity.  Before resetting the machine, the Alert function will
blink the power LED 10 times.  While the power indicator is flashing,
pressing DELETE on the remote terminal will invoke the ROMWack
debugger.

For Alerts caused by a 68000 exception, all registers are copied
to a magic low memory location (currently 16 longwords at $180).

INPUT
alertNum   - a number indicating the particular alert.  -1 is
not a valid input.

NOTE
Much more needs to be said about this function and its implications.

**SEE ALSO**

[exec/alerts.h](_007F.md)
