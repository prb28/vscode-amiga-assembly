
**NAME**

CWAIT -- Append copper wait instruction to user copper list.

**SYNOPSIS**

```c
    CWAIT( c , v , h )

    CWait( c , v , h )
           a1  d0  d1
    CBump( c )
          a1

    void CWait( struct UCopList *, WORD, WORD)

```
Links: [UCopList](_00AD) 

**FUNCTION**

Add instruction to wait for vertical beam position v and
horizontal position h to this intermediate copper list.

**INPUTS**

c - pointer to [UCopList](_00AD) structure
v - vertical beam position (relative to top of viewport)
h - horizontal beam position

**RESULTS**

this is actually a macro that calls CWait(c,v,h)
and then calls CBump(c) to bump the local pointer
to the next instruction.

BUGS
User waiting for horizontal values of greater than 222 decimal
is illegal.

**SEE ALSO**

[CINIT](CINIT) [CMOVE](CMOVE) [CEND](CEND) [graphics/copper.h](_00AD)
