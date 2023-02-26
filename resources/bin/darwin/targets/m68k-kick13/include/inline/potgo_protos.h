#ifndef _VBCCINLINE_POTGO_H
#define _VBCCINLINE_POTGO_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __AllocPotBits(__reg("a6") void *, __reg("d0") long bits)="\tjsr\t-6(a6)";
#define AllocPotBits(bits) __AllocPotBits(PotgoBase, (bits))

void __FreePotBits(__reg("a6") void *, __reg("d0") long bits)="\tjsr\t-12(a6)";
#define FreePotBits(bits) __FreePotBits(PotgoBase, (bits))

void __WritePotgo(__reg("a6") void *, __reg("d0") long word, __reg("d1") long mask)="\tjsr\t-18(a6)";
#define WritePotgo(word, mask) __WritePotgo(PotgoBase, (word), (mask))

#endif /*  _VBCCINLINE_POTGO_H  */
