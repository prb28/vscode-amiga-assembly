
**NAME**

GetFileSysTask -- Returns the default filesystem for the process (V36)

**SYNOPSIS**

```c
    port = GetFileSysTask()
    D0

    struct MsgPort *GetFileSysTask(void)

```
Links: [MsgPort](_0099.md) 

**FUNCTION**

Returns the default filesystem task's port (pr_FileSystemTask) for the
current process.

RESULT
port - The pr_MsgPort of the filesystem, or NULL.

**SEE ALSO**

[SetFileSysTask](SetFileSysTask.md), [Open](Open.md)
