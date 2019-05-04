
**NAME**

StartNotify -- Starts notification on a file or directory (V36)

**SYNOPSIS**

```c
    success = StartNotify(notifystructure)
    D0                          D1

    BOOL StartNotify(struct NotifyRequest *)

```
Links: [NotifyRequest](_006E) 

**FUNCTION**

Posts a notification request.  Do not modify the notify structure while
it is active.  You will be notified when the file or directory changes.
For files, you will be notified after the file is closed.  Not all
filesystems will support this: applications should NOT require it.  In
particular, most network filesystems won't support it.

**INPUTS**

notifystructure - A filled-in [NotifyRequest](_006E) structure

RESULT
success - Success/failure of request

BUGS
The V36 floppy/HD filesystem doesn't actually send notifications.  The
V36 ram handler (ram:) does.  This has been fixed for V37.

**SEE ALSO**

[EndNotify](EndNotify), [&#060;dos/notify.h&#062;](_006E)
