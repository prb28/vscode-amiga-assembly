#ifndef _VBCCINLINE_DISK_H
#define _VBCCINLINE_DISK_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BOOL __AllocUnit(__reg("a6") void *, __reg("d0") LONG unitNum)="\tjsr\t-6(a6)";
#define AllocUnit(unitNum) __AllocUnit(DiskBase, (unitNum))

VOID __FreeUnit(__reg("a6") void *, __reg("d0") LONG unitNum)="\tjsr\t-12(a6)";
#define FreeUnit(unitNum) __FreeUnit(DiskBase, (unitNum))

struct DiscResourceUnit * __GetUnit(__reg("a6") void *, __reg("a1") struct DiscResourceUnit * unitPointer)="\tjsr\t-18(a6)";
#define GetUnit(unitPointer) __GetUnit(DiskBase, (unitPointer))

VOID __GiveUnit(__reg("a6") void *)="\tjsr\t-24(a6)";
#define GiveUnit() __GiveUnit(DiskBase)

LONG __GetUnitID(__reg("a6") void *, __reg("d0") LONG unitNum)="\tjsr\t-30(a6)";
#define GetUnitID(unitNum) __GetUnitID(DiskBase, (unitNum))

LONG __ReadUnitID(__reg("a6") void *, __reg("d0") LONG unitNum)="\tjsr\t-36(a6)";
#define ReadUnitID(unitNum) __ReadUnitID(DiskBase, (unitNum))

#endif /*  _VBCCINLINE_DISK_H  */
