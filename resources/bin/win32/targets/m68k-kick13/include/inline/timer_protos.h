#ifndef _VBCCINLINE_TIMER_H
#define _VBCCINLINE_TIMER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __AddTime(__reg("a6") void *, __reg("a0") struct timeval * dest, __reg("a1") const struct timeval * src)="\tjsr\t-42(a6)";
#define AddTime(dest, src) __AddTime(TimerBase, (dest), (src))

VOID __SubTime(__reg("a6") void *, __reg("a0") struct timeval * dest, __reg("a1") const struct timeval * src)="\tjsr\t-48(a6)";
#define SubTime(dest, src) __SubTime(TimerBase, (dest), (src))

LONG __CmpTime(__reg("a6") void *, __reg("a0") const struct timeval * dest, __reg("a1") const struct timeval * src)="\tjsr\t-54(a6)";
#define CmpTime(dest, src) __CmpTime(TimerBase, (dest), (src))

#endif /*  _VBCCINLINE_TIMER_H  */
