#ifndef _VBCCINLINE_GADTOOLS_H
#define _VBCCINLINE_GADTOOLS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct Gadget * __CreateGadgetA(__reg("a6") void *, __reg("d0") ULONG kind, __reg("a0") struct Gadget * gad, __reg("a1") CONST struct NewGadget * ng, __reg("a2") CONST struct TagItem * taglist)="\tjsr\t-30(a6)";
#define CreateGadgetA(kind, gad, ng, taglist) __CreateGadgetA(GadToolsBase, (kind), (gad), (ng), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Gadget * __CreateGadget(__reg("a6") void *, __reg("d0") ULONG kind, __reg("a0") struct Gadget * gad, __reg("a1") CONST struct NewGadget * ng, Tag taglist, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a2";
#define CreateGadget(kind, gad, ng, ...) __CreateGadget(GadToolsBase, (kind), (gad), (ng), __VA_ARGS__)
#endif

VOID __FreeGadgets(__reg("a6") void *, __reg("a0") struct Gadget * gad)="\tjsr\t-36(a6)";
#define FreeGadgets(gad) __FreeGadgets(GadToolsBase, (gad))

VOID __GT_SetGadgetAttrsA(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") CONST struct TagItem * taglist)="\tjsr\t-42(a6)";
#define GT_SetGadgetAttrsA(gad, win, req, taglist) __GT_SetGadgetAttrsA(GadToolsBase, (gad), (win), (req), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GT_SetGadgetAttrs(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, Tag taglist, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a3";
#define GT_SetGadgetAttrs(gad, win, req, ...) __GT_SetGadgetAttrs(GadToolsBase, (gad), (win), (req), __VA_ARGS__)
#endif

struct Menu * __CreateMenusA(__reg("a6") void *, __reg("a0") CONST struct NewMenu * newmenu, __reg("a1") CONST struct TagItem * taglist)="\tjsr\t-48(a6)";
#define CreateMenusA(newmenu, taglist) __CreateMenusA(GadToolsBase, (newmenu), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Menu * __CreateMenus(__reg("a6") void *, __reg("a0") CONST struct NewMenu * newmenu, Tag taglist, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define CreateMenus(newmenu, ...) __CreateMenus(GadToolsBase, (newmenu), __VA_ARGS__)
#endif

VOID __FreeMenus(__reg("a6") void *, __reg("a0") struct Menu * menu)="\tjsr\t-54(a6)";
#define FreeMenus(menu) __FreeMenus(GadToolsBase, (menu))

BOOL __LayoutMenuItemsA(__reg("a6") void *, __reg("a0") struct MenuItem * firstitem, __reg("a1") APTR vi, __reg("a2") CONST struct TagItem * taglist)="\tjsr\t-60(a6)";
#define LayoutMenuItemsA(firstitem, vi, taglist) __LayoutMenuItemsA(GadToolsBase, (firstitem), (vi), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __LayoutMenuItems(__reg("a6") void *, __reg("a0") struct MenuItem * firstitem, __reg("a1") APTR vi, Tag taglist, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-60(a6)\n\tmovea.l\t(a7)+,a2";
#define LayoutMenuItems(firstitem, vi, ...) __LayoutMenuItems(GadToolsBase, (firstitem), (vi), __VA_ARGS__)
#endif

BOOL __LayoutMenusA(__reg("a6") void *, __reg("a0") struct Menu * firstmenu, __reg("a1") APTR vi, __reg("a2") CONST struct TagItem * taglist)="\tjsr\t-66(a6)";
#define LayoutMenusA(firstmenu, vi, taglist) __LayoutMenusA(GadToolsBase, (firstmenu), (vi), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __LayoutMenus(__reg("a6") void *, __reg("a0") struct Menu * firstmenu, __reg("a1") APTR vi, Tag taglist, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-66(a6)\n\tmovea.l\t(a7)+,a2";
#define LayoutMenus(firstmenu, vi, ...) __LayoutMenus(GadToolsBase, (firstmenu), (vi), __VA_ARGS__)
#endif

struct IntuiMessage * __GT_GetIMsg(__reg("a6") void *, __reg("a0") struct MsgPort * iport)="\tjsr\t-72(a6)";
#define GT_GetIMsg(iport) __GT_GetIMsg(GadToolsBase, (iport))

VOID __GT_ReplyIMsg(__reg("a6") void *, __reg("a1") struct IntuiMessage * imsg)="\tjsr\t-78(a6)";
#define GT_ReplyIMsg(imsg) __GT_ReplyIMsg(GadToolsBase, (imsg))

VOID __GT_RefreshWindow(__reg("a6") void *, __reg("a0") struct Window * win, __reg("a1") struct Requester * req)="\tjsr\t-84(a6)";
#define GT_RefreshWindow(win, req) __GT_RefreshWindow(GadToolsBase, (win), (req))

VOID __GT_BeginRefresh(__reg("a6") void *, __reg("a0") struct Window * win)="\tjsr\t-90(a6)";
#define GT_BeginRefresh(win) __GT_BeginRefresh(GadToolsBase, (win))

VOID __GT_EndRefresh(__reg("a6") void *, __reg("a0") struct Window * win, __reg("d0") LONG complete)="\tjsr\t-96(a6)";
#define GT_EndRefresh(win, complete) __GT_EndRefresh(GadToolsBase, (win), (complete))

struct IntuiMessage * __GT_FilterIMsg(__reg("a6") void *, __reg("a1") CONST struct IntuiMessage * imsg)="\tjsr\t-102(a6)";
#define GT_FilterIMsg(imsg) __GT_FilterIMsg(GadToolsBase, (imsg))

struct IntuiMessage * __GT_PostFilterIMsg(__reg("a6") void *, __reg("a1") struct IntuiMessage * imsg)="\tjsr\t-108(a6)";
#define GT_PostFilterIMsg(imsg) __GT_PostFilterIMsg(GadToolsBase, (imsg))

struct Gadget * __CreateContext(__reg("a6") void *, __reg("a0") struct Gadget ** glistptr)="\tjsr\t-114(a6)";
#define CreateContext(glistptr) __CreateContext(GadToolsBase, (glistptr))

VOID __DrawBevelBoxA(__reg("a6") void *, __reg("a0") struct RastPort * rport, __reg("d0") LONG left, __reg("d1") LONG top, __reg("d2") LONG width, __reg("d3") LONG height, __reg("a1") CONST struct TagItem * taglist)="\tjsr\t-120(a6)";
#define DrawBevelBoxA(rport, left, top, width, height, taglist) __DrawBevelBoxA(GadToolsBase, (rport), (left), (top), (width), (height), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __DrawBevelBox(__reg("a6") void *, __reg("a0") struct RastPort * rport, __reg("d0") LONG left, __reg("d1") LONG top, __reg("d2") LONG width, __reg("d3") LONG height, Tag taglist, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-120(a6)\n\tmovea.l\t(a7)+,a1";
#define DrawBevelBox(rport, left, top, width, height, ...) __DrawBevelBox(GadToolsBase, (rport), (left), (top), (width), (height), __VA_ARGS__)
#endif

APTR __GetVisualInfoA(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("a1") CONST struct TagItem * taglist)="\tjsr\t-126(a6)";
#define GetVisualInfoA(screen, taglist) __GetVisualInfoA(GadToolsBase, (screen), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __GetVisualInfo(__reg("a6") void *, __reg("a0") struct Screen * screen, Tag taglist, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-126(a6)\n\tmovea.l\t(a7)+,a1";
#define GetVisualInfo(screen, ...) __GetVisualInfo(GadToolsBase, (screen), __VA_ARGS__)
#endif

VOID __FreeVisualInfo(__reg("a6") void *, __reg("a0") APTR vi)="\tjsr\t-132(a6)";
#define FreeVisualInfo(vi) __FreeVisualInfo(GadToolsBase, (vi))

LONG __GT_GetGadgetAttrsA(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") CONST struct TagItem * taglist)="\tjsr\t-174(a6)";
#define GT_GetGadgetAttrsA(gad, win, req, taglist) __GT_GetGadgetAttrsA(GadToolsBase, (gad), (win), (req), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __GT_GetGadgetAttrs(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, Tag taglist, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-174(a6)\n\tmovea.l\t(a7)+,a3";
#define GT_GetGadgetAttrs(gad, win, req, ...) __GT_GetGadgetAttrs(GadToolsBase, (gad), (win), (req), __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_GADTOOLS_H  */
