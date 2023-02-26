#ifndef _VBCCINLINE_RADIOBUTTON_H
#define _VBCCINLINE_RADIOBUTTON_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Class * __RADIOBUTTON_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define RADIOBUTTON_GetClass() __RADIOBUTTON_GetClass(RadioButtonBase)

struct Node * __AllocRadioButtonNodeA(__reg("a6") void *, __reg("d0") ULONG columns, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocRadioButtonNodeA(columns, tags) __AllocRadioButtonNodeA(RadioButtonBase, (columns), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocRadioButtonNode(__reg("a6") void *, __reg("d0") ULONG columns, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocRadioButtonNode(columns, ...) __AllocRadioButtonNode(RadioButtonBase, (columns), __VA_ARGS__)
#endif

VOID __FreeRadioButtonNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreeRadioButtonNode(node) __FreeRadioButtonNode(RadioButtonBase, (node))

VOID __SetRadioButtonNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetRadioButtonNodeAttrsA(node, tags) __SetRadioButtonNodeAttrsA(RadioButtonBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetRadioButtonNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetRadioButtonNodeAttrs(...) __SetRadioButtonNodeAttrs(RadioButtonBase, __VA_ARGS__)
#endif

VOID __GetRadioButtonNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetRadioButtonNodeAttrsA(node, tags) __GetRadioButtonNodeAttrsA(RadioButtonBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetRadioButtonNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetRadioButtonNodeAttrs(...) __GetRadioButtonNodeAttrs(RadioButtonBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_RADIOBUTTON_H  */
