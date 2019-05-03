
**NAME**

InitResident - initialize resident module

**SYNOPSIS**

```c
    object = InitResident(resident, segList)
    D0                     A1        D1

    APTR InitResident(struct Resident *,ULONG);

```
Links: [Resident](_00A0) 

**FUNCTION**

Initialize a ROMTag.  ROMTags are used to link system modules
together.  Each disk based device or library must contain a
ROMTag structure in the first code hunk.

Once the validity of the ROMTag is verified, the RT_INIT pointer
is jumped to  with the following registers:
D0 = 0
A0 = segList
A6 = [ExecBase](_009E)

**INPUTS**

resident - Pointer to a ROMTag
segList  - SegList of the loaded object, if loaded from disk.
Libraries &#038; Devices will cache this value for later
return at close or expunge time.  Pass NULL for ROM
modules.

**RESULTS**

object  - Return value from the init code, usually the library
or device base.  NULL for failure.

AUTOINIT FEATURE
An automatic method of library/device base and vector table
initialization is also provided by InitResident().  The initial code
hunk of the library or device should contain &#034;MOVEQ #-1,d0; RTS;&#034;.
Following that must be an initialized [Resident](_00A0) structure with
RTF_AUTOINIT set in rt_Flags, and an rt_Init pointer which points
to four longwords.  These four longwords will be used in a call
to MakeLibrary();

- The size of your library/device base structure including initial
[Library](_009C) or [Device](_0087) structure.

- A pointer to a longword table of standard, then library
specific function offsets, terminated with -1L.
(short format offsets are also acceptable)

- Pointer to data table in [exec/InitStruct](InitStruct) format for
initialization of [Library](_009C) or [Device](_0087) structure.

- Pointer to library initialization function, or NULL.
Calling sequence:
D0 = library base
A0 = segList
A6 = [ExecBase](_009E)
This function must return in D0 the library/device base to be
linked into the library/device list.  If the initialization
function fails, the device memory must be manually deallocated,
then NULL returned in D0.

**SEE ALSO**

exec/resident.i, [FindResident](FindResident)
