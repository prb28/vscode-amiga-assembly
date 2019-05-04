
**NAME**

SystemTagList -- Have a shell execute a command line (V36)

**SYNOPSIS**

```c
    error = SystemTagList(command, tags)
    D0                      D1      D2

    LONG SystemTagList(STRPTR, struct TagItem *)

    error = System(command, tags)
    D0               D1      D2

    LONG System(STRPTR, struct TagItem *)

    error = SystemTags(command, Tag1, ...)

    LONG SystemTags(STRPTR, ULONG, ...)

```
Links: [TagItem](_012E) [TagItem](_012E) 

**FUNCTION**

Similar to [Execute](Execute), but does not read commands from the input
filehandle.  Spawns a Shell process to execute the command, and
returns the returncode the command produced, or -1 if the command
could not be run for any reason.  The input and output filehandles
will not be closed by System, you must close them (if needed) after
System returns, if you specified them via SYS_INPUT or SYS_OUTPUT.

By default the new process will use your current [Input](Input) and [Output](Output)
filehandles.  Normal Shell command-line parsing will be done
including redirection on 'command'.  The current directory and path
will be inherited from your process.  Your path will be used to find
the command (if no path is specified).

If used with the SYS_Asynch flag, it WILL close both it's input and
output filehandles after running the command (even if these were
your [Input](Input) and Output()!)

Normally uses the boot (ROM) shell, but other shells can be specified
via SYS_UserShell and SYS_CustomShell.  Normally, you should send
things written by the user to the UserShell.  The UserShell defaults
to the same shell as the boot shell.

The tags are passed through to [CreateNewProc](CreateNewProc) (tags that conflict
with SystemTagList() will be filtered out).  This allows setting
things like priority, etc for the new process.

**INPUTS**

command - Program and arguments
tags    - see [&#060;dos/dostags.h&#062;](_006D).  Note that both SystemTagList()-
specific tags and tags from [CreateNewProc](CreateNewProc) may be passed.

RESULT
error   - 0 for success, result from command, or -1.  Note that on
error, the caller is responsible for any filehandles or other
things passed in via tags.

**SEE ALSO**

[Execute](Execute), [CreateNewProc](CreateNewProc), [&#060;dos/dostags.h&#062;](_006D), [Input](Input), [Output](Output)
