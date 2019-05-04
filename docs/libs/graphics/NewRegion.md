
**NAME**

NewRegion -- Get an empty region.

**SYNOPSIS**

```c
    region = NewRegion()
      d0

    struct Region *NewRegion();

```
Links: [Region](_00B7) 

**FUNCTION**

Create a [Region](_00B7) structure, initialize it to empty, and return
a pointer it.

**RESULTS**

region - pointer to initialized region. If it could not allocate
required memory region = NULL.

**INPUTS**

none

BUGS

**SEE ALSO**

[graphics/regions.h](_00B7)
