#ifndef _VBCCINLINE_STRING_H
#define _VBCCINLINE_STRING_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __STRING_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define STRING_GetClass() __STRING_GetClass(StringBase)

#endif /*  _VBCCINLINE_STRING_H  */
