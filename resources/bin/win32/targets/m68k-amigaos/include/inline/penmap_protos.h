#ifndef _VBCCINLINE_PENMAP_H
#define _VBCCINLINE_PENMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __PENMAP_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define PENMAP_GetClass() __PENMAP_GetClass(PenMapBase)

#endif /*  _VBCCINLINE_PENMAP_H  */
