
**NAME**

CMOVE -- append copper move instruction to user copper list.

**SYNOPSIS**

```c
    CMOVE( c , a , v )

    CMove( c , a , v )
          a1  d0  d1
    CBump( c )
          a1

    void CMove( struct UCopList *, void *, WORD );

```
Links: [UCopList](_00AD) 

**FUNCTION**

Add instruction to move value v to hardware register a.

**INPUTS**

c - pointer to [UCopList](_00AD) structure
a - hardware register
v - 16 bit value to be written

**RESULTS**

This is actually a macro that calls CMove(c,&#038;a,v)
and then calls CBump(c) to bump the local pointer
to the next instruction. Watch out for macro side affects.

BUGS

**SEE ALSO**

[CINIT](CINIT) [CWAIT](CWAIT) [CEND](CEND) [graphics/copper.h](_00AD)
