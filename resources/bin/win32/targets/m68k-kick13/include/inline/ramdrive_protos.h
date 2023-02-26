#ifndef _VBCCINLINE_RAMDRIVE_H
#define _VBCCINLINE_RAMDRIVE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

STRPTR __KillRAD0(__reg("a6") void *)="\tjsr\t-42(a6)";
#define KillRAD0() __KillRAD0(RamdriveDevice)

#endif /*  _VBCCINLINE_RAMDRIVE_H  */
