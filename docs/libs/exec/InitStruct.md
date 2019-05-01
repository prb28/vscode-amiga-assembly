
**NAME**

InitStruct - initialize memory from a table

**SYNOPSIS**

```c
    InitStruct(initTable, memory, size);
               A1         A2      D0

    void InitStruct(struct InitStruct *, APTR, ULONG);

```
**FUNCTION**

Clear a memory area, then set up default values according to
the data and offset values in the initTable.  Typically only assembly
programs take advantage of this function, and only with the macros
defined in &#034;exec/initializers.i&#034;.

The initialization table has byte commands to

|a    ||byte|      |given||byte|         |once         |
load |count||word| into |next ||rptr| offset, |repetitively |
|long|

Not all combinations are supported.  The offset, when specified, is
relative to the memory pointer provided (Memory), and is initially
zero.  The initialization data (InitTable) contains byte commands
whose 8 bits are interpreted as follows:

ddssnnnn
dd  the destination type (and size):
00  no offset, use next destination, nnnn is count
01  no offset, use next destination, nnnn is repeat
10  destination offset is in the next byte, nnnn is count
11  destination offset is in the next 24-bits, nnnn is count
ss  the size and location of the source:
00  long, from the next two aligned words
01  word, from the next aligned word
10  byte, from the next byte
11  ERROR - will cause an ALERT (see below)
nnnn  the count or repeat:
count  the (number+1) of source items to copy
repeat  the source is copied (number+1) times.

initTable commands are always read from the next even byte. Given
destination offsets are always relative to the memory pointer (A2).

The command %00000000 ends the InitTable stream: use %00010001 if you
really want to copy one longword without a new offset.

24 bit APTR not supported for 68020 compatibility -- use long.

**INPUTS**

initTable - the beginning of the commands and data to init
Memory with.  Must be on an even boundary unless only
byte initialization is done.  End table with &#034;dc.b 0&#034;
or &#034;dc.w 0&#034;.
memory - the beginning of the memory to initialize.  Must be
on an even boundary if size is specified.
size - the size of memory, which is used to clear it before
initializing it via the initTable.  If Size is zero,
memory is not cleared before initializing.

size must be an even number.

**SEE ALSO**

exec/initializers.i
