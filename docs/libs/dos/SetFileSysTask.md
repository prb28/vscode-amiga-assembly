
**NAME**

SetFileSysTask -- Sets the default filesystem for the process (V36)

**SYNOPSIS**

```c
    oldport = SetFileSysTask(port)
    D0                        D1

    struct MsgPort *SetFileSysTask(struct MsgPort *)

```
Links: [MsgPort](_0099.md) [MsgPort](_0099.md) 

**FUNCTION**

Sets the default filesystem task's port (pr_FileSystemTask) for the
current process.

**INPUTS**

port - The pr_MsgPort of the default filesystem for the process

RESULT
oldport - The previous FileSysTask value

**SEE ALSO**

[GetFileSysTask](GetFileSysTask.md), [Open](Open.md)
