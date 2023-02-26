#ifndef _VBCCINLINE_SCROLLER_H
#define _VBCCINLINE_SCROLLER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __SCROLLER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define SCROLLER_GetClass() __SCROLLER_GetClass(ScrollerBase)

#endif /*  _VBCCINLINE_SCROLLER_H  */
