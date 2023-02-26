#ifndef CLIB_ICON_PROTOS_H
#define CLIB_ICON_PROTOS_H


/*
**	$VER: icon_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  WORKBENCH_WORKBENCH_H
#include <workbench/workbench.h>
#endif

BOOL GetIcon(const STRPTR name, struct DiskObject * diskObject,
	struct FreeList * freelist);
BOOL PutIcon(const STRPTR name, struct DiskObject * diskObject);
VOID FreeFreeList(struct FreeList * freelist);
BOOL AddFreeList(struct FreeList * freelist, const void * mem, ULONG size);
struct DiskObject * GetDiskObject(const STRPTR name);
BOOL PutDiskObject(const STRPTR name, const struct DiskObject * diskobj);
VOID FreeDiskObject(struct DiskObject * diskobj);
UBYTE * FindToolType(const STRPTR * toolTypeArray, const STRPTR typeName);
BOOL MatchToolValue(const STRPTR typeString, const STRPTR value);
STRPTR BumpRevision(STRPTR newname, const STRPTR oldname);

#endif	/*  CLIB_ICON_PROTOS_H  */
