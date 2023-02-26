#ifndef _VBCCINLINE_MISC_H
#define _VBCCINLINE_MISC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

UBYTE * __AllocMiscResource(__reg("a6") void *, __reg("d0") ULONG unitNum, __reg("a1") CONST_STRPTR name)="\tjsr\t-6(a6)";
#define AllocMiscResource(unitNum, name) __AllocMiscResource(MiscBase, (unitNum), (name))

VOID __FreeMiscResource(__reg("a6") void *, __reg("d0") ULONG unitNum)="\tjsr\t-12(a6)";
#define FreeMiscResource(unitNum) __FreeMiscResource(MiscBase, (unitNum))

#endif /*  _VBCCINLINE_MISC_H  */
