
**NAME**

Input -- Identify the program's initial input file handle

**SYNOPSIS**

```c
    file = Input()
    D0

    BPTR Input(void)

```
**FUNCTION**

Input() is used to identify the initial input stream allocated when
the program was initiated.  Never close the filehandle returned by
Input!

**RESULTS**

file - BCPL pointer to a file handle

**SEE ALSO**

[Output](Output.md), [SelectInput](SelectInput.md)
