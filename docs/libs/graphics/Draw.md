
**NAME**

Draw -- Draw a line between the current pen position
and the new x,y position.

**SYNOPSIS**

```c
    Draw( rp,   x,     y)
         a1  d0:16  d1:16

    void Draw( struct RastPort *, SHORT, SHORT);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Draw a line from the current pen position to (x,y).

**INPUTS**


rp - pointer to the destination [RastPort](_00AF.md)
x,y - coordinates of where in the [RastPort](_00AF.md) to end the line.

BUGS

**SEE ALSO**

[Move](Move.md) [graphics/rastport.h](_00AF.md)
