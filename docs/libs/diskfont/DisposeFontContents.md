
**NAME**

DisposeFontContents -- Free the result from [NewFontContents](NewFontContents). (V34)

**SYNOPSIS**

```c
     DisposeFontContents(fontContentsHeader)
                         A1

     VOID DisposeFontContents( struct FontContentsHeader * );

```
Links: [FontContentsHeader](_0102) 

**FUNCTION**

This function frees the array of [FontContents](_0102) entries
returned by [NewFontContents](NewFontContents).

**INPUTS**

fontContentsHeader - a struct [FontContentsHeader](_0102) pointer
returned by [NewFontContents](NewFontContents).

EXCEPTIONS
This command was first made available as of version 34.

A fontContentsHeader other than one acquired by a call
[NewFontContents](NewFontContents) will crash.

**SEE ALSO**

[NewFontContents](NewFontContents) to get structure freed here.
