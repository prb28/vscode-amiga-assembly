
**NAME**

Format -- Causes a filesystem to initialize itself (V36)

**SYNOPSIS**

```c
    success = Format(filesystem, volumename, dostype)
    D0                   D1          D2         D3

    BOOL Format(STRPTR, STRPTR, ULONG)

```
**FUNCTION**

Interface for initializing new media on a device.  This causes the
filesystem to write out an empty disk structure to the media, which
should then be ready for use.  This assumes the media has been low-
level formatted and verified already.

The filesystem should be inhibited before calling Format() to make
sure you don't get an ERROR_OBJECT_IN_USE.

**INPUTS**

filesystem - Name of device to be formatted.  ':' must be supplied.
volumename - Name for volume (if supported).  No ':'.
dostype    - Type of format, if filesystem supports multiple types.

RESULT
success - Success/failure indicator.

BUGS
Existed, but was non-functional in V36 dos.  (The volumename wasn't
converted to a BSTR.)  Workaround: require V37, or under V36
convert volumename to a BPTR to a BSTR before calling Format().
Note: a number of printed packet docs for ACTION_FORMAT are wrong
as to the arguments.

**SEE ALSO**

