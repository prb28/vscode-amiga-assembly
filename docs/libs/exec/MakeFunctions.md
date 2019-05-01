
**NAME**

MakeFunctions -- construct a function jump table

**SYNOPSIS**

```c
    tableSize = MakeFunctions(target, functionArray, funcDispBase)
    D0                        A0      A1             A2

    ULONG MakeFunctions(APTR,APTR,APTR);

```
**FUNCTION**

A low level function used by [MakeLibrary](MakeLibrary) to build jump tables of
the type used by libraries, devices and resources.  It allows the
table to be built anywhere in memory, and can be used both for
initialization and replacement. This function also supports function
pointer compression by expanding relative displacements into absolute
pointers.

The processor instruction cache is cleared after the table building.

INPUT
destination - the target address for the high memory end of the
function jump table.  Typically this will be the library
base pointer.

functionArray - pointer to an array of function pointers or
function displacements.  If funcDispBase is zero, the array
is assumed to contain absolute pointers to functions. If
funcDispBase is not zero, then the array is assumed to
contain word displacements to functions.  In both cases,
the array is terminated by a -1 (of the same size as the
actual entry.

funcDispBase - pointer to the base about which all function
displacements are relative.  If zero, then the function
array contains absolute pointers.

RESULT
tableSize - size of the new table in bytes (for LIB_NEGSIZE).

**SEE ALSO**

[exec/MakeLibrary](MakeLibrary)
