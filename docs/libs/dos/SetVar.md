
**NAME**

SetVar -- Sets a local or environment variable (V36)

**SYNOPSIS**

```c
    success = SetVar( name, buffer, size, flags )
    D0                 D1     D2     D3    D4

    BOOL SetVar(STRPTR, STRPTR, LONG, ULONG )

```
**FUNCTION**

Sets a local or environment variable.  It is advised to only use
ASCII strings inside variables, but not required.

**INPUTS**

name   - pointer to an variable name.  Note variable names follow
filesystem syntax and semantics.
buffer - a user allocated area which contains a string that is the
value to be associated with this variable.
size   - length of the buffer region in bytes.  -1 means buffer
contains a null-terminated string.
flags  - combination of type of var to set (low 8 bits), and
flags to control the behavior of this routine.  Currently
defined flags include:

GVF_LOCAL_ONLY - set a local (to your process) variable.
GVF_GLOBAL_ONLY - set a global environment variable.

The default is to set a local environment variable.

RESULT
success - If non-zero, the variable was sucessfully set, FALSE
indicates failure.

BUGS
LV_VAR is the only type that can be global

**SEE ALSO**

[GetVar](GetVar), [DeleteVar](DeleteVar), [FindVar](FindVar), [&#060;dos/var.h&#062;](_0073)
