#ifndef _VBCCINLINE_INPUT_H
#define _VBCCINLINE_INPUT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

UWORD __PeekQualifier(__reg("a6") void *)="\tjsr\t-42(a6)";
#define PeekQualifier() __PeekQualifier(InputBase)

#endif /*  _VBCCINLINE_INPUT_H  */
