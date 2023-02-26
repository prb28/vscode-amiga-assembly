#ifndef _VBCCINLINE_TEXTEDITOR_H
#define _VBCCINLINE_TEXTEDITOR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __TEXTEDITOR_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define TEXTEDITOR_GetClass() __TEXTEDITOR_GetClass(TextFieldBase)

#endif /*  _VBCCINLINE_TEXTEDITOR_H  */
