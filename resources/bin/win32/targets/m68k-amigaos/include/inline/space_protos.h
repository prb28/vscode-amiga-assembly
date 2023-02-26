#ifndef _VBCCINLINE_SPACE_H
#define _VBCCINLINE_SPACE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __SPACE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define SPACE_GetClass() __SPACE_GetClass(SpaceBase)

#endif /*  _VBCCINLINE_SPACE_H  */
