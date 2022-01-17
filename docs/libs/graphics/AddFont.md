
**NAME**

AddFont -- add a font to the system list

**SYNOPSIS**

```c
    AddFont(textFont)
            A1

    void AddFont(struct TextFont *);

```
Links: [TextFont](_00A8.md) 

**FUNCTION**

This function adds the text font to the system, making it
available for use by any application.  The font added must be
in public memory, and remain until successfully removed.

**INPUTS**

textFont - a [TextFont](_00A8.md) structure in public ram.

RESULT

BUGS

**SEE ALSO**

[SetFont](SetFont.md)  [RemFont](RemFont.md)  [graphics/text.h](_00A8.md)
