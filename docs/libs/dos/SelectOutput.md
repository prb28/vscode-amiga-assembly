
**NAME**

SelectOutput -- Select a filehandle as the default input channel (V36)

**SYNOPSIS**

```c
    old_fh = SelectOutput(fh)
    D0                    D1

    BPTR SelectOutput(BPTR)

```
**FUNCTION**

Set the current output as the default output for the process.
This changes the value returned by [Output](Output.md).  old_fh should
be closed or saved as needed.

**INPUTS**

fh     - Newly desired output handle

RESULT
old_fh - Previous current output

**SEE ALSO**

[Output](Output.md), [SelectInput](SelectInput.md), [Input](Input.md)
