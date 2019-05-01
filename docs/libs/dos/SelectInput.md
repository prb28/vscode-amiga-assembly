
**NAME**

SelectInput -- Select a filehandle as the default input channel (V36)

**SYNOPSIS**

```c
    old_fh = SelectInput(fh)
    D0                   D1

    BPTR SelectInput(BPTR)

```
**FUNCTION**

Set the current input as the default input for the process.
This changes the value returned by [Input](Input).  old_fh should
be closed or saved as needed.

**INPUTS**

fh     - Newly default input handle

RESULT
old_fh - Previous default input filehandle

**SEE ALSO**

[Input](Input), [SelectOutput](SelectOutput), [Output](Output)
