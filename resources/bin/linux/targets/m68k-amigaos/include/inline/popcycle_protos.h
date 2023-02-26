#ifndef _VBCCINLINE_POPCYCLE_H
#define _VBCCINLINE_POPCYCLE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __POPCYCLE_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define POPCYCLE_GetClass() __POPCYCLE_GetClass(PopCycleBase)

struct Node * __AllocPopCycleNodeA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocPopCycleNodeA(tags) __AllocPopCycleNodeA(PopCycleBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocPopCycleNode(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocPopCycleNode(...) __AllocPopCycleNode(PopCycleBase, __VA_ARGS__)
#endif

VOID __FreePopCycleNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreePopCycleNode(node) __FreePopCycleNode(PopCycleBase, (node))

VOID __SetPopCycleNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetPopCycleNodeAttrsA(node, tags) __SetPopCycleNodeAttrsA(PopCycleBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetPopCycleNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetPopCycleNodeAttrs(...) __SetPopCycleNodeAttrs(PopCycleBase, __VA_ARGS__)
#endif

VOID __GetPopCycleNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetPopCycleNodeAttrsA(node, tags) __GetPopCycleNodeAttrsA(PopCycleBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetPopCycleNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetPopCycleNodeAttrs(...) __GetPopCycleNodeAttrs(PopCycleBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_POPCYCLE_H  */
