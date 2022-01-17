
**NAME**

DoubleClick -- Test two time values for double-click timing.

**SYNOPSIS**

```c
    IsDouble = DoubleClick( StartSecs, StartMicros,
    D0                      D0         D1
            CurrentSecs, CurrentMicros )
            D2           D3

    BOOL DoubleClick( ULONG, ULONG, ULONG, ULONG );

```
**FUNCTION**

Compares the difference in the time values with the double-click
timeout range that the user has set (using the &#034;Preferences&#034; tool) or
some other program has configured into the system.  If the
difference between the specified time values is within the current
double-click time range, this function returns TRUE, else it
returns FALSE.

These time values can be found in input events and IDCMP messages.
The time values are not perfect; however, they are precise enough for
nearly all applications.

**INPUTS**

StartSeconds, StartMicros = the timestamp value describing the start of
the double-click time period you are considering
CurrentSeconds, CurrentMicros = the timestamp value describing
the end of the double-click time period you are considering

RESULT
If the difference between the supplied timestamp values is within the
double-click time range in the current set of [Preferences](_00D5.md), this
function returns TRUE, else it returns FALSE

BUGS

**SEE ALSO**

[CurrentTime](CurrentTime.md)
