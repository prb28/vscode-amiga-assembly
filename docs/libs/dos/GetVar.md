
**NAME**

GetVar -- Returns the value of a local or global variable (V36)

**SYNOPSIS**

```c
    len = GetVar( name, buffer, size, flags )
    D0             D1     D2     D3    D4

    LONG GetVar( STRPTR, STRPTR, LONG, ULONG )

```
**FUNCTION**

Gets the value of a local or environment variable.  It is advised to
only use ASCII strings inside variables, but not required.  This stops
putting characters into the destination when a n is hit, unless
GVF_BINARY_VAR is specified.  (The n is not stored in the buffer.)

**INPUTS**

name   - pointer to a variable name.
buffer - a user allocated area which will be used to store
the value associated with the variable.
size   - length of the buffer region in bytes.
flags  - combination of type of var to get value of (low 8 bits), and
flags to control the behavior of this routine.  Currently
defined flags include:

GVF_GLOBAL_ONLY - tries to get a global env variable.
GVF_LOCAL_ONLY  - tries to get a local variable.
GVF_BINARY_VAR  - don't stop at n

The default is to try to get a local variable first, then
to try to get a global environment variable.

RESULT
len -   Size of environment variable.  -1 indicates that the
variable was not defined (if [IoErr](IoErr) returns
ERROR_OBJECT_NOT_FOUND - it returns ERROR_BAD_NUMBER if
you specify a size of 0).  If the value would overflow
the user buffer, the buffer is truncated.  The buffer
returned is null-terminated (even if GVF_BINARY_VAR is
used).  The number of characters put in the buffer (not
including '0') is returned, and [IoErr](IoErr) will return the
the size of the variable.

BUGS
LV_VAR is the only type that can be global.
Under V36, we documented (and it returned) the size of the variable,
not the number of characters transferred.  For V37 this was changed
to the number of characters put in the buffer, and the total size
of the variable is put in [IoErr](IoErr).

**SEE ALSO**

[SetVar](SetVar), [DeleteVar](DeleteVar), [FindVar](FindVar), [&#060;dos/var.h&#062;](_0073)
