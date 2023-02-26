#ifndef _VBCCINLINE_GETFILE_H
#define _VBCCINLINE_GETFILE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __GETFILE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define GETFILE_GetClass() __GETFILE_GetClass(GetFileBase)

#endif /*  _VBCCINLINE_GETFILE_H  */
