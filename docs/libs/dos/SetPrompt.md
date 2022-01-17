
**NAME**

SetPrompt -- Sets the CLI/shell prompt for the current process (V36)

**SYNOPSIS**

```c
    success = SetPrompt(name)
    D0                D1

    BOOL SetPrompt(STRPTR)

```
**FUNCTION**

Sets the text for the prompt in the cli structure.  If the prompt is
too long to fit, a failure is returned, and the old value is left
intact.  It is advised that you inform the user of this condition.
This routine is safe to call even if there is no CLI structure.

**INPUTS**

name    - Name of prompt to be set.

RESULT
success - Success/failure indicator.

BUGS
This clips to a fixed (1.3 compatible) size.

**SEE ALSO**

[GetPrompt](GetPrompt.md)
