#ifndef _VBCCINLINE_BITMAP_H
#define _VBCCINLINE_BITMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __BITMAP_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define BITMAP_GetClass() __BITMAP_GetClass(BitMapBase)

#endif /*  _VBCCINLINE_BITMAP_H  */
