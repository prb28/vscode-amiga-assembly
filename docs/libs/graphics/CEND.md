
**NAME**

CEND -- Terminate user copper list.

**SYNOPSIS**

```c
    CEND( c )

    struct UCopList *c;

```
Links: [UCopList](_00AD) 

**FUNCTION**

Add instruction to terminate user copper list.

**INPUTS**

c - pointer to [UCopList](_00AD) structure

**RESULTS**

This is actually a macro that calls the macro CWAIT(c,10000,255)
10000 is a magical number that the graphics.library uses.
I hope display technology doesn't catch up too fast!

BUGS

**SEE ALSO**

[CINIT](CINIT) [CWAIT](CWAIT) [CMOVE](CMOVE) [graphics/copper.h](_00AD)
