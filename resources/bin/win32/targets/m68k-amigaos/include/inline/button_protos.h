#ifndef _VBCCINLINE_BUTTON_H
#define _VBCCINLINE_BUTTON_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __BUTTON_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define BUTTON_GetClass() __BUTTON_GetClass(ButtonBase)

#endif /*  _VBCCINLINE_BUTTON_H  */
