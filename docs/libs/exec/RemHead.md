
**NAME**

RemHead -- remove the head node from a list

**SYNOPSIS**

```c
    node = RemHead(list)
    D0             A0

    struct Node *RemHead(struct List *);

```
Links: [Node](_0091) [List](_007D) 

**FUNCTION**

Get a pointer to the head node and remove it from the list.
Assembly programmers may prefer to use the REMHEAD macro from
&#034;exec/lists.i&#034;.

**WARNING**

This function does not arbitrate for access to the list.  The
calling task must be the owner of the involved list.

**INPUTS**

list - a pointer to the target list header

RESULT
node - the node removed or zero when empty list

**SEE ALSO**

[AddHead](AddHead), [AddTail](AddTail), [Enqueue](Enqueue), Insert, Remove, [RemTail](RemTail)
