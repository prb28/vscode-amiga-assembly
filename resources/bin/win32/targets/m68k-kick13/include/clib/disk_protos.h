#ifndef CLIB_DISK_PROTOS_H
#define CLIB_DISK_PROTOS_H


/*
**	$VER: disk_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  RESOURCES_DISK_H
#include <resources/disk.h>
#endif

BOOL AllocUnit(LONG unitNum);
VOID FreeUnit(LONG unitNum);
struct DiscResourceUnit * GetUnit(struct DiscResourceUnit * unitPointer);
VOID GiveUnit(void);
LONG GetUnitID(LONG unitNum);
LONG ReadUnitID(LONG unitNum);

#endif	/*  CLIB_DISK_PROTOS_H  */
