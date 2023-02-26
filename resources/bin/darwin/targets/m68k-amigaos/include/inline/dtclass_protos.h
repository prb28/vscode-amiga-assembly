#ifndef _VBCCINLINE_DTCLASS_H
#define _VBCCINLINE_DTCLASS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __ObtainEngine(__reg("a6") void *)="\tjsr\t-30(a6)";
#define ObtainEngine() __ObtainEngine(DTClassBase)

#endif /*  _VBCCINLINE_DTCLASS_H  */
