
**NAME**

SetFileSize -- Sets the size of a file (V36)

**SYNOPSIS**

```c
    newsize = SetFileSize(fh, offset, mode)
    D0                    D1    D2     D3

    LONG SetFileSize(BPTR, LONG, LONG)

```
**FUNCTION**

Changes the file size, truncating or extending as needed.  Not all
handlers may support this; be careful and check the return code.  If
the file is extended, no values should be assumed for the new bytes.
If the new position would be before the filehandle's current position
in the file, the filehandle will end with a position at the
end-of-file.  If there are other filehandles open onto the file, the
new size will not leave any filehandle pointing past the end-of-file.
You can check for this by looking at the new size.

Do NOT count on any specific values to be in the extended area.

**INPUTS**

fh     - File to be truncated/extended.
offset - Offset from position determined by mode.
mode   - One of OFFSET_BEGINNING, OFFSET_CURRENT, or OFFSET_END.

RESULT
newsize - position of new end-of-file or -1 for error.

**SEE ALSO**

[Seek](Seek)
