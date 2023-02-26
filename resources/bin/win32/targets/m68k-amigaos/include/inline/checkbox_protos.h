#ifndef _VBCCINLINE_CHECKBOX_H
#define _VBCCINLINE_CHECKBOX_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __CHECKBOX_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define CHECKBOX_GetClass() __CHECKBOX_GetClass(CheckBoxBase)

#endif /*  _VBCCINLINE_CHECKBOX_H  */
