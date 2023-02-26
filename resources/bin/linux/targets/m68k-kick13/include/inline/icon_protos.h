#ifndef _VBCCINLINE_ICON_H
#define _VBCCINLINE_ICON_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BOOL __GetIcon(__reg("a6") void *, __reg("a0") const STRPTR name, __reg("a1") struct DiskObject * diskObject, __reg("a2") struct FreeList * freelist)="\tjsr\t-42(a6)";
#define GetIcon(name, diskObject, freelist) __GetIcon(IconBase, (name), (diskObject), (freelist))

BOOL __PutIcon(__reg("a6") void *, __reg("a0") const STRPTR name, __reg("a1") struct DiskObject * diskObject)="\tjsr\t-48(a6)";
#define PutIcon(name, diskObject) __PutIcon(IconBase, (name), (diskObject))

VOID __FreeFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist)="\tjsr\t-54(a6)";
#define FreeFreeList(freelist) __FreeFreeList(IconBase, (freelist))

BOOL __AddFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist, __reg("a1") const void * mem, __reg("a2") void * size)="\tjsr\t-72(a6)";
#define AddFreeList(freelist, mem, size) __AddFreeList(IconBase, (freelist), (mem), (void *)(size))

struct DiskObject * __GetDiskObject(__reg("a6") void *, __reg("a0") const STRPTR name)="\tjsr\t-78(a6)";
#define GetDiskObject(name) __GetDiskObject(IconBase, (name))

BOOL __PutDiskObject(__reg("a6") void *, __reg("a0") const STRPTR name, __reg("a1") const struct DiskObject * diskobj)="\tjsr\t-84(a6)";
#define PutDiskObject(name, diskobj) __PutDiskObject(IconBase, (name), (diskobj))

VOID __FreeDiskObject(__reg("a6") void *, __reg("a0") struct DiskObject * diskobj)="\tjsr\t-90(a6)";
#define FreeDiskObject(diskobj) __FreeDiskObject(IconBase, (diskobj))

UBYTE * __FindToolType(__reg("a6") void *, __reg("a0") const STRPTR * toolTypeArray, __reg("a1") const STRPTR typeName)="\tjsr\t-96(a6)";
#define FindToolType(toolTypeArray, typeName) __FindToolType(IconBase, (toolTypeArray), (typeName))

BOOL __MatchToolValue(__reg("a6") void *, __reg("a0") const STRPTR typeString, __reg("a1") const STRPTR value)="\tjsr\t-102(a6)";
#define MatchToolValue(typeString, value) __MatchToolValue(IconBase, (typeString), (value))

STRPTR __BumpRevision(__reg("a6") void *, __reg("a0") STRPTR newname, __reg("a1") const STRPTR oldname)="\tjsr\t-108(a6)";
#define BumpRevision(newname, oldname) __BumpRevision(IconBase, (newname), (oldname))

#endif /*  _VBCCINLINE_ICON_H  */
