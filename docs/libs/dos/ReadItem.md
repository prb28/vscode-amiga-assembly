
**NAME**

ReadItem - reads a single argument/name from command line (V36)

**SYNOPSIS**

```c
    value = ReadItem(buffer, maxchars, input)
    D0                D1        D2      D3

    LONG ReadItem(STRPTR, LONG, struct CSource *)

```
Links: [CSource](_0076.md) 

**FUNCTION**

Reads a &#034;word&#034; from either [Input](Input.md) (buffered), or via [CSource](_0076.md), if it
is non-NULL (see [&#060;dos/rdargs.h&#062;](_0076.md) for more information).  Handles
quoting and some '*' substitutions (*e and *n) inside quotes (only).
See [dos/dos.h](_0068.md) for a listing of values returned by ReadItem()
(ITEM_XXXX).  A &#034;word&#034; is delimited by whitespace, quotes, or an EOF.

ReadItem always unreads the last thing read (UnGetC(fh,-1)) so the
caller can find out what the terminator was.

**INPUTS**

buffer   - buffer to store word in.
maxchars - size of the buffer
input    - [CSource](_0076.md) input or NULL (uses FGetC(Input()))

RESULT
value - See [&#060;dos/dos.h&#062;](_0068.md) for return values.

**SEE ALSO**

[ReadArgs](ReadArgs.md), [FindArg](FindArg.md), [UnGetC](UnGetC.md), [FGetC](FGetC.md), [Input](Input.md), [&#060;dos/dos.h&#062;](_0068.md),
[&#060;dos/rdargs.h&#062;](_0076.md), [FreeArgs](FreeArgs.md)
