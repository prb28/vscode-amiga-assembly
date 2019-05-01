
**NAME**

Draw -- Draw a line between the current pen position
and the new x,y position.

**SYNOPSIS**

```c
    Draw( rp,   x,     y)
         a1  d0:16  d1:16

    void Draw( struct RastPort *, SHORT, SHORT);

```
Links: [RastPort](_OOAF) 

**FUNCTION**

Draw a line from the current pen position to (x,y).

**INPUTS**


rp - pointer to the destination [RastPort](_OOAF)
x,y - coordinates of where in the [RastPort](_OOAF) to end the line.

BUGS

**SEE ALSO**

[Move](Move) [graphics/rastport.h](_OOAF)
