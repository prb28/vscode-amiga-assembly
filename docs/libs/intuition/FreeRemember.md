
**NAME**

FreeRemember -- Free memory allocated by calls to [AllocRemember](AllocRemember.md).

**SYNOPSIS**

```c
    FreeRemember( RememberKey, ReallyForget )
                  A0           D0

    VOID FreeRemember( struct Remember **, BOOL );

```
Links: [Remember](_00D4.md) 

**FUNCTION**

This function frees up memory allocated by the [AllocRemember](AllocRemember.md)
function.  It will either free up just the [Remember](_00D4.md) structures, which
supply the link nodes that tie your allocations together, or it will
deallocate both the link nodes AND your memory buffers too.

If you want to deallocate just the [Remember](_00D4.md) structure link nodes,
you should set the ReallyForget argument to FALSE.  However, if you
want FreeRemember to really deallocate all the memory, including
both the [Remember](_00D4.md) structure link nodes and the buffers you requested
via earlier calls to [AllocRemember](AllocRemember.md), then you should set the
ReallyForget argument to TRUE.

NOTE WELL: Once you call this function passing it FALSE, the
linkages between all the memory chunks are lost, and you
cannot subsequently use FreeRemember() to free them.

**INPUTS**

RememberKey = the address of a pointer to struct [Remember](_00D4.md).  This
pointer should either be NULL or set to some value (possibly
NULL) by a call to [AllocRemember](AllocRemember.md).
ReallyForget = a BOOL FALSE or TRUE describing, respectively,
whether you want to free up only the [Remember](_00D4.md) nodes or
if you want this procedure to really forget about all of
the memory, including both the nodes and the memory buffers
referenced by the nodes.

EXAMPLE
struct [Remember](_00D4.md) *RememberKey;
RememberKey = NULL;
AllocRemember(&#038;RememberKey, BUFSIZE, MEMF_CHIP);
FreeRemember(&#038;RememberKey, TRUE);

RESULT
None

BUGS

**SEE ALSO**

[AllocRemember](AllocRemember.md), [exec.library/FreeMem](../exec/FreeMem.md)
