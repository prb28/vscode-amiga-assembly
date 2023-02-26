#ifndef _VBCCINLINE_ICON_H
#define _VBCCINLINE_ICON_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __GetIcon(__reg("a6") void *, __reg("a0") char * name, __reg("a1") struct DiskObject * icon, __reg("a2") struct FreeList * freelist)="\tjsr\t-42(a6)";
#define GetIcon(name, icon, freelist) __GetIcon(IconBase, (name), (icon), (freelist))

long __PutIcon(__reg("a6") void *, __reg("a0") char * name, __reg("a1") struct DiskObject * icon)="\tjsr\t-48(a6)";
#define PutIcon(name, icon) __PutIcon(IconBase, (name), (icon))

void __FreeFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist)="\tjsr\t-54(a6)";
#define FreeFreeList(freelist) __FreeFreeList(IconBase, (freelist))

long __AddFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist, __reg("a1") char * mem, __reg("a2") void * size)="\tjsr\t-72(a6)";
#define AddFreeList(freelist, mem, size) __AddFreeList(IconBase, (freelist), (mem), (void *)(size))

struct DiskObject * __GetDiskObject(__reg("a6") void *, __reg("a0") char * name)="\tjsr\t-78(a6)";
#define GetDiskObject(name) __GetDiskObject(IconBase, (name))

long __PutDiskObject(__reg("a6") void *, __reg("a0") char * name, __reg("a1") struct DiskObject * diskobj)="\tjsr\t-84(a6)";
#define PutDiskObject(name, diskobj) __PutDiskObject(IconBase, (name), (diskobj))

void __FreeDiskObject(__reg("a6") void *, __reg("a0") struct DiskObject * diskobj)="\tjsr\t-90(a6)";
#define FreeDiskObject(diskobj) __FreeDiskObject(IconBase, (diskobj))

char * __FindToolType(__reg("a6") void *, __reg("a0") char ** toolTypeArray, __reg("a1") char * typeName)="\tjsr\t-96(a6)";
#define FindToolType(toolTypeArray, typeName) __FindToolType(IconBase, (toolTypeArray), (typeName))

long __MatchToolValue(__reg("a6") void *, __reg("a0") char ** typeString, __reg("a1") char * value)="\tjsr\t-102(a6)";
#define MatchToolValue(typeString, value) __MatchToolValue(IconBase, (typeString), (value))

long __BumpRevision(__reg("a6") void *, __reg("a0") char * newname, __reg("a1") char * oldname)="\tjsr\t-108(a6)";
#define BumpRevision(newname, oldname) __BumpRevision(IconBase, (newname), (oldname))

#endif /*  _VBCCINLINE_ICON_H  */
