
**NAME**

FPutC -- Write a character to the specified output (buffered) (V36)

**SYNOPSIS**

```c
    char = FPutC(fh, char)
    D0           D1   D2

    LONG FPutC(BPTR, UBYTE)

```
**FUNCTION**

Writes a single character to the output stream.  This call is
buffered.  Use [Flush](Flush) between buffered and unbuffered I/O on a
filehandle.  Interactive filehandles are flushed automatically
on a newline, return, '0', or line feed.

**INPUTS**

fh   - filehandle to use for buffered I/O
char - character to write

RESULT
char - either the character written, or EOF for an error.

**SEE ALSO**

[FGetC](FGetC), [UnGetC](UnGetC), [Flush](Flush)
