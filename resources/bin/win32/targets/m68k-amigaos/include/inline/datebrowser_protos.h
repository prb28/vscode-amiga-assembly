#ifndef _VBCCINLINE_DATEBROWSER_H
#define _VBCCINLINE_DATEBROWSER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __DATEBROWSER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define DATEBROWSER_GetClass() __DATEBROWSER_GetClass(DateBrowserBase)

UWORD __JulianWeekDay(__reg("a6") void *, __reg("d0") ULONG day, __reg("d1") ULONG month, __reg("d2") LONG year)="\tjsr\t-36(a6)";
#define JulianWeekDay(day, month, year) __JulianWeekDay(DateBrowserBase, (day), (month), (year))

UWORD __JulianMonthDays(__reg("a6") void *, __reg("d0") ULONG month, __reg("d1") LONG year)="\tjsr\t-42(a6)";
#define JulianMonthDays(month, year) __JulianMonthDays(DateBrowserBase, (month), (year))

BOOL __JulianLeapYear(__reg("a6") void *, __reg("d0") LONG year)="\tjsr\t-48(a6)";
#define JulianLeapYear(year) __JulianLeapYear(DateBrowserBase, (year))

#endif /*  _VBCCINLINE_DATEBROWSER_H  */
