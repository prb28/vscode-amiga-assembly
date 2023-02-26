#ifndef _VBCCINLINE_CLICKTAB_H
#define _VBCCINLINE_CLICKTAB_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __CLICKTAB_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define CLICKTAB_GetClass() __CLICKTAB_GetClass(ClickTabBase)

struct Node * __AllocClickTabNodeA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocClickTabNodeA(tags) __AllocClickTabNodeA(ClickTabBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocClickTabNode(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocClickTabNode(...) __AllocClickTabNode(ClickTabBase, __VA_ARGS__)
#endif

VOID __FreeClickTabNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreeClickTabNode(node) __FreeClickTabNode(ClickTabBase, (node))

VOID __SetClickTabNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetClickTabNodeAttrsA(node, tags) __SetClickTabNodeAttrsA(ClickTabBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetClickTabNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetClickTabNodeAttrs(...) __SetClickTabNodeAttrs(ClickTabBase, __VA_ARGS__)
#endif

VOID __GetClickTabNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetClickTabNodeAttrsA(node, tags) __GetClickTabNodeAttrsA(ClickTabBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetClickTabNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetClickTabNodeAttrs(...) __GetClickTabNodeAttrs(ClickTabBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_CLICKTAB_H  */
