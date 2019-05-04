**NAME**

CBump -- increment user copper list pointer (bump to next position
in list).

**SYNOPSIS**

```c
    CBump( c )
          a1

    void CBump( struct UCopList * );

```
Links: [UCopList](_00AD) 

**FUNCTION**

Increment pointer to space for next instruction in user copper list.

**INPUTS**

c - pointer to [UCopList](_00AD) structure

**RESULTS**

User copper list pointer is incremented to next position.
Pointer is repositioned to next user copperlist instruction block
if the current block is full.

Note: CBump is usually invoked for the programmer as part of the
macro definitions [CWAIT](CWAIT) or [CMOVE](CMOVE).

BUGS

**SEE ALSO**

[CINIT](CINIT) [CWAIT](CWAIT) [CMOVE](CMOVE) [CEND](CEND) [graphics/copper.h](_00AD)
