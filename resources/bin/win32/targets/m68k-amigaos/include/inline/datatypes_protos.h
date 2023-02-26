#ifndef _VBCCINLINE_DATATYPES_H
#define _VBCCINLINE_DATATYPES_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct DataType * __ObtainDataTypeA(__reg("a6") void *, __reg("d0") ULONG type, __reg("a0") APTR handle, __reg("a1") struct TagItem * attrs)="\tjsr\t-36(a6)";
#define ObtainDataTypeA(type, handle, attrs) __ObtainDataTypeA(DataTypesBase, (type), (handle), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct DataType * __ObtainDataType(__reg("a6") void *, __reg("d0") ULONG type, __reg("a0") APTR handle, Tag attrs, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a1";
#define ObtainDataType(type, handle, ...) __ObtainDataType(DataTypesBase, (type), (handle), __VA_ARGS__)
#endif

VOID __ReleaseDataType(__reg("a6") void *, __reg("a0") struct DataType * dt)="\tjsr\t-42(a6)";
#define ReleaseDataType(dt) __ReleaseDataType(DataTypesBase, (dt))

Object * __NewDTObjectA(__reg("a6") void *, __reg("d0") APTR name, __reg("a0") struct TagItem * attrs)="\tjsr\t-48(a6)";
#define NewDTObjectA(name, attrs) __NewDTObjectA(DataTypesBase, (name), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
Object * __NewDTObject(__reg("a6") void *, __reg("d0") APTR name, Tag attrs, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a0";
#define NewDTObject(name, ...) __NewDTObject(DataTypesBase, (name), __VA_ARGS__)
#endif

VOID __DisposeDTObject(__reg("a6") void *, __reg("a0") Object * o)="\tjsr\t-54(a6)";
#define DisposeDTObject(o) __DisposeDTObject(DataTypesBase, (o))

ULONG __SetDTAttrsA(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") struct TagItem * attrs)="\tjsr\t-60(a6)";
#define SetDTAttrsA(o, win, req, attrs) __SetDTAttrsA(DataTypesBase, (o), (win), (req), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetDTAttrs(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, Tag attrs, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-60(a6)\n\tmovea.l\t(a7)+,a3";
#define SetDTAttrs(o, win, req, ...) __SetDTAttrs(DataTypesBase, (o), (win), (req), __VA_ARGS__)
#endif

ULONG __GetDTAttrsA(__reg("a6") void *, __reg("a0") Object * o, __reg("a2") struct TagItem * attrs)="\tjsr\t-66(a6)";
#define GetDTAttrsA(o, attrs) __GetDTAttrsA(DataTypesBase, (o), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetDTAttrs(__reg("a6") void *, __reg("a0") Object * o, Tag attrs, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-66(a6)\n\tmovea.l\t(a7)+,a2";
#define GetDTAttrs(o, ...) __GetDTAttrs(DataTypesBase, (o), __VA_ARGS__)
#endif

LONG __AddDTObject(__reg("a6") void *, __reg("a0") struct Window * win, __reg("a1") struct Requester * req, __reg("a2") Object * o, __reg("d0") LONG pos)="\tjsr\t-72(a6)";
#define AddDTObject(win, req, o, pos) __AddDTObject(DataTypesBase, (win), (req), (o), (pos))

VOID __RefreshDTObjectA(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") struct TagItem * attrs)="\tjsr\t-78(a6)";
#define RefreshDTObjectA(o, win, req, attrs) __RefreshDTObjectA(DataTypesBase, (o), (win), (req), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __RefreshDTObject(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, Tag attrs, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-78(a6)\n\tmovea.l\t(a7)+,a3";
#define RefreshDTObject(o, win, req, ...) __RefreshDTObject(DataTypesBase, (o), (win), (req), __VA_ARGS__)
#endif

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
#define RefreshDTObjects(o, win, req, attrs) __RefreshDTObjectA(DataTypesBase, (o), (win), (req), (attrs))
#endif

ULONG __DoAsyncLayout(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct gpLayout * gpl)="\tjsr\t-84(a6)";
#define DoAsyncLayout(o, gpl) __DoAsyncLayout(DataTypesBase, (o), (gpl))

ULONG __DoDTMethodA(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") Msg msg)="\tjsr\t-90(a6)";
#define DoDTMethodA(o, win, req, msg) __DoDTMethodA(DataTypesBase, (o), (win), (req), (msg))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __DoDTMethod(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, ULONG msg, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-90(a6)\n\tmovea.l\t(a7)+,a3";
#define DoDTMethod(o, win, req, ...) __DoDTMethod(DataTypesBase, (o), (win), (req), __VA_ARGS__)
#endif

LONG __RemoveDTObject(__reg("a6") void *, __reg("a0") struct Window * win, __reg("a1") Object * o)="\tjsr\t-96(a6)";
#define RemoveDTObject(win, o) __RemoveDTObject(DataTypesBase, (win), (o))

ULONG * __GetDTMethods(__reg("a6") void *, __reg("a0") Object * object)="\tjsr\t-102(a6)";
#define GetDTMethods(object) __GetDTMethods(DataTypesBase, (object))

struct DTMethods * __GetDTTriggerMethods(__reg("a6") void *, __reg("a0") Object * object)="\tjsr\t-108(a6)";
#define GetDTTriggerMethods(object) __GetDTTriggerMethods(DataTypesBase, (object))

ULONG __PrintDTObjectA(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * w, __reg("a2") struct Requester * r, __reg("a3") struct dtPrint * msg)="\tjsr\t-114(a6)";
#define PrintDTObjectA(o, w, r, msg) __PrintDTObjectA(DataTypesBase, (o), (w), (r), (msg))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __PrintDTObject(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct Window * w, __reg("a2") struct Requester * r, ULONG msg, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-114(a6)\n\tmovea.l\t(a7)+,a3";
#define PrintDTObject(o, w, r, ...) __PrintDTObject(DataTypesBase, (o), (w), (r), __VA_ARGS__)
#endif

APTR __ObtainDTDrawInfoA(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") struct TagItem * attrs)="\tjsr\t-120(a6)";
#define ObtainDTDrawInfoA(o, attrs) __ObtainDTDrawInfoA(DataTypesBase, (o), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __ObtainDTDrawInfo(__reg("a6") void *, __reg("a0") Object * o, Tag attrs, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-120(a6)\n\tmovea.l\t(a7)+,a1";
#define ObtainDTDrawInfo(o, ...) __ObtainDTDrawInfo(DataTypesBase, (o), __VA_ARGS__)
#endif

LONG __DrawDTObjectA(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") Object * o, __reg("d0") LONG x, __reg("d1") LONG y, __reg("d2") LONG w, __reg("d3") LONG h, __reg("d4") LONG th, __reg("d5") LONG tv, __reg("a2") struct TagItem * attrs)="\tjsr\t-126(a6)";
#define DrawDTObjectA(rp, o, x, y, w, h, th, tv, attrs) __DrawDTObjectA(DataTypesBase, (rp), (o), (x), (y), (w), (h), (th), (tv), (attrs))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __DrawDTObject(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") Object * o, __reg("d0") LONG x, __reg("d1") LONG y, __reg("d2") LONG w, __reg("d3") LONG h, __reg("d4") LONG th, __reg("d5") LONG tv, Tag attrs, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-126(a6)\n\tmovea.l\t(a7)+,a2";
#define DrawDTObject(rp, o, x, y, w, h, th, tv, ...) __DrawDTObject(DataTypesBase, (rp), (o), (x), (y), (w), (h), (th), (tv), __VA_ARGS__)
#endif

VOID __ReleaseDTDrawInfo(__reg("a6") void *, __reg("a0") Object * o, __reg("a1") APTR handle)="\tjsr\t-132(a6)";
#define ReleaseDTDrawInfo(o, handle) __ReleaseDTDrawInfo(DataTypesBase, (o), (handle))

STRPTR __GetDTString(__reg("a6") void *, __reg("d0") ULONG id)="\tjsr\t-138(a6)";
#define GetDTString(id) __GetDTString(DataTypesBase, (id))

#endif /*  _VBCCINLINE_DATATYPES_H  */
