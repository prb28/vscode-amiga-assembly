
**NAME**

SumLibrary -- compute and check the checksum on a library

**SYNOPSIS**

```c
    SumLibrary(library)
               A1

    void SumLibrary(struct Library *);

```
Links: [Library](_009C) 

**FUNCTION**

SumLibrary computes a new checksum on a library.  It can also be
used to check an old checksum.  If an old checksum does not match,
and the library has not been marked as changed, then the system
will call [Alert](Alert).

This call could also be periodically made by some future
system-checking task.

**INPUTS**

library - a pointer to the library to be changed

NOTE
An alert will occur if the checksum fails.

**SEE ALSO**

[SetFunction](SetFunction)
