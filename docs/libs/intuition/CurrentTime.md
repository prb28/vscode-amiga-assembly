
**NAME**

CurrentTime -- Get the current time values.

**SYNOPSIS**

```c
    CurrentTime( Seconds, Micros )
                 A0       A1

    VOID CurrentTime( ULONG *, ULONG * );

```
**FUNCTION**

Puts copies of the current time into the supplied argument pointers.

This time value is not extremely accurate, nor is it of a very fine
resolution.  This time will be updated no more than sixty times a
a second, and will typically be updated far fewer times a second.

**INPUTS**

Seconds = pointer to a LONG variable to receive the current seconds
value
Micros = pointer to a LONG variable for the current microseconds value

RESULT
Puts the time values into the memory locations specified by the
arguments
Return value is not defined.

BUGS

**SEE ALSO**

[timer.device/TR_GETSYSTIME](_04FE)
