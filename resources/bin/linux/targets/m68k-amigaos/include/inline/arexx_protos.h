#ifndef _VBCCINLINE_AREXX_H
#define _VBCCINLINE_AREXX_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __AREXX_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define AREXX_GetClass() __AREXX_GetClass(ARexxBase)

#endif /*  _VBCCINLINE_AREXX_H  */
