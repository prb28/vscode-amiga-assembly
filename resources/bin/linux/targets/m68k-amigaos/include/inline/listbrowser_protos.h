#ifndef _VBCCINLINE_LISTBROWSER_H
#define _VBCCINLINE_LISTBROWSER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct IClass * __LISTBROWSER_GetClass(__reg("a6") void *)="\tjsr\t-30(a6)";
#define LISTBROWSER_GetClass() __LISTBROWSER_GetClass(ListBrowserBase)

struct Node * __AllocListBrowserNodeA(__reg("a6") void *, __reg("d0") ULONG columns, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define AllocListBrowserNodeA(columns, tags) __AllocListBrowserNodeA(ListBrowserBase, (columns), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Node * __AllocListBrowserNode(__reg("a6") void *, __reg("d0") ULONG columns, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocListBrowserNode(...) __AllocListBrowserNode(ListBrowserBase, __VA_ARGS__)
#endif

VOID __FreeListBrowserNode(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-42(a6)";
#define FreeListBrowserNode(node) __FreeListBrowserNode(ListBrowserBase, (node))

VOID __SetListBrowserNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetListBrowserNodeAttrsA(node, tags) __SetListBrowserNodeAttrsA(ListBrowserBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetListBrowserNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetListBrowserNodeAttrs(...) __SetListBrowserNodeAttrs(ListBrowserBase, __VA_ARGS__)
#endif

VOID __GetListBrowserNodeAttrsA(__reg("a6") void *, __reg("a0") struct Node * node, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetListBrowserNodeAttrsA(node, tags) __GetListBrowserNodeAttrsA(ListBrowserBase, (node), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetListBrowserNodeAttrs(__reg("a6") void *, __reg("a0") struct Node * node, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetListBrowserNodeAttrs(...) __GetListBrowserNodeAttrs(ListBrowserBase, __VA_ARGS__)
#endif

VOID __ListBrowserSelectAll(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-60(a6)";
#define ListBrowserSelectAll(list) __ListBrowserSelectAll(ListBrowserBase, (list))

VOID __ShowListBrowserNodeChildren(__reg("a6") void *, __reg("a0") struct Node * node, __reg("d0") LONG depth)="\tjsr\t-66(a6)";
#define ShowListBrowserNodeChildren(node, depth) __ShowListBrowserNodeChildren(ListBrowserBase, (node), (depth))

VOID __HideListBrowserNodeChildren(__reg("a6") void *, __reg("a0") struct Node * node)="\tjsr\t-72(a6)";
#define HideListBrowserNodeChildren(node) __HideListBrowserNodeChildren(ListBrowserBase, (node))

VOID __ShowAllListBrowserChildren(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-78(a6)";
#define ShowAllListBrowserChildren(list) __ShowAllListBrowserChildren(ListBrowserBase, (list))

VOID __HideAllListBrowserChildren(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-84(a6)";
#define HideAllListBrowserChildren(list) __HideAllListBrowserChildren(ListBrowserBase, (list))

VOID __FreeListBrowserList(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-90(a6)";
#define FreeListBrowserList(list) __FreeListBrowserList(ListBrowserBase, (list))

struct ColumnInfo * __AllocLBColumnInfoA(__reg("a6") void *, __reg("d0") ULONG columns, __reg("a0") struct TagItem * tags)="\tjsr\t-96(a6)";
#define AllocLBColumnInfoA(columns, tags) __AllocLBColumnInfoA(ListBrowserBase, (columns), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct ColumnInfo * __AllocLBColumnInfo(__reg("a6") void *, __reg("d0") ULONG columns, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-96(a6)\n\tmovea.l\t(a7)+,a0";
#define AllocLBColumnInfo(...) __AllocLBColumnInfo(ListBrowserBase, __VA_ARGS__)
#endif

LONG __SetLBColumnInfoAttrsA(__reg("a6") void *, __reg("a1") struct ColumnInfo * columninfo, __reg("a0") struct TagItem * tags)="\tjsr\t-102(a6)";
#define SetLBColumnInfoAttrsA(columninfo, tags) __SetLBColumnInfoAttrsA(ListBrowserBase, (columninfo), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __SetLBColumnInfoAttrs(__reg("a6") void *, __reg("a1") struct ColumnInfo * columninfo, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-102(a6)\n\tmovea.l\t(a7)+,a0";
#define SetLBColumnInfoAttrs(...) __SetLBColumnInfoAttrs(ListBrowserBase, __VA_ARGS__)
#endif

LONG __GetLBColumnInfoAttrsA(__reg("a6") void *, __reg("a1") struct ColumnInfo * columninfo, __reg("a0") struct TagItem * tags)="\tjsr\t-108(a6)";
#define GetLBColumnInfoAttrsA(columninfo, tags) __GetLBColumnInfoAttrsA(ListBrowserBase, (columninfo), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __GetLBColumnInfoAttrs(__reg("a6") void *, __reg("a1") struct ColumnInfo * columninfo, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-108(a6)\n\tmovea.l\t(a7)+,a0";
#define GetLBColumnInfoAttrs(...) __GetLBColumnInfoAttrs(ListBrowserBase, __VA_ARGS__)
#endif

VOID __FreeLBColumnInfo(__reg("a6") void *, __reg("a0") struct ColumnInfo * columninfo)="\tjsr\t-114(a6)";
#define FreeLBColumnInfo(columninfo) __FreeLBColumnInfo(ListBrowserBase, (columninfo))

VOID __ListBrowserClearAll(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-120(a6)";
#define ListBrowserClearAll(list) __ListBrowserClearAll(ListBrowserBase, (list))

#endif /*  _VBCCINLINE_LISTBROWSER_H  */
