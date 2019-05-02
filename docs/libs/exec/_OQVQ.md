
**NAME**

NewList -- prepare a list structure for use

**SYNOPSIS**

```c
    NewList(list)

    VOID NewList(struct List *);
    VOID NewList(struct MinList *);

```
Links: [List](_OOWD) [MinList](_OOWD) 

**FUNCTION**

Perform the magic needed to prepare a [List](_OOWD) header structure for
use; the list will be empty and ready to use.  (If the list is the
full featured type, you may need to initialize lh_Type afterwards)

Assembly programmers may want to use the NEWLIST macro instead.

**INPUTS**

list - pointer to a [List](_OOWD) or [MinList](_OOWD).

**SEE ALSO**

[&#060;exec/lists.h&#062;](_OOWD)
