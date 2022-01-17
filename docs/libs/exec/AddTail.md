
**NAME**

AddTail -- append node to tail of a list

**SYNOPSIS**

```c
    AddTail(list, node)
            A0    A1

    void AddTail(struct List *, struct Node *);

```
Links: [List](_007D.md) [Node](_0091.md) 

**FUNCTION**

Add a node to the tail of a doubly linked list.  Assembly
programmers may prefer to use the ADDTAIL macro from
&#034;exec/lists.i&#034;.

**WARNING**

This function does not arbitrate for access to the list.  The
calling task must be the owner of the involved list.

**INPUTS**

list - a pointer to the target list header
node - a pointer to the node to insert at tail of the list

**SEE ALSO**

[AddHead](AddHead.md), [Enqueue](Enqueue.md), Insert, Remove, [RemHead](RemHead.md), [RemTail](RemTail.md)
