
**NAME**

MakeLink -- Creates a filesystem link (V36)

**SYNOPSIS**

```c
    success = MakeLink( name, dest, soft )
    D0                   D1    D2    D3

    BOOL MakeLink( STRPTR, LONG, LONG )

```
**FUNCTION**

Create a filesystem link from 'name' to dest.  For &#034;soft-links&#034;,
dest is a pointer to a null-terminated path string.  For &#034;hard-
links&#034;, dest is a lock (BPTR).  'soft' is FALSE for hard-links,
non-zero otherwise.

Soft-links are resolved at access time by a combination of the
filesystem (by returning ERROR_IS_SOFT_LINK to dos), and by
Dos (using [ReadLink](ReadLink) to resolve any links that are hit).

Hard-links are resolved by the filesystem in question.  A series
of hard-links to a file are all equivalent to the file itself.
If one of the links (or the original entry for the file) is
deleted, the data remains until there are no links left.

**INPUTS**

name - Name of the link to create
dest - CPTR to path string, or BPTR lock
soft - FALSE for hard-links, non-zero for soft-links

RESULT
Success - boolean

BUGS
In V36, soft-links didn't work in the ROM filesystem.  This was
fixed for V37.

**SEE ALSO**

[ReadLink](ReadLink), [Open](Open), [Lock](Lock)
