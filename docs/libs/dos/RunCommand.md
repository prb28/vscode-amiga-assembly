
**NAME**

RunCommand -- Runs a program using the current process (V36)

**SYNOPSIS**

```c
    rc = RunCommand(seglist, stacksize, argptr, argsize)
    D0                D1         D2       D3      D4

    LONG RunCommand(BPTR, ULONG, STRPTR, ULONG)

```
**FUNCTION**

Runs a command on your process/cli.  Seglist may be any language,
including BCPL programs.  Stacksize is in bytes.  argptr is a null-
terminated string, argsize is its length.  Returns the returncode the
program exited with in d0. Returns -1 if the stack couldn't be
allocated.

NOTE: the argument string MUST be terminated with a newline to work
properly with [ReadArgs](ReadArgs) and other argument parsers.

RunCommand also takes care of setting up the current input filehandle
in such a way that [ReadArgs](ReadArgs) can be used in the program, and restores
the state of the buffering before returning.  It also sets the value
returned by [GetArgStr](GetArgStr), and restores it before returning.  NOTE:
the setting of the argument string in the filehandle was added in V37.

It's usually appropriate to set the command name (via
[SetProgramName](SetProgramName)) before calling RunCommand().  RunCommand() sets
the value returned by [GetArgStr](GetArgStr) while the command is running.

**INPUTS**

seglist   - Seglist of command to run.
stacksize - Number of bytes to allocate for stack space
argptr    - Pointer to argument command string.
argsize   - Number of bytes in argument command.

RESULT
rc        - Return code from executed command. -1 indicates failure

**SEE ALSO**

[CreateNewProc](CreateNewProc), [SystemTagList](SystemTagList), [Execute](Execute), [GetArgStr](GetArgStr),
[SetProgramName](SetProgramName), [ReadArgs](ReadArgs)
