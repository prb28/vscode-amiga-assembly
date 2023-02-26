#ifndef _VBCCINLINE_WIZARD_H
#define _VBCCINLINE_WIZARD_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

APTR __WZ_OpenSurfaceA(__reg("a6") void *, __reg("a0") STRPTR name, __reg("a1") APTR memaddr, __reg("a2") struct TagItem * tagptr)="\tjsr\t-30(a6)";
#define WZ_OpenSurfaceA(name, memaddr, tagptr) __WZ_OpenSurfaceA(WizardBase, (name), (memaddr), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __WZ_OpenSurface(__reg("a6") void *, __reg("a0") STRPTR name, __reg("a1") APTR memaddr, Tag tagptr, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a2";
#define WZ_OpenSurface(name, memaddr, ...) __WZ_OpenSurface(WizardBase, (name), (memaddr), __VA_ARGS__)
#endif

void __WZ_CloseSurface(__reg("a6") void *, __reg("a0") APTR surface)="\tjsr\t-36(a6)";
#define WZ_CloseSurface(surface) __WZ_CloseSurface(WizardBase, (surface))

struct WizardWindowHandle * __WZ_AllocWindowHandleA(__reg("a6") void *, __reg("d0") struct Screen * screen, __reg("d1") ULONG user_sizeof, __reg("a0") APTR surface, __reg("a1") struct TagItem * tagptr)="\tjsr\t-42(a6)";
#define WZ_AllocWindowHandleA(screen, user_sizeof, surface, tagptr) __WZ_AllocWindowHandleA(WizardBase, (screen), (user_sizeof), (surface), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct WizardWindowHandle * __WZ_AllocWindowHandle(__reg("a6") void *, __reg("d0") struct Screen * screen, __reg("d1") ULONG user_sizeof, __reg("a0") APTR surface, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_AllocWindowHandle(screen, user_sizeof, surface, ...) __WZ_AllocWindowHandle(WizardBase, (screen), (user_sizeof), (surface), __VA_ARGS__)
#endif

struct NewWindow * __WZ_CreateWindowObjA(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle, __reg("d0") ULONG id, __reg("a1") struct TagItem * tagptr)="\tjsr\t-48(a6)";
#define WZ_CreateWindowObjA(winhandle, id, tagptr) __WZ_CreateWindowObjA(WizardBase, (winhandle), (id), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct NewWindow * __WZ_CreateWindowObj(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle, __reg("d0") ULONG id, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_CreateWindowObj(winhandle, id, ...) __WZ_CreateWindowObj(WizardBase, (winhandle), (id), __VA_ARGS__)
#endif

struct Window * __WZ_OpenWindowA(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle, __reg("a1") struct NewWindow * newwin, __reg("a2") struct TagItem * tagptr)="\tjsr\t-54(a6)";
#define WZ_OpenWindowA(winhandle, newwin, tagptr) __WZ_OpenWindowA(WizardBase, (winhandle), (newwin), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Window * __WZ_OpenWindow(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle, __reg("a1") struct NewWindow * newwin, Tag tagptr, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a2";
#define WZ_OpenWindow(winhandle, newwin, ...) __WZ_OpenWindow(WizardBase, (winhandle), (newwin), __VA_ARGS__)
#endif

void __WZ_CloseWindow(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle)="\tjsr\t-60(a6)";
#define WZ_CloseWindow(winhandle) __WZ_CloseWindow(WizardBase, (winhandle))

void __WZ_FreeWindowHandle(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle)="\tjsr\t-66(a6)";
#define WZ_FreeWindowHandle(winhandle) __WZ_FreeWindowHandle(WizardBase, (winhandle))

void __WZ_LockWindow(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle)="\tjsr\t-72(a6)";
#define WZ_LockWindow(winhandle) __WZ_LockWindow(WizardBase, (winhandle))

ULONG __WZ_UnlockWindow(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle)="\tjsr\t-78(a6)";
#define WZ_UnlockWindow(winhandle) __WZ_UnlockWindow(WizardBase, (winhandle))

void __WZ_LockWindows(__reg("a6") void *, __reg("a0") APTR surface)="\tjsr\t-84(a6)";
#define WZ_LockWindows(surface) __WZ_LockWindows(WizardBase, (surface))

void __WZ_UnlockWindows(__reg("a6") void *, __reg("a0") APTR surface)="\tjsr\t-90(a6)";
#define WZ_UnlockWindows(surface) __WZ_UnlockWindows(WizardBase, (surface))

STRPTR __WZ_GadgetHelp(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * windowhandle, __reg("a1") APTR sfgadget)="\tjsr\t-96(a6)";
#define WZ_GadgetHelp(windowhandle, sfgadget) __WZ_GadgetHelp(WizardBase, (windowhandle), (sfgadget))

