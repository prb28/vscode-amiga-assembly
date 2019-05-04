
**NAME**

ReadLink -- Reads the path for a soft filesystem link (V36)

**SYNOPSIS**

```c
    success = ReadLink( port, lock, path, buffer, size)
    D0                   D1    D2    D3     D4     D5

    BOOL ReadLink( struct MsgPort *, BPTR, STRPTR, STRPTR, ULONG)

```
Links: [MsgPort](_0099) 

**FUNCTION**

ReadLink() takes a lock/name pair (usually from a failed attempt
to use them to access an object with packets), and asks the
filesystem to find the softlink and fill buffer with the modified
path string.  You then start the resolution process again by
calling [GetDeviceProc](GetDeviceProc) with the new string from ReadLink().

Soft-links are resolved at access time by a combination of the
filesystem (by returning ERROR_IS_SOFT_LINK to dos), and by
Dos (using ReadLink() to resolve any links that are hit).

**INPUTS**

port - msgport of the filesystem
lock - lock this path is relative to on the filesystem
path - path that caused the ERROR_IS_SOFT_LINK
buffer - pointer to buffer for new path from handler.
size - size of buffer.

RESULT
Success - boolean

BUGS
In V36, soft-links didn't work in the ROM filesystem.  This was
fixed for V37.

**SEE ALSO**

[MakeLink](MakeLink), [Open](Open), [Lock](Lock), [GetDeviceProc](GetDeviceProc)
