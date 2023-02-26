#ifndef _VBCCINLINE_BATTMEM_H
#define _VBCCINLINE_BATTMEM_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __ObtainBattSemaphore(__reg("a6") void *)="\tjsr\t-6(a6)";
#define ObtainBattSemaphore() __ObtainBattSemaphore(BattMemBase)

VOID __ReleaseBattSemaphore(__reg("a6") void *)="\tjsr\t-12(a6)";
#define ReleaseBattSemaphore() __ReleaseBattSemaphore(BattMemBase)

ULONG __ReadBattMem(__reg("a6") void *, __reg("a0") APTR buffer, __reg("d0") ULONG offset, __reg("d1") ULONG length)="\tjsr\t-18(a6)";
#define ReadBattMem(buffer, offset, length) __ReadBattMem(BattMemBase, (buffer), (offset), (length))

ULONG __WriteBattMem(__reg("a6") void *, __reg("a0") CONST APTR buffer, __reg("d0") ULONG offset, __reg("d1") ULONG length)="\tjsr\t-24(a6)";
#define WriteBattMem(buffer, offset, length) __WriteBattMem(BattMemBase, (buffer), (offset), (length))

#endif /*  _VBCCINLINE_BATTMEM_H  */
