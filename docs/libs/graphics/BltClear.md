
**NAME**


BltClear - Clear a block of memory words to zero.

**SYNOPSIS**

```c
    BltClear( memBlock, bytecount, flags )
                a1         d0       d1

    void BltClear( void *, ULONG, ULONG );

```
**FUNCTION**

For memory that is local and blitter accessable, the most
efficient way to clear a range of memory locations is
to use the system's most efficient data mover, the blitter.
This command accepts the starting location and count and clears
that block to zeros.

**INPUTS**

memBloc - pointer to local memory to be cleared
memBlock is assumed to be even.
flags   - set bit 0 to force function to wait until
the blit is done.
set bit 1 to use row/bytesperrow.

bytecount - if (flags &#038; 2) == 0 then
even number of bytes to clear.
else
low 16 bits is taken as number of bytes
per row and upper 16 bits taken as
number of rows.

This function is somewhat hardware dependant. In the rows/bytesperrow
mode (with the pre-ECS blitter) rows must be &#060;- 1024. In bytecount mode
multiple runs of the blitter may be used to clear all the memory.

Set bit 2 to use the upper 16 bits of the Flags as the data to fill
memory with instead of 0 (V36).

RESULT
The block of memory is initialized.

BUGS

**SEE ALSO**

