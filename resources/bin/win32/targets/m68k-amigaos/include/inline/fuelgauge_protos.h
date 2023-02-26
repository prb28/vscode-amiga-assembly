#ifndef _VBCCINLINE_FUELGAUGE_H
#define _VBCCINLINE_FUELGAUGE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __FUELGAUGE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define FUELGAUGE_GetClass() __FUELGAUGE_GetClass(FuelGaugeBase)

#endif /*  _VBCCINLINE_FUELGAUGE_H  */
