
**NAME**

OpenResource -- gain access to a resource

**SYNOPSIS**

```c
    resource = OpenResource(resName)
    D0                      A1

    APTR OpenResource(STRPTR);

```
**FUNCTION**

This function returns a pointer to a resource that was previously
installed into the system.

There is no CloseResource() function.

**INPUTS**

resName - the name of the resource requested.

**RESULTS**

resource - if successful, a resource pointer, else NULL
