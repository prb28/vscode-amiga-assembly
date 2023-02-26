#ifndef _VBCCINLINE_GETSCREENMODE_H
#define _VBCCINLINE_GETSCREENMODE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __GETSCREENMODE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define GETSCREENMODE_GetClass() __GETSCREENMODE_GetClass(GetScreenModeBase)

#endif /*  _VBCCINLINE_GETSCREENMODE_H  */
