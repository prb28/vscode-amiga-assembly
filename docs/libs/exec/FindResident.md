
**NAME**

FindResident - find a resident module by name

**SYNOPSIS**

```
    resident = FindResident(name)
    D0                      A1

```
struct [Resident](Resident) *FindResident(STRPTR);

**FUNCTION**

Search the system resident tag list for a resident tag (&#034;ROMTag&#034;) with
the given name.  If found return a pointer to the resident tag
structure, else return zero.

[Resident](Resident) modules are used by the system to pull all its parts
together at startup.  [Resident](Resident) tags are also found in disk based
devices and libraries.

**INPUTS**

name - pointer to name string

RESULT
resident - pointer to the resident tag structure or
zero if none found.

**SEE ALSO**

[exec/resident.h](exec/resident.h), [InitResident](InitResident)
