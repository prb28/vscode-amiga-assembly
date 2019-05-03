
**NAME**

Insert -- insert a node into a list

**SYNOPSIS**

```c
    Insert(list, node, listNode)
           A0    A1    A2

    void Insert(struct List *, struct Node *, struct Node *);

```
Links: [List](_007D) [Node](_0091) [Node](_0091) 

**FUNCTION**

Insert a node into a doubly linked list AFTER a given node
position.  Insertion at the head of a list is possible by passing a
zero value for listNode, though the [AddHead](AddHead) function is slightly
faster for that special case.

**WARNING**

This function does not arbitrate for access to the list.  The
calling task must be the owner of the involved list.

**INPUTS**

list - a pointer to the target list header
node - the node to insert
listNode - the node after which to insert

**SEE ALSO**

[AddHead](AddHead), [AddTail](AddTail), [Enqueue](Enqueue), [RemHead](RemHead), Remove, [RemTail](RemTail)
