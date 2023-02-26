#ifndef _VBCCINLINE_MUIMASTER_H
#define _VBCCINLINE_MUIMASTER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

Object * __MUI_NewObjectA(__reg("a6") void *, __reg("a0") char * a0arg, __reg("a1") struct TagItem * tags)="\tjsr\t-30(a6)";
#define MUI_NewObjectA(a0arg, tags) __MUI_NewObjectA(MUIMasterBase, (a0arg), (tags))

VOID __MUI_DisposeObject(__reg("a6") void *, __reg("a0") Object * obj)="\tjsr\t-36(a6)";
#define MUI_DisposeObject(obj) __MUI_DisposeObject(MUIMasterBase, (obj))

LONG __MUI_RequestA(__reg("a6") void *, __reg("d0") APTR app, __reg("d1") APTR win, __reg("d2") LONGBITS flags, __reg("a0") char * title, __reg("a1") char * gadgets, __reg("a2") char * format, __reg("a3") APTR params)="\tjsr\t-42(a6)";
#define MUI_RequestA(app, win, flags, title, gadgets, format, params) __MUI_RequestA(MUIMasterBase, (app), (win), (flags), (title), (gadgets), (format), (params))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __MUI_Request(__reg("a6") void *, __reg("d0") APTR app, __reg("d1") APTR win, __reg("d2") LONGBITS flags, __reg("a0") char * title, __reg("a1") char * gadgets, __reg("a2") char * format, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a3";
#define MUI_Request(app, win, flags, title, gadgets, ...) __MUI_Request(MUIMasterBase, (app), (win), (flags), (title), (gadgets), __VA_ARGS__)
#endif

APTR __MUI_AllocAslRequest(__reg("a6") void *, __reg("d0") unsigned long type, __reg("a0") struct TagItem * tags)="\tjsr\t-48(a6)";
#define MUI_AllocAslRequest(type, tags) __MUI_AllocAslRequest(MUIMasterBase, (type), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __MUI_AllocAslRequestTags(__reg("a6") void *, __reg("d0") unsigned long type, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a0";
#define MUI_AllocAslRequestTags(type, ...) __MUI_AllocAslRequestTags(MUIMasterBase, (type), __VA_ARGS__)
#endif

