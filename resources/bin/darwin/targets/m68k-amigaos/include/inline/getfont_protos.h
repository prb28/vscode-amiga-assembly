#ifndef _VBCCINLINE_GETFONT_H
#define _VBCCINLINE_GETFONT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __GETFONT_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define GETFONT_GetClass() __GETFONT_GetClass(GetFontBase)

#endif /*  _VBCCINLINE_GETFONT_H  */
