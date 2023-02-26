#ifndef _VBCCINLINE_POTGO_H
#define _VBCCINLINE_POTGO_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

UWORD __AllocPotBits(__reg("a6") void *, __reg("d0") ULONG bits)="\tjsr\t-6(a6)";
#define AllocPotBits(bits) __AllocPotBits(PotgoBase, (bits))

VOID __FreePotBits(__reg("a6") void *, __reg("d0") ULONG bits)="\tjsr\t-12(a6)";
#define FreePotBits(bits) __FreePotBits(PotgoBase, (bits))

VOID __WritePotgo(__reg("a6") void *, __reg("d0") ULONG word, __reg("d1") ULONG mask)="\tjsr\t-18(a6)";
#define WritePotgo(word, mask) __WritePotgo(PotgoBase, (word), (mask))

#endif /*  _VBCCINLINE_POTGO_H  */
