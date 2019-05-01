
**NAME**

RemResource -- remove a resource from the system

**SYNOPSIS**

```c
    RemResource(resource)
               A1

    void RemResource(APTR);

```
**FUNCTION**

This function removes an existing resource from the system resource
list.  There must be no outstanding users of the resource.

**INPUTS**

resource - pointer to a resource node

**SEE ALSO**

[AddResource](AddResource)
