
**NAME**

Fault -- Returns the text associated with a DOS error code (V36)

**SYNOPSIS**

```c
    success = Fault(code, header, buffer, len)
    D0               D1     D2      D3    D4

    BOOL Fault(LONG, STRPTR, STRPTR, LONG)

```
**FUNCTION**

This routine obtains the error message text for the given error code.
The header is prepended to the text of the error message, followed
by a colon.  Puts a null-terminated string for the error message into
the buffer.  By convention, error messages should be no longer than 80
characters (+1 for termination), and preferably no more than 60.
The value returned by [IoErr](IoErr.md) is set to the code passed in.  If there
is no message for the error code, the message will be &#034;Error code
&#060;number&#062;n&#034;.

**INPUTS**

code   - Error code
header - header to output before error text
buffer - Buffer to receive error message.
len    - Length of the buffer.

RESULT
success - Success/failure code.

**SEE ALSO**

[IoErr](IoErr.md), [SetIoErr](SetIoErr.md), [PrintFault](PrintFault.md)
