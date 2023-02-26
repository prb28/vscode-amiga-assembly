#ifndef _VBCCINLINE_LABEL_H
#define _VBCCINLINE_LABEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __LABEL_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define LABEL_GetClass() __LABEL_GetClass(LabelBase)

#endif /*  _VBCCINLINE_LABEL_H  */
