#ifndef _VBCCINLINE_BEVEL_H
#define _VBCCINLINE_BEVEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __BEVEL_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define BEVEL_GetClass() __BEVEL_GetClass(BevelBase)

#endif /*  _VBCCINLINE_BEVEL_H  */
