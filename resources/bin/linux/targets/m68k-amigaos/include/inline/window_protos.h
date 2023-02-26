#ifndef _VBCCINLINE_WINDOW_H
#define _VBCCINLINE_WINDOW_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __WINDOW_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define WINDOW_GetClass() __WINDOW_GetClass(WindowBase)

#endif /*  _VBCCINLINE_WINDOW_H  */
