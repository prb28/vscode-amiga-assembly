
**NAME**

AddFont -- add a font to the system list

**SYNOPSIS**

```c
    AddFont(textFont)
            A1

    void AddFont(struct TextFont *);

```
Links: [TextFont](_OOAX) 

**FUNCTION**

This function adds the text font to the system, making it
available for use by any application.  The font added must be
in public memory, and remain until successfully removed.

**INPUTS**

textFont - a [TextFont](_OOAX) structure in public ram.

RESULT

BUGS

**SEE ALSO**

[SetFont](SetFont)  [RemFont](RemFont)  [graphics/text.h](_OOAX)
