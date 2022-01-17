
**NAME**

Read -- Read bytes of data from a file

**SYNOPSIS**

```c
    actualLength = Read( file, buffer, length )
    D0                   D1    D2      D3

    LONG Read(BPTR, void *, LONG)

```
**FUNCTION**

Data can be copied using a combination of Read() and [Write](Write.md).
Read() reads bytes of information from an opened file (represented
here by the argument 'file') into the buffer given. The argument
'length' is the length of the buffer given.

The value returned is the length of the information actually read.
So, when 'actualLength' is greater than zero, the value of
'actualLength' is the the number of characters read. Usually Read
will try to fill up your buffer before returning. A value of zero
means that end-of-file has been reached. Errors are indicated by a
value of -1.

Note: this is an unbuffered routine (the request is passed directly
to the filesystem.)  Buffered I/O is more efficient for small
reads and writes; see [FGetC](FGetC.md).

**INPUTS**

file - BCPL pointer to a file handle
buffer - pointer to buffer
length - integer

**RESULTS**

actualLength - integer

**SEE ALSO**

[Open](Open.md), [Close](Close.md), [Write](Write.md), [Seek](Seek.md), [FGetC](FGetC.md)
