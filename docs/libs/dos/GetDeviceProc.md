
**NAME**

GetDeviceProc -- Finds a handler to send a message to (V36)

**SYNOPSIS**

```c
    devproc = GetDeviceProc(name, devproc)
      D0                     D1     D2

    struct DevProc *GetDeviceProc(STRPTR, struct DevProc *)

```
Links: [DevProc](_0078.md) [DevProc](_0078.md) 

**FUNCTION**

Finds the handler/filesystem to send packets regarding 'name' to.
This may involve getting temporary locks.  It returns a structure
that includes a lock and msgport to send to to attempt your operation.
It also includes information on how to handle multiple-directory
assigns (by passing the [DevProc](_0078.md) back to GetDeviceProc() until it
returns NULL).

The initial call to GetDeviceProc() should pass NULL for devproc.  If
after using the returned [DevProc](_0078.md), you get an ERROR_OBJECT_NOT_FOUND,
and (devproc-&#062;dvp_Flags &#038; DVPF_ASSIGN) is true, you should call
GetDeviceProc() again, passing it the devproc structure.  It will
either return a modified devproc structure, or NULL (with
ERROR_NO_MORE_ENTRIES in IoErr()).  Continue until it returns NULL.

This call also increments the counter that locks a handler/fs into
memory.  After calling [FreeDeviceProc](FreeDeviceProc.md), do not use the port or lock
again!

**INPUTS**

name    - name of the object you wish to access.  This can be a
relative path (&#034;foo/bar&#034;), relative to the current volume
(&#034;:foo/bar&#034;), or relative to a device/volume/assign
(&#034;foo:bar&#034;).
devproc - A value returned by GetDeviceProc() before, or NULL

RESULT
devproc - a pointer to a [DevProc](_0078.md) structure or NULL

BUGS
Counter not currently active in 2.0.
In 2.0 and 2.01, you HAD to check DVPF_ASSIGN before calling it again.
This was fixed for the 2.02 release of V36.

**SEE ALSO**

[FreeDeviceProc](FreeDeviceProc.md), [DeviceProc](DeviceProc.md), [AssignLock](AssignLock.md), [AssignLate](AssignLate.md),
[AssignPath](AssignPath.md)
