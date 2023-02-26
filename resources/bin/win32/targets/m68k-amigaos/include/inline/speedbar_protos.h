#ifndef _VBCCINLINE_SPEEDBAR_H
#define _VBCCINLINE_SPEEDBAR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __SPEEDBAR_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define SPEEDBAR_GetClass() __SPEEDBAR_GetClass(SpeedBarBase)

struct Node * __AllocSpeedButtonNodeA(__reg("a6") void *, __reg("d0") ULONG number, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocSpeedButtonNodeA(number, tags) __AllocSpeedButtonNodeA(SpeedBarBase, (number), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocSpeedButtonNode(__reg("a6") void *, __reg("d0") ULONG number, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocSpeedButtonNode(number, ...) __AllocSpeedButtonNode(SpeedBarBase, (number), __VA_ARGS__)
#endif

VOID __FreeSpeedButtonNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreeSpeedButtonNode(node) __FreeSpeedButtonNode(SpeedBarBase, (node))

VOID __SetSpeedButtonNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetSpeedButtonNodeAttrsA(node, tags) __SetSpeedButtonNodeAttrsA(SpeedBarBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetSpeedButtonNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetSpeedButtonNodeAttrs(...) __SetSpeedButtonNodeAttrs(SpeedBarBase, __VA_ARGS__)
#endif

VOID __GetSpeedButtonNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetSpeedButtonNodeAttrsA(node, tags) __GetSpeedButtonNodeAttrsA(SpeedBarBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetSpeedButtonNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetSpeedButtonNodeAttrs(...) __GetSpeedButtonNodeAttrs(SpeedBarBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_SPEEDBAR_H  */
