#ifndef _VBCCINLINE_PALETTE_H
#define _VBCCINLINE_PALETTE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __PALETTE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define PALETTE_GetClass() __PALETTE_GetClass(PaletteBase)

#endif /*  _VBCCINLINE_PALETTE_H  */
