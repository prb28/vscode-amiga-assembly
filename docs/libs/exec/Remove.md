
**NAME**

Remove -- remove a node from a list

**SYNOPSIS**

```c
    Remove(node)
           A1

    void Remove(struct Node *);

```
Links: [Node](_0091) 

**FUNCTION**

Unlink a node from whatever list it is in.  Nodes that are not part
of a list must not be passed to this funcion!  Assembly programmers
may prefer to use the REMOVE macro from &#034;exec/lists.i&#034;.

**WARNING**

This function does not arbitrate for access to the list.  The
calling task must be the owner of the involved list.

**INPUTS**

node - the node to remove

**SEE ALSO**

[AddHead](AddHead), [AddTail](AddTail), [Enqueue](Enqueue), Insert, [RemHead](RemHead), [RemTail](RemTail)
