#ifndef _VBCCINLINE_INTEGER_H
#define _VBCCINLINE_INTEGER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __INTEGER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define INTEGER_GetClass() __INTEGER_GetClass(IntegerBase)

#endif /*  _VBCCINLINE_INTEGER_H  */