BOOL __MUI_AslRequest(__reg("a6") void *, __reg("a0") APTR req, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define MUI_AslRequest(req, tags) __MUI_AslRequest(MUIMasterBase, (req), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __MUI_AslRequestTags(__reg("a6") void *, __reg("a0") APTR req, Tag tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define MUI_AslRequestTags(req, ...) __MUI_AslRequestTags(MUIMasterBase, (req), __VA_ARGS__)
#endif

VOID __MUI_FreeAslRequest(__reg("a6") void *, __reg("a0") APTR req)="\tjsr\t-60(a6)";
#define MUI_FreeAslRequest(req) __MUI_FreeAslRequest(MUIMasterBase, (req))

LONG __MUI_Error(__reg("a6") void *)="\tjsr\t-66(a6)";
#define MUI_Error() __MUI_Error(MUIMasterBase)

LONG __MUI_SetError(__reg("a6") void *, __reg("d0") LONG errnum)="\tjsr\t-72(a6)";
#define MUI_SetError(errnum) __MUI_SetError(MUIMasterBase, (errnum))

struct IClass * __MUI_GetClass(__reg("a6") void *, __reg("a0") char * name)="\tjsr\t-78(a6)";
#define MUI_GetClass(name) __MUI_GetClass(MUIMasterBase, (name))

VOID __MUI_FreeClass(__reg("a6") void *, __reg("a0") struct IClass * cl)="\tjsr\t-84(a6)";
#define MUI_FreeClass(cl) __MUI_FreeClass(MUIMasterBase, (cl))

VOID __MUI_RequestIDCMP(__reg("a6") void *, __reg("a0") Object * obj, __reg("d0") ULONG flags)="\tjsr\t-90(a6)";
#define MUI_RequestIDCMP(obj, flags) __MUI_RequestIDCMP(MUIMasterBase, (obj), (flags))

VOID __MUI_RejectIDCMP(__reg("a6") void *, __reg("a0") Object * obj, __reg("d0") ULONG flags)="\tjsr\t-96(a6)";
#define MUI_RejectIDCMP(obj, flags) __MUI_RejectIDCMP(MUIMasterBase, (obj), (flags))

VOID __MUI_Redraw(__reg("a6") void *, __reg("a0") Object * obj, __reg("d0") ULONG flags)="\tjsr\t-102(a6)";
#define MUI_Redraw(obj, flags) __MUI_Redraw(MUIMasterBase, (obj), (flags))

struct MUI_CustomClass * __MUI_CreateCustomClass(__reg("a6") void *, __reg("a0") struct Library * base, __reg("a1") char * supername, __reg("a2") struct MUI_CustomClass * supermcc, __reg("d0") int datasize, __reg("a3") APTR dispatcher)="\tjsr\t-108(a6)";
#define MUI_CreateCustomClass(base, supername, supermcc, datasize, dispatcher) __MUI_CreateCustomClass(MUIMasterBase, (base), (supername), (supermcc), (datasize), (dispatcher))

BOOL __MUI_DeleteCustomClass(__reg("a6") void *, __reg("a0") struct MUI_CustomClass * mcc)="\tjsr\t-114(a6)";
#define MUI_DeleteCustomClass(mcc) __MUI_DeleteCustomClass(MUIMasterBase, (mcc))

Object * __MUI_MakeObjectA(__reg("a6") void *, __reg("d0") LONG type, __reg("a0") ULONG * params)="\tjsr\t-120(a6)";
#define MUI_MakeObjectA(type, params) __MUI_MakeObjectA(MUIMasterBase, (type), (params))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
Object * __MUI_MakeObject(__reg("a6") void *, __reg("d0") LONG type, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-120(a6)\n\tmovea.l\t(a7)+,a0";
#define MUI_MakeObject(...) __MUI_MakeObject(MUIMasterBase, __VA_ARGS__)
#endif

BOOL __MUI_Layout(__reg("a6") void *, __reg("a0") Object * obj, __reg("d0") LONG l, __reg("d1") LONG t, __reg("d2") LONG w, __reg("d3") LONG h, __reg("d4") ULONG flags)="\tjsr\t-126(a6)";
#define MUI_Layout(obj, l, t, w, h, flags) __MUI_Layout(MUIMasterBase, (obj), (l), (t), (w), (h), (flags))

LONG __MUI_ObtainPen(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("a1") struct MUI_PenSpec * spec, __reg("d0") ULONG flags)="\tjsr\t-156(a6)";
#define MUI_ObtainPen(mri, spec, flags) __MUI_ObtainPen(MUIMasterBase, (mri), (spec), (flags))

VOID __MUI_ReleasePen(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("d0") LONG pen)="\tjsr\t-162(a6)";
#define MUI_ReleasePen(mri, pen) __MUI_ReleasePen(MUIMasterBase, (mri), (pen))

APTR __MUI_AddClipping(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("d0") WORD l, __reg("d1") WORD t, __reg("d2") WORD w, __reg("d3") WORD h)="\tjsr\t-168(a6)";
#define MUI_AddClipping(mri, l, t, w, h) __MUI_AddClipping(MUIMasterBase, (mri), (l), (t), (w), (h))

VOID __MUI_RemoveClipping(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("a1") APTR h)="\tjsr\t-174(a6)";
#define MUI_RemoveClipping(mri, h) __MUI_RemoveClipping(MUIMasterBase, (mri), (h))

APTR __MUI_AddClipRegion(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("a1") struct Region * region)="\tjsr\t-180(a6)";
#define MUI_AddClipRegion(mri, region) __MUI_AddClipRegion(MUIMasterBase, (mri), (region))

VOID __MUI_RemoveClipRegion(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("a1") APTR region)="\tjsr\t-186(a6)";
#define MUI_RemoveClipRegion(mri, region) __MUI_RemoveClipRegion(MUIMasterBase, (mri), (region))

BOOL __MUI_BeginRefresh(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("d0") ULONG flags)="\tjsr\t-192(a6)";
#define MUI_BeginRefresh(mri, flags) __MUI_BeginRefresh(MUIMasterBase, (mri), (flags))

VOID __MUI_EndRefresh(__reg("a6") void *, __reg("a0") struct MUI_RenderInfo * mri, __reg("d0") ULONG flags)="\tjsr\t-198(a6)";
#define MUI_EndRefresh(mri, flags) __MUI_EndRefresh(MUIMasterBase, (mri), (flags))

#endif /*  _VBCCINLINE_MUIMASTER_H  */
