
**NAME**

PolyDraw -- Draw lines from table of (x,y) values.

**SYNOPSIS**

```c
    PolyDraw( rp, count , array )
              a1   d0      a0

    void PolyDraw( struct RastPort *, WORD, WORD * );

```
Links: [RastPort](_00AF) 

**FUNCTION**

starting with the first pair in the array, draw connected lines to
it and every successive pair.

**INPUTS**

rp - pointer to [RastPort](_00AF) structure
count -  number of (x,y) pairs in the array
array - pointer to first (x,y) pair

BUGS

**SEE ALSO**

[Draw](Draw) [Move](Move) [graphics/rastport.h](_00AF)
