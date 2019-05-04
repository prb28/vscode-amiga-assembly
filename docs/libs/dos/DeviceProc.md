
**NAME**

DeviceProc -- Return the process [MsgPort](_0099) of specific I/O handler

**SYNOPSIS**

```c
    process = DeviceProc( name )
    D0                    D1

    struct MsgPort *DeviceProc (STRPTR)

```
Links: [MsgPort](_0099) 

**FUNCTION**

DeviceProc() returns the process identifier of the process which
handles the device associated with the specified name. If no
process handler can be found then the result is zero. If the name
refers to an assign then a directory lock is returned in [IoErr](IoErr).
This lock should not be UnLock()ed or Examine()ed (if you wish to do
so, [DupLock](DupLock) it first).

BUGS
In V36, if you try to DeviceProc() something relative to an assign
made with [AssignPath](AssignPath), it will fail.  This is because there's no
way to know when to unlock the lock.  If you're writing code for
V36 or later, it is highly advised you use [GetDeviceProc](GetDeviceProc) instead,
or make your code conditional on V36 to use GetDeviceProc()/
[FreeDeviceProc](FreeDeviceProc).

**SEE ALSO**

[GetDeviceProc](GetDeviceProc), [FreeDeviceProc](FreeDeviceProc), [DupLock](DupLock), [UnLock](UnLock), [Examine](Examine)
