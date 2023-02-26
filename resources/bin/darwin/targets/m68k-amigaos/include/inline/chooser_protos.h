#ifndef _VBCCINLINE_CHOOSER_H
#define _VBCCINLINE_CHOOSER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __CHOOSER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define CHOOSER_GetClass() __CHOOSER_GetClass(ChooserBase)

struct Node * __AllocChooserNodeA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocChooserNodeA(tags) __AllocChooserNodeA(ChooserBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocChooserNode(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocChooserNode(...) __AllocChooserNode(ChooserBase, __VA_ARGS__)
#endif

VOID __FreeChooserNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreeChooserNode(node) __FreeChooserNode(ChooserBase, (node))

VOID __SetChooserNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetChooserNodeAttrsA(node, tags) __SetChooserNodeAttrsA(ChooserBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetChooserNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetChooserNodeAttrs(...) __SetChooserNodeAttrs(ChooserBase, __VA_ARGS__)
#endif

VOID __GetChooserNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetChooserNodeAttrsA(node, tags) __GetChooserNodeAttrsA(ChooserBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetChooserNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetChooserNodeAttrs(...) __GetChooserNodeAttrs(ChooserBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_CHOOSER_H  */
