#ifndef _VBCCINLINE_DRAWLIST_H
#define _VBCCINLINE_DRAWLIST_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __DRAWLIST_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define DRAWLIST_GetClass() __DRAWLIST_GetClass(DrawListBase)

#endif /*  _VBCCINLINE_DRAWLIST_H  */
