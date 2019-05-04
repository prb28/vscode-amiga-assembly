
**NAME**

RemFont -- Remove a font from the system list.

**SYNOPSIS**

```c
    RemFont(textFont)
            A1

    void RemFont(struct TextFont *);

```
Links: [TextFont](_00A8) 

**FUNCTION**

This function removes a font from the system, ensuring that
access to it is restricted to those applications that
currently have an active pointer to it: i.e. no new [SetFont](SetFont)
requests to this font are satisfied.

**INPUTS**

textFont - the [TextFont](_00A8) structure to remove.

RESULT

BUGS

**SEE ALSO**

[SetFont](SetFont)  [AddFont](AddFont)  [graphics/text.h](_00A8)