STRPTR __WZ_GadgetConfig(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * windowhandle, __reg("a1") struct Gadget * sfgadget)="\tjsr\t-102(a6)";
#define WZ_GadgetConfig(windowhandle, sfgadget) __WZ_GadgetConfig(WizardBase, (windowhandle), (sfgadget))

STRPTR __WZ_MenuHelp(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * windowhandle, __reg("d0") ULONG menucode)="\tjsr\t-108(a6)";
#define WZ_MenuHelp(windowhandle, menucode) __WZ_MenuHelp(WizardBase, (windowhandle), (menucode))

STRPTR __WZ_MenuConfig(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * windowhandle, __reg("d0") ULONG menucode)="\tjsr\t-114(a6)";
#define WZ_MenuConfig(windowhandle, menucode) __WZ_MenuConfig(WizardBase, (windowhandle), (menucode))

struct EasyStruct * __WZ_InitEasyStruct(__reg("a6") void *, __reg("a0") APTR surface, __reg("a1") struct EasyStruct * easystruct, __reg("d0") ULONG id, __reg("d1") ULONG size)="\tjsr\t-120(a6)";
#define WZ_InitEasyStruct(surface, easystruct, id, size) __WZ_InitEasyStruct(WizardBase, (surface), (easystruct), (id), (size))

BOOL __WZ_SnapShotA(__reg("a6") void *, __reg("a0") APTR surface, __reg("a1") struct TagItem * tagptr)="\tjsr\t-126(a6)";
#define WZ_SnapShotA(surface, tagptr) __WZ_SnapShotA(WizardBase, (surface), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __WZ_SnapShot(__reg("a6") void *, __reg("a0") APTR surface, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-126(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_SnapShot(surface, ...) __WZ_SnapShot(WizardBase, (surface), __VA_ARGS__)
#endif

BOOL __WZ_DrawVImageA(__reg("a6") void *, __reg("a0") struct WizardVImage * vimage, __reg("d0") WORD x, __reg("d1") WORD y, __reg("d2") WORD w, __reg("d3") WORD h, __reg("d4") WORD type, __reg("d5") struct RastPort * rp, __reg("d6") struct DrawInfo * drinfo, __reg("a1") struct TagItem * tagptr)="\tjsr\t-138(a6)";
#define WZ_DrawVImageA(vimage, x, y, w, h, type, rp, drinfo, tagptr) __WZ_DrawVImageA(WizardBase, (vimage), (x), (y), (w), (h), (type), (rp), (drinfo), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __WZ_DrawVImage(__reg("a6") void *, __reg("a0") struct WizardVImage * vimage, __reg("d0") WORD x, __reg("d1") WORD y, __reg("d2") WORD w, __reg("d3") WORD h, __reg("d4") WORD type, __reg("d5") struct RastPort * rp, __reg("d6") struct DrawInfo * drinfo, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-138(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_DrawVImage(vimage, x, y, w, h, type, rp, drinfo, ...) __WZ_DrawVImage(WizardBase, (vimage), (x), (y), (w), (h), (type), (rp), (drinfo), __VA_ARGS__)
#endif

LONG __WZ_EasyRequestArgs(__reg("a6") void *, __reg("a0") APTR surface, __reg("a1") struct Window * window, __reg("d0") ULONG id, __reg("a2") void * args)="\tjsr\t-144(a6)";
#define WZ_EasyRequestArgs(surface, window, id, args) __WZ_EasyRequestArgs(WizardBase, (surface), (window), (id), (args))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __WZ_EasyRequest(__reg("a6") void *, __reg("a0") APTR surface, __reg("a1") struct Window * window, __reg("d0") ULONG id, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-144(a6)\n\tmovea.l\t(a7)+,a2";
#define WZ_EasyRequest(surface, window, ...) __WZ_EasyRequest(WizardBase, (surface), (window), __VA_ARGS__)
#endif

struct WizardNode * __WZ_GetNode(__reg("a6") void *, __reg("a0") struct MinList * minlist, __reg("d0") ULONG nr)="\tjsr\t-150(a6)";
#define WZ_GetNode(minlist, nr) __WZ_GetNode(WizardBase, (minlist), (nr))

ULONG __WZ_ListCount(__reg("a6") void *, __reg("a0") struct MinList * list)="\tjsr\t-156(a6)";
#define WZ_ListCount(list) __WZ_ListCount(WizardBase, (list))

