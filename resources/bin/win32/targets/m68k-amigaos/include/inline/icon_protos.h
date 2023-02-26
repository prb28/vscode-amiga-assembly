#ifndef _VBCCINLINE_ICON_H
#define _VBCCINLINE_ICON_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __FreeFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist)="\tjsr\t-54(a6)";
#define FreeFreeList(freelist) __FreeFreeList(IconBase, (freelist))

BOOL __AddFreeList(__reg("a6") void *, __reg("a0") struct FreeList * freelist, __reg("a1") CONST APTR mem, __reg("a2") void * size)="\tjsr\t-72(a6)";
#define AddFreeList(freelist, mem, size) __AddFreeList(IconBase, (freelist), (mem), (void *)(size))

struct DiskObject * __GetDiskObject(__reg("a6") void *, __reg("a0") CONST STRPTR name)="\tjsr\t-78(a6)";
#define GetDiskObject(name) __GetDiskObject(IconBase, (name))

BOOL __PutDiskObject(__reg("a6") void *, __reg("a0") CONST STRPTR name, __reg("a1") CONST struct DiskObject * diskobj)="\tjsr\t-84(a6)";
#define PutDiskObject(name, diskobj) __PutDiskObject(IconBase, (name), (diskobj))

VOID __FreeDiskObject(__reg("a6") void *, __reg("a0") struct DiskObject * diskobj)="\tjsr\t-90(a6)";
#define FreeDiskObject(diskobj) __FreeDiskObject(IconBase, (diskobj))

UBYTE * __FindToolType(__reg("a6") void *, __reg("a0") CONST STRPTR * toolTypeArray, __reg("a1") CONST STRPTR typeName)="\tjsr\t-96(a6)";
#define FindToolType(toolTypeArray, typeName) __FindToolType(IconBase, (toolTypeArray), (typeName))

BOOL __MatchToolValue(__reg("a6") void *, __reg("a0") CONST STRPTR typeString, __reg("a1") CONST STRPTR value)="\tjsr\t-102(a6)";
#define MatchToolValue(typeString, value) __MatchToolValue(IconBase, (typeString), (value))

STRPTR __BumpRevision(__reg("a6") void *, __reg("a0") STRPTR newname, __reg("a1") CONST STRPTR oldname)="\tjsr\t-108(a6)";
#define BumpRevision(newname, oldname) __BumpRevision(IconBase, (newname), (oldname))

struct DiskObject * __GetDefDiskObject(__reg("a6") void *, __reg("d0") LONG type)="\tjsr\t-120(a6)";
#define GetDefDiskObject(type) __GetDefDiskObject(IconBase, (type))

BOOL __PutDefDiskObject(__reg("a6") void *, __reg("a0") CONST struct DiskObject * diskObject)="\tjsr\t-126(a6)";
#define PutDefDiskObject(diskObject) __PutDefDiskObject(IconBase, (diskObject))

struct DiskObject * __GetDiskObjectNew(__reg("a6") void *, __reg("a0") CONST STRPTR name)="\tjsr\t-132(a6)";
#define GetDiskObjectNew(name) __GetDiskObjectNew(IconBase, (name))

BOOL __DeleteDiskObject(__reg("a6") void *, __reg("a0") CONST STRPTR name)="\tjsr\t-138(a6)";
#define DeleteDiskObject(name) __DeleteDiskObject(IconBase, (name))

