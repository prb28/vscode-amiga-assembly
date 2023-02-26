#ifndef _VBCCINLINE_SLIDER_H
#define _VBCCINLINE_SLIDER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __SLIDER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define SLIDER_GetClass() __SLIDER_GetClass(SliderBase)

#endif /*  _VBCCINLINE_SLIDER_H  */
