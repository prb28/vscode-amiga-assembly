
**NAME**

GetConsoleTask -- Returns the default console for the process (V36)

**SYNOPSIS**

```c
    port = GetConsoleTask()
    D0

    struct MsgPort *GetConsoleTask(void)

```
Links: [MsgPort](_0099) 

**FUNCTION**

Returns the default console task's port (pr_ConsoleTask) for the
current process.

RESULT
port - The pr_MsgPort of the console handler, or NULL.

**SEE ALSO**

[SetConsoleTask](SetConsoleTask), [Open](Open)
