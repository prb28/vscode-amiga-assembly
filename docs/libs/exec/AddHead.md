
**NAME**

AddHead -- insert node at the head of a list

**SYNOPSIS**

```c
    AddHead(list, node)
            A0    A1

    void AddHead(struct List *, struct Node *)

```
Links: [List](_007D.md) [Node](_0091.md) 

**FUNCTION**

Add a node to the head of a doubly linked list. Assembly
programmers may prefer to use the ADDHEAD macro from
&#034;exec/lists.i&#034;.

**WARNING**

This function does not arbitrate for access to the list.  The
calling task must be the owner of the involved list.

**INPUTS**

list - a pointer to the target list header
node - the node to insert at head

**SEE ALSO**

[AddTail](AddTail.md), [Enqueue](Enqueue.md), Insert, Remove, [RemHead](RemHead.md), [RemTail](RemTail.md)
