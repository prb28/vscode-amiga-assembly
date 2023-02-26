#ifndef _VBCCINLINE_REQUESTER_H
#define _VBCCINLINE_REQUESTER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __REQUESTER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define REQUESTER_GetClass() __REQUESTER_GetClass(RequesterBase)

#endif /*  _VBCCINLINE_REQUESTER_H  */
