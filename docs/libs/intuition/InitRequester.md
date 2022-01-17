
**NAME**

InitRequester -- Initialize a [Requester](_00D4.md) structure.

**SYNOPSIS**

```c
    InitRequester( Requester )
                   A0

    VOID InitRequester( struct Requester * );

```
Links: [Requester](_00D4.md) [Requester](_00D4.md) 

**FUNCTION**

Initializes a requester for general use.  After calling InitRequester,
you need fill in only those [Requester](_00D4.md) values that fit your needs.
The other values are set to NULL--or zero--states.

Note that the example in the early versions of the Intuition
Reference Manual is flawed because the [Requester](_00D4.md) structure is
initialized BEFORE InitRequester is called.  Be sure to
perform your initialization AFTER calling InitRequester.

**INPUTS**

[Requester](_00D4.md) = a pointer to a [Requester](_00D4.md) structure

RESULT
None

BUGS
Since the publication of the first Intuition Manual to this
day, most people haven't used this function, and for
compatibility reasons, we'll never be able to assume that
they do.  Thus, this function is useless.

**SEE ALSO**

