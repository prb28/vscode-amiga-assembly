#ifndef _VBCCINLINE_TIMER_H
#define _VBCCINLINE_TIMER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __AddTime(__reg("a6") void *, __reg("a0") struct timeval * dest, __reg("a1") CONST struct timeval * src)="\tjsr\t-42(a6)";
#define AddTime(dest, src) __AddTime(TimerBase, (dest), (src))

VOID __SubTime(__reg("a6") void *, __reg("a0") struct timeval * dest, __reg("a1") CONST struct timeval * src)="\tjsr\t-48(a6)";
#define SubTime(dest, src) __SubTime(TimerBase, (dest), (src))

LONG __CmpTime(__reg("a6") void *, __reg("a0") CONST struct timeval * dest, __reg("a1") CONST struct timeval * src)="\tjsr\t-54(a6)";
#define CmpTime(dest, src) __CmpTime(TimerBase, (dest), (src))

ULONG __ReadEClock(__reg("a6") void *, __reg("a0") struct EClockVal * dest)="\tjsr\t-60(a6)";
#define ReadEClock(dest) __ReadEClock(TimerBase, (dest))

VOID __GetSysTime(__reg("a6") void *, __reg("a0") struct timeval * dest)="\tjsr\t-66(a6)";
#define GetSysTime(dest) __GetSysTime(TimerBase, (dest))

#endif /*  _VBCCINLINE_TIMER_H  */
