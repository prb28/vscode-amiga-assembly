
**NAME**

DisposeFontContents -- Free the result from [NewFontContents](NewFontContents.md). (V34)

**SYNOPSIS**

```c
     DisposeFontContents(fontContentsHeader)
                         A1

     VOID DisposeFontContents( struct FontContentsHeader * );

```
Links: [FontContentsHeader](_0102.md) 

**FUNCTION**

This function frees the array of [FontContents](_0102.md) entries
returned by [NewFontContents](NewFontContents.md).

**INPUTS**

fontContentsHeader - a struct [FontContentsHeader](_0102.md) pointer
returned by [NewFontContents](NewFontContents.md).

EXCEPTIONS
This command was first made available as of version 34.

A fontContentsHeader other than one acquired by a call
[NewFontContents](NewFontContents.md) will crash.

**SEE ALSO**

[NewFontContents](NewFontContents.md) to get structure freed here.
