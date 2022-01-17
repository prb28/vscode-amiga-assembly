
**NAME**

AddResource -- add a resource to the system

**SYNOPSIS**

```c
    AddResource(resource)
                A1

    void AddResource(APTR);

```
**FUNCTION**

This function adds a new resource to the system and makes it
available to other users.  The resource must be ready to be called
at this time.

Resources currently have no system-imposed structure, however they
must start with a standard named node (LN_SIZE), and should with
a standard [Library](_009C.md) node (LIB_SIZE).

**INPUTS**

resource - pointer an initialized resource node

**SEE ALSO**

[RemResource](RemResource.md), [OpenResource](OpenResource.md), [MakeLibrary](MakeLibrary.md)
