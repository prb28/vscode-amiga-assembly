
**NAME**

NewRegion -- Get an empty region.

**SYNOPSIS**

```c
    region = NewRegion()
      d0

    struct Region *NewRegion();

```
Links: [Region](_OOBW) 

**FUNCTION**

Create a [Region](_OOBW) structure, initialize it to empty, and return
a pointer it.

**RESULTS**

region - pointer to initialized region. If it could not allocate
required memory region = NULL.

**INPUTS**

none

BUGS

**SEE ALSO**

[graphics/regions.h](_OOBW)
