
**NAME**

Open -- Open a file for input or output

**SYNOPSIS**

```c
    file = Open( name, accessMode )
    D0           D1    D2

    BPTR Open(STRPTR, LONG)

```
**FUNCTION**

The named file is opened and a file handle returned.  If the
accessMode is MODE_OLDFILE, an existing file is opened for reading
or writing. If the value is MODE_NEWFILE, a new file is created for
writing. MODE_READWRITE opens a file with an shared lock, but
creates it if it didn't exist.  Open types are documented in the
[&#060;dos/dos.h&#062;](_0068) or [&#060;libraries/dos.h&#062;](_0108) include file.

The 'name' can be a filename (optionally prefaced by a device
name), a simple device such as NIL:, a window specification such as
CON: or RAW: followed by window parameters, or &#034;*&#034;, representing the
current window.  Note that as of V36, &#034;*&#034; is obsolete, and CONSOLE:
should be used instead.

If the file cannot be opened for any reason, the value returned
will be zero, and a secondary error code will be available by
calling the routine [IoErr](IoErr).

**INPUTS**

name       - pointer to a null-terminated string
accessMode - integer

**RESULTS**

file - BCPL pointer to a file handle

**SEE ALSO**

[Close](Close), [ChangeMode](ChangeMode), [NameFromFH](NameFromFH), [ParentOfFH](ParentOfFH), [ExamineFH](ExamineFH)
