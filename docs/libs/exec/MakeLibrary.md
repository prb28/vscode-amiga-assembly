
**NAME**

MakeLibrary -- construct a library

**SYNOPSIS**

```c
    library = MakeLibrary(vectors, structure, init, dSize, segList)
    D0                    A0       A1         A2    D0     D1

    struct Library *MakeLibrary
                          (APTR,struct InitStruct *,APTR,ULONG,BPTR);

```
Links: [Library](_009C.md) [InitStruct](InitStruct.md) 

**FUNCTION**

This function is used for constructing a library vector and data
area.  The same call is used to make devices.  Space for the library
is allocated from the system's free memory pool.  The data portion of
the library is initialized.  init may point to a library specific
entry point.

NOTE
Starting with V36, the library base is longword adjusted.  The
lib_PosSize and lib_NegSize fields of the library structure are
adjusted to match.

**INPUTS**

vectors - pointer to an array of function pointers or function
displacements.  If the first word of the array is -1, then
the array contains relative word displacements (based off
of vectors); otherwise, the array contains absolute
function pointers. The vector list is terminated by a -1
(of the same size as the pointers).

structure - points to an &#034;InitStruct&#034; data region.  If NULL,
then it will not be used.

init -  If non-NULL, an entry point that will be called before adding
the library to the system.  Registers are as follows:
d0 = libAddr    ;Your [Library](_009C.md) Address
a0 = segList    ;Your AmigaDOS segment list
a6 = [ExecBase](_009E.md)  ;Address of exec.library
The result of the init function must be the library address,
or NULL for failure.   If NULL, the init point must manually
deallocate the library base memory (based on the sizes stored
in lib_PosSize and lib_NegSize).

dSize - the size of the library data area, including the
standard library node data.  This must be at leas
sizeof(struct Library).

segList - pointer to an AmigaDOS SegList (segment list).
This is passed to a library's init code, and is used later
for removing the library from memory.

RESULT
library - the reference address of the library.  This is the
address used in references to the library, not the
beginning of the memory area allocated.  If the library
vector table require more system memory than is
available, this function will return NULL.

**SEE ALSO**

[InitStruct](InitStruct.md), [InitResident](InitResident.md), exec/initializers.i