struct DiskObject * __DupDiskObjectA(__reg("a6") void *, __reg("a0") CONST struct DiskObject * diskObject, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-150(a6)";
#define DupDiskObjectA(diskObject, tags) __DupDiskObjectA(IconBase, (diskObject), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct DiskObject * __DupDiskObject(__reg("a6") void *, __reg("a0") CONST struct DiskObject * diskObject, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-150(a6)\n\tmovea.l\t(a7)+,a1";
#define DupDiskObject(...) __DupDiskObject(IconBase, __VA_ARGS__)
#endif

ULONG __IconControlA(__reg("a6") void *, __reg("a0") struct DiskObject * icon, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-156(a6)";
#define IconControlA(icon, tags) __IconControlA(IconBase, (icon), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __IconControl(__reg("a6") void *, __reg("a0") struct DiskObject * icon, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-156(a6)\n\tmovea.l\t(a7)+,a1";
#define IconControl(...) __IconControl(IconBase, __VA_ARGS__)
#endif

VOID __DrawIconStateA(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct DiskObject * icon, __reg("a2") CONST STRPTR label, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset, __reg("d2") ULONG state, __reg("a3") CONST struct TagItem * tags)="\tjsr\t-162(a6)";
#define DrawIconStateA(rp, icon, label, leftOffset, topOffset, state, tags) __DrawIconStateA(IconBase, (rp), (icon), (label), (leftOffset), (topOffset), (state), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __DrawIconState(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct DiskObject * icon, __reg("a2") CONST STRPTR label, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset, __reg("d2") ULONG state, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-162(a6)\n\tmovea.l\t(a7)+,a3";
#define DrawIconState(rp, icon, label, leftOffset, topOffset, ...) __DrawIconState(IconBase, (rp), (icon), (label), (leftOffset), (topOffset), __VA_ARGS__)
#endif

BOOL __GetIconRectangleA(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct DiskObject * icon, __reg("a2") CONST STRPTR label, __reg("a3") struct Rectangle * rect, __reg("a4") CONST struct TagItem * tags)="\tjsr\t-168(a6)";
#define GetIconRectangleA(rp, icon, label, rect, tags) __GetIconRectangleA(IconBase, (rp), (icon), (label), (rect), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __GetIconRectangle(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct DiskObject * icon, __reg("a2") CONST STRPTR label, __reg("a3") struct Rectangle * rect, ...)="\tmove.l\ta4,-(a7)\n\tlea\t4(a7),a4\n\tjsr\t-168(a6)\n\tmovea.l\t(a7)+,a4";
#define GetIconRectangle(rp, icon, label, ...) __GetIconRectangle(IconBase, (rp), (icon), (label), __VA_ARGS__)
#endif

struct DiskObject * __NewDiskObject(__reg("a6") void *, __reg("d0") LONG type)="\tjsr\t-174(a6)";
#define NewDiskObject(type) __NewDiskObject(IconBase, (type))

struct DiskObject * __GetIconTagList(__reg("a6") void *, __reg("a0") CONST STRPTR name, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-180(a6)";
#define GetIconTagList(name, tags) __GetIconTagList(IconBase, (name), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct DiskObject * __GetIconTags(__reg("a6") void *, __reg("a0") CONST STRPTR name, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-180(a6)\n\tmovea.l\t(a7)+,a1";
#define GetIconTags(...) __GetIconTags(IconBase, __VA_ARGS__)
#endif

BOOL __PutIconTagList(__reg("a6") void *, __reg("a0") CONST STRPTR name, __reg("a1") CONST struct DiskObject * icon, __reg("a2") CONST struct TagItem * tags)="\tjsr\t-186(a6)";
#define PutIconTagList(name, icon, tags) __PutIconTagList(IconBase, (name), (icon), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __PutIconTags(__reg("a6") void *, __reg("a0") CONST STRPTR name, __reg("a1") CONST struct DiskObject * icon, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-186(a6)\n\tmovea.l\t(a7)+,a2";
#define PutIconTags(name, ...) __PutIconTags(IconBase, (name), __VA_ARGS__)
#endif

BOOL __LayoutIconA(__reg("a6") void *, __reg("a0") struct DiskObject * icon, __reg("a1") struct Screen * screen, __reg("a2") struct TagItem * tags)="\tjsr\t-192(a6)";
#define LayoutIconA(icon, screen, tags) __LayoutIconA(IconBase, (icon), (screen), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __LayoutIcon(__reg("a6") void *, __reg("a0") struct DiskObject * icon, __reg("a1") struct Screen * screen, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-192(a6)\n\tmovea.l\t(a7)+,a2";
#define LayoutIcon(icon, ...) __LayoutIcon(IconBase, (icon), __VA_ARGS__)
#endif

VOID __ChangeToSelectedIconColor(__reg("a6") void *, __reg("a0") struct ColorRegister * cr)="\tjsr\t-198(a6)";
#define ChangeToSelectedIconColor(cr) __ChangeToSelectedIconColor(IconBase, (cr))

#endif /*  _VBCCINLINE_ICON_H  */
