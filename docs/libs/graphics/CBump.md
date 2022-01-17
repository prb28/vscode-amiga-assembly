**NAME**

CBump -- increment user copper list pointer (bump to next position
in list).

**SYNOPSIS**

```c
    CBump( c )
          a1

    void CBump( struct UCopList * );

```
Links: [UCopList](_00AD.md) 

**FUNCTION**

Increment pointer to space for next instruction in user copper list.

**INPUTS**

c - pointer to [UCopList](_00AD.md) structure

**RESULTS**

User copper list pointer is incremented to next position.
Pointer is repositioned to next user copperlist instruction block
if the current block is full.

Note: CBump is usually invoked for the programmer as part of the
macro definitions [CWAIT](CWAIT.md) or [CMOVE](CMOVE.md).

BUGS

**SEE ALSO**

[CINIT](CINIT.md) [CWAIT](CWAIT.md) [CMOVE](CMOVE.md) [CEND](CEND.md) [graphics/copper.h](_00AD.md)
