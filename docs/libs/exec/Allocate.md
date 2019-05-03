
**NAME**

Allocate - allocate a block of memory

**SYNOPSIS**

```c
    memoryBlock=Allocate(memHeader, byteSize)
    D0                   A0         D0

    void *Allocate(struct MemHeader *, ULONG);

```
Links: [MemHeader](_0089) 

**FUNCTION**

This function is used to allocate blocks of memory from a given
private free memory pool (as specified by a [MemHeader](_0089) and its
memory chunk list).  Allocate will return the first free block that
is greater than or equal to the requested size.

All blocks, whether free or allocated, will be block aligned;
hence, all allocation sizes are rounded up to the next block even
value (e.g. the minimum allocation resolution is currently 8
bytes.  A request for 8 bytes will use up exactly 8 bytes.  A
request for 7 bytes will also use up exactly 8 bytes.).

This function can be used to manage an application's internal data
memory.  Note that no arbitration of the [MemHeader](_0089) and associated
free chunk list is done.  You must be the owner before calling
Allocate.

**INPUTS**

memHeader - points to the local memory list header.
byteSize - the size of the desired block in bytes.

RESULT
memoryBlock - a pointer to the just allocated free block.
If there are no free regions large enough to satisfy the
request, return zero.

EXAMPLE
#include [&#060;exec/types.h&#062;](_0096)
#include [&#060;exec/memory.h&#062;](_0089)
void *AllocMem();
#define BLOCKSIZE 4096L /* Or whatever you want */

void main()
{
struct [MemHeader](_0089) *mh;
struct [MemChunk](_0089)  *mc;
APTR   block1;
APTR   block2;

/* Get the [MemHeader](_0089) needed to keep track of our new block */
mh = (struct [MemHeader](_0089) *)
AllocMem((long)sizeof(struct MemHeader), MEMF_CLEAR );
if( !mh )
exit(10);

/* Get the actual block the above [MemHeader](_0089) will manage */
mc = (struct [MemChunk](_0089) *)AllocMem( BLOCKSIZE, 0L );
if( !mc )
{
FreeMem( mh, (long)sizeof(struct MemHeader) ); exit(10);
}

mh-&#062;mh_Node.ln_Type = NT_MEMORY;
mh-&#062;mh_Node.ln_Name = &#034;myname&#034;;
mh-&#062;mh_First = mc;
mh-&#062;mh_Lower = (APTR) mc;
mh-&#062;mh_Upper = (APTR) ( BLOCKSIZE + (ULONG) mc );
mh-&#062;mh_Free  = BLOCKSIZE;

/* Set up first chunk in the freelist */
mc-&#062;mc_Next  = NULL;
mc-&#062;mc_Bytes = BLOCKSIZE;

block1 = (APTR) Allocate( mh, 20L );
block2 = (APTR) Allocate( mh, 314L );
printf(&#034;mh=$%lx mc=$%lxn&#034;,mh,mc);
printf(&#034;Block1=$%lx, Block2=$%lxn&#034;,block1,block2);

FreeMem( mh, (long)sizeof(struct MemHeader) );
FreeMem( mc, BLOCKSIZE );
}

NOTE
If the free list is corrupt, the system will panic with alert
AN_MemCorrupt, $01000005.

**SEE ALSO**

Deallocate, [exec/memory.h](_0089)
