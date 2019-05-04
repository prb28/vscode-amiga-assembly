
**NAME**

CINIT -- Initialize user copperlist to accept intermediate
user copper instructions.

**SYNOPSIS**

```c
    cl = CINIT( ucl , n )

    cl = UCopperListInit( ucl , n )
                          a0    d0

    struct CopList *UCopperListInit( struct UCopList *, UWORD );

```
Links: [CopList](_00AD) [UCopList](_00AD) 

**FUNCTION**

Allocates and/or initialize copperlist structures/buffers
internal to a [UCopList](_00AD) structure.

This is a macro that calls UCopListInit. You must pass a
(non-initialized) [UCopList](_00AD) to CINIT (CINIT will NOT allocate
a new [UCopList](_00AD) if ucl==0 ). If (ucl != 0) it will initialize the
intermediate data buffers internal to a [UCopList](_00AD).

The maximum number of intermediate copper list instructions
that these internal [CopList](_00AD) data buffers contain is specified
as the parameter n.

**INPUTS**

ucl - pointer to [UCopList](_00AD) structure
n - number of instructions buffer must be able to hold

**RESULTS**

cl- a pointer to a buffer which will accept n intermediate copper
instructions.

NOTE: this is NOT a [UCopList](_00AD) pointer, rather a pointer to the
UCopList's-&#062;FirstCopList sub-structure.

BUGS
CINIT will not actually allocate a new [UCopList](_00AD) if ucl==0.
Instead you must allocate a block MEMF_PUBLIC|MEMF_CLEAR, the
sizeof(struct UCopList) and pass it to this function.

The system's [FreeVPortCopLists](FreeVPortCopLists) function will take care of
deallocating it if they are called.

Prior to release V36 the  CINIT macro had { } braces surrounding
the definition, preventing the proper return of the result value.
These braces have been removed for the V36 include definitions.

**SEE ALSO**

CINIT [CMOVE](CMOVE) [CEND](CEND) [graphics/copper.h](_00AD)
