
**NAME**

SetConsoleTask -- Sets the default console for the process (V36)

**SYNOPSIS**

```c
    oldport = SetConsoleTask(port)
    D0                        D1

    struct MsgPort *SetConsoleTask(struct MsgPort *)

```
Links: [MsgPort](_0099) [MsgPort](_0099) 

**FUNCTION**

Sets the default console task's port (pr_ConsoleTask) for the
current process.

**INPUTS**

port - The pr_MsgPort of the default console handler for the process

RESULT
oldport - The previous ConsoleTask value.

**SEE ALSO**

[GetConsoleTask](GetConsoleTask), [Open](Open)
