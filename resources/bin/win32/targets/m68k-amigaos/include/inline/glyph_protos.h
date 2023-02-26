#ifndef _VBCCINLINE_GLYPH_H
#define _VBCCINLINE_GLYPH_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __GLYPH_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define GLYPH_GetClass() __GLYPH_GetClass(GlyphBase)

#endif /*  _VBCCINLINE_GLYPH_H  */
