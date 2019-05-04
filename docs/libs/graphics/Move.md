
**NAME**

Move -- Move graphics pen position.

**SYNOPSIS**

```c
    Move( rp,   x,    y)
          a1  d0:16 d1:16

    void Move( struct RastPort *, SHORT, SHORT );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Move graphics pen position to (x,y) relative to upper left (0,0)
of [RastPort](_00AF). This sets the starting point for subsequent [Draw](Draw)
and [Text](Text) calls.

**INPUTS**

rp - pointer to a [RastPort](_00AF) structure
x,y - point in the [RastPort](_00AF)

**RESULTS**


BUGS

**SEE ALSO**

Draw [graphics/rastport.h](_00AF)