struct Gadget * __WZ_NewObjectA(__reg("a6") void *, __reg("a1") APTR surface, __reg("d0") ULONG d0arg, __reg("a0") struct TagItem * tagptr)="\tjsr\t-162(a6)";
#define WZ_NewObjectA(surface, d0arg, tagptr) __WZ_NewObjectA(WizardBase, (surface), (d0arg), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Gadget * __WZ_NewObject(__reg("a6") void *, __reg("a1") APTR surface, __reg("d0") ULONG d0arg, Tag tagptr, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-162(a6)\n\tmovea.l\t(a7)+,a0";
#define WZ_NewObject(surface, d0arg, ...) __WZ_NewObject(WizardBase, (surface), (d0arg), __VA_ARGS__)
#endif

BOOL __WZ_GadgetHelpMsg(__reg("a6") void *, __reg("a0") struct WizardWindowHandle * winhandle, __reg("a1") struct WizardWindowHandle ** winhaddress, __reg("a2") APTR * iaddress, __reg("d0") WORD MouseX, __reg("d1") WORD MouseY, __reg("d2") UWORD flags)="\tjsr\t-168(a6)";
#define WZ_GadgetHelpMsg(winhandle, winhaddress, iaddress, MouseX, MouseY, flags) __WZ_GadgetHelpMsg(WizardBase, (winhandle), (winhaddress), (iaddress), (MouseX), (MouseY), (flags))

BOOL __WZ_ObjectID(__reg("a6") void *, __reg("a0") APTR Surface, __reg("a2") ULONG * id, __reg("a1") STRPTR Objectname)="\tjsr\t-174(a6)";
#define WZ_ObjectID(Surface, id, Objectname) __WZ_ObjectID(WizardBase, (Surface), (id), (Objectname))

void __WZ_InitNodeA(__reg("a6") void *, __reg("a0") struct WizardNode * wizardnode, __reg("d0") ULONG entrys, __reg("a1") struct TagItem * tagptr)="\tjsr\t-180(a6)";
#define WZ_InitNodeA(wizardnode, entrys, tagptr) __WZ_InitNodeA(WizardBase, (wizardnode), (entrys), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __WZ_InitNode(__reg("a6") void *, __reg("a0") struct WizardNode * wizardnode, __reg("d0") ULONG entrys, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-180(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_InitNode(wizardnode, entrys, ...) __WZ_InitNode(WizardBase, (wizardnode), (entrys), __VA_ARGS__)
#endif

void __WZ_InitNodeEntryA(__reg("a6") void *, __reg("a0") struct WizardNode * wizardnode, __reg("d0") ULONG entry, __reg("a1") struct TagItem * tagptr)="\tjsr\t-186(a6)";
#define WZ_InitNodeEntryA(wizardnode, entry, tagptr) __WZ_InitNodeEntryA(WizardBase, (wizardnode), (entry), (tagptr))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __WZ_InitNodeEntry(__reg("a6") void *, __reg("a0") struct WizardNode * wizardnode, __reg("d0") ULONG entry, Tag tagptr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-186(a6)\n\tmovea.l\t(a7)+,a1";
#define WZ_InitNodeEntry(wizardnode, entry, ...) __WZ_InitNodeEntry(WizardBase, (wizardnode), (entry), __VA_ARGS__)
#endif

struct BitMap * __WZ_CreateImageBitMap(__reg("a6") void *, __reg("d0") UWORD TransPen, __reg("a0") struct DrawInfo * DrInfo, __reg("a1") struct WizardNewImage * newimage, __reg("a2") struct Screen * screen, __reg("a3") UBYTE * reg)="\tjsr\t-192(a6)";
#define WZ_CreateImageBitMap(TransPen, DrInfo, newimage, screen, reg) __WZ_CreateImageBitMap(WizardBase, (TransPen), (DrInfo), (newimage), (screen), (reg))

void __WZ_DeleteImageBitMap(__reg("a6") void *, __reg("a0") struct BitMap * bm, __reg("a1") struct WizardNewImage * newimage, __reg("a2") struct Screen * screen, __reg("a3") UBYTE * reg)="\tjsr\t-198(a6)";
#define WZ_DeleteImageBitMap(bm, newimage, screen, reg) __WZ_DeleteImageBitMap(WizardBase, (bm), (newimage), (screen), (reg))

APTR __WZ_GetDataAddress(__reg("a6") void *, __reg("a0") APTR surface, __reg("d0") ULONG Type, __reg("d1") ULONG ID)="\tjsr\t-204(a6)";
#define WZ_GetDataAddress(surface, Type, ID) __WZ_GetDataAddress(WizardBase, (surface), (Type), (ID))

#endif /*  _VBCCINLINE_WIZARD_H  */
