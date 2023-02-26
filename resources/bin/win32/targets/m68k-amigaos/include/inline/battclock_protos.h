#ifndef _VBCCINLINE_BATTCLOCK_H
#define _VBCCINLINE_BATTCLOCK_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __ResetBattClock(__reg("a6") void *)="\tjsr\t-6(a6)";
#define ResetBattClock() __ResetBattClock(BattClockBase)

ULONG __ReadBattClock(__reg("a6") void *)="\tjsr\t-12(a6)";
#define ReadBattClock() __ReadBattClock(BattClockBase)

VOID __WriteBattClock(__reg("a6") void *, __reg("d0") ULONG time)="\tjsr\t-18(a6)";
#define WriteBattClock(time) __WriteBattClock(BattClockBase, (time))

#endif /*  _VBCCINLINE_BATTCLOCK_H  */
