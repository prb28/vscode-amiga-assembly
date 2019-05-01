
**NAME**

Output -- Identify the programs' initial output file handle

**SYNOPSIS**

```c
    file = Output()
    D0

    BPTR Output(void)

```
**FUNCTION**

Output() is used to identify the initial output stream allocated
when the program was initiated.  Never close the filehandle returned
by Output().

**RESULTS**

file - BCPL pointer to a file handle

**SEE ALSO**

[Input](Input)
