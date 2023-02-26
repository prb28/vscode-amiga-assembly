#ifndef _VBCCINLINE_REQTOOLS_H
#define _VBCCINLINE_REQTOOLS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

APTR __rtAllocRequestA(__reg("a6") void *, __reg("d0") ULONG type, __reg("a0") struct TagItem * taglist)="\tjsr\t-30(a6)";
#define rtAllocRequestA(type, taglist) __rtAllocRequestA(ReqToolsBase, (type), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __rtAllocRequest(__reg("a6") void *, __reg("d0") ULONG type, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a0";
#define rtAllocRequest(type, ...) __rtAllocRequest(ReqToolsBase, (type), __VA_ARGS__)
#endif

void __rtFreeRequest(__reg("a6") void *, __reg("a1") APTR req)="\tjsr\t-36(a6)";
#define rtFreeRequest(req) __rtFreeRequest(ReqToolsBase, (req))

void __rtFreeReqBuffer(__reg("a6") void *, __reg("a1") APTR req)="\tjsr\t-42(a6)";
#define rtFreeReqBuffer(req) __rtFreeReqBuffer(ReqToolsBase, (req))

LONG __rtChangeReqAttrA(__reg("a6") void *, __reg("a1") APTR req, __reg("a0") struct TagItem * taglist)="\tjsr\t-48(a6)";
#define rtChangeReqAttrA(req, taglist) __rtChangeReqAttrA(ReqToolsBase, (req), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __rtChangeReqAttr(__reg("a6") void *, __reg("a1") APTR req, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a0";
#define rtChangeReqAttr(req, ...) __rtChangeReqAttr(ReqToolsBase, (req), __VA_ARGS__)
#endif

APTR __rtFileRequestA(__reg("a6") void *, __reg("a1") struct rtFileRequester * filereq, __reg("a2") char * file, __reg("a3") char * title, __reg("a0") struct TagItem * taglist)="\tjsr\t-54(a6)";
#define rtFileRequestA(filereq, file, title, taglist) __rtFileRequestA(ReqToolsBase, (filereq), (file), (title), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __rtFileRequest(__reg("a6") void *, __reg("a1") struct rtFileRequester * filereq, __reg("a2") char * file, __reg("a3") char * title, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a0";
#define rtFileRequest(filereq, file, title, ...) __rtFileRequest(ReqToolsBase, (filereq), (file), (title), __VA_ARGS__)
#endif

void __rtFreeFileList(__reg("a6") void *, __reg("a0") struct rtFileList * filelist)="\tjsr\t-60(a6)";
#define rtFreeFileList(filelist) __rtFreeFileList(ReqToolsBase, (filelist))

ULONG __rtEZRequestA(__reg("a6") void *, __reg("a1") char * bodyfmt, __reg("a2") char * gadfmt, __reg("a3") struct rtReqInfo * reqinfo, __reg("a4") APTR argarray, __reg("a0") struct TagItem * taglist)="\tjsr\t-66(a6)";
#define rtEZRequestA(bodyfmt, gadfmt, reqinfo, argarray, taglist) __rtEZRequestA(ReqToolsBase, (bodyfmt), (gadfmt), (reqinfo), (argarray), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtEZRequestTags(__reg("a6") void *, __reg("a1") char * bodyfmt, __reg("a2") char * gadfmt, __reg("a3") struct rtReqInfo * reqinfo, __reg("a4") APTR argarray, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-66(a6)\n\tmovea.l\t(a7)+,a0";
#define rtEZRequestTags(bodyfmt, gadfmt, reqinfo, argarray, ...) __rtEZRequestTags(ReqToolsBase, (bodyfmt), (gadfmt), (reqinfo), (argarray), __VA_ARGS__)
#endif

ULONG __rtGetStringA(__reg("a6") void *, __reg("a1") UBYTE * buffer, __reg("d0") ULONG maxchars, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, __reg("a0") struct TagItem * taglist)="\tjsr\t-72(a6)";
#define rtGetStringA(buffer, maxchars, title, reqinfo, taglist) __rtGetStringA(ReqToolsBase, (buffer), (maxchars), (title), (reqinfo), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtGetString(__reg("a6") void *, __reg("a1") UBYTE * buffer, __reg("d0") ULONG maxchars, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-72(a6)\n\tmovea.l\t(a7)+,a0";
#define rtGetString(buffer, maxchars, title, reqinfo, ...) __rtGetString(ReqToolsBase, (buffer), (maxchars), (title), (reqinfo), __VA_ARGS__)
#endif

ULONG __rtGetLongA(__reg("a6") void *, __reg("a1") ULONG * longptr, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, __reg("a0") struct TagItem * taglist)="\tjsr\t-78(a6)";
#define rtGetLongA(longptr, title, reqinfo, taglist) __rtGetLongA(ReqToolsBase, (longptr), (title), (reqinfo), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtGetLong(__reg("a6") void *, __reg("a1") ULONG * longptr, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-78(a6)\n\tmovea.l\t(a7)+,a0";
#define rtGetLong(longptr, title, reqinfo, ...) __rtGetLong(ReqToolsBase, (longptr), (title), (reqinfo), __VA_ARGS__)
#endif

ULONG __rtFontRequestA(__reg("a6") void *, __reg("a1") struct rtFontRequester * fontreq, __reg("a3") char * title, __reg("a0") struct TagItem * taglist)="\tjsr\t-96(a6)";
#define rtFontRequestA(fontreq, title, taglist) __rtFontRequestA(ReqToolsBase, (fontreq), (title), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtFontRequest(__reg("a6") void *, __reg("a1") struct rtFontRequester * fontreq, __reg("a3") char * title, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-96(a6)\n\tmovea.l\t(a7)+,a0";
#define rtFontRequest(fontreq, title, ...) __rtFontRequest(ReqToolsBase, (fontreq), (title), __VA_ARGS__)
#endif

LONG __rtPaletteRequestA(__reg("a6") void *, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, __reg("a0") struct TagItem * taglist)="\tjsr\t-102(a6)";
#define rtPaletteRequestA(title, reqinfo, taglist) __rtPaletteRequestA(ReqToolsBase, (title), (reqinfo), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __rtPaletteRequest(__reg("a6") void *, __reg("a2") char * title, __reg("a3") struct rtReqInfo * reqinfo, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-102(a6)\n\tmovea.l\t(a7)+,a0";
#define rtPaletteRequest(title, reqinfo, ...) __rtPaletteRequest(ReqToolsBase, (title), (reqinfo), __VA_ARGS__)
#endif

ULONG __rtReqHandlerA(__reg("a6") void *, __reg("a1") struct rtHandlerInfo * handlerinfo, __reg("d0") ULONG sigs, __reg("a0") struct TagItem * taglist)="\tjsr\t-108(a6)";
#define rtReqHandlerA(handlerinfo, sigs, taglist) __rtReqHandlerA(ReqToolsBase, (handlerinfo), (sigs), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtReqHandler(__reg("a6") void *, __reg("a1") struct rtHandlerInfo * handlerinfo, __reg("d0") ULONG sigs, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-108(a6)\n\tmovea.l\t(a7)+,a0";
#define rtReqHandler(handlerinfo, sigs, ...) __rtReqHandler(ReqToolsBase, (handlerinfo), (sigs), __VA_ARGS__)
#endif

void __rtSetWaitPointer(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-114(a6)";
#define rtSetWaitPointer(window) __rtSetWaitPointer(ReqToolsBase, (window))

ULONG __rtGetVScreenSize(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("a1") ULONG * widthptr, __reg("a2") ULONG * heightptr)="\tjsr\t-120(a6)";
#define rtGetVScreenSize(screen, widthptr, heightptr) __rtGetVScreenSize(ReqToolsBase, (screen), (widthptr), (heightptr))

void __rtSetReqPosition(__reg("a6") void *, __reg("d0") ULONG reqpos, __reg("a0") struct NewWindow * newwindow, __reg("a1") struct Screen * screen, __reg("a2") struct Window * window)="\tjsr\t-126(a6)";
#define rtSetReqPosition(reqpos, newwindow, screen, window) __rtSetReqPosition(ReqToolsBase, (reqpos), (newwindow), (screen), (window))

void __rtSpread(__reg("a6") void *, __reg("a0") ULONG * posarray, __reg("a1") ULONG * sizearray, __reg("d0") ULONG length, __reg("d1") ULONG min, __reg("d2") ULONG max, __reg("d3") ULONG num)="\tjsr\t-132(a6)";
#define rtSpread(posarray, sizearray, length, min, max, num) __rtSpread(ReqToolsBase, (posarray), (sizearray), (length), (min), (max), (num))

void __rtScreenToFrontSafely(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-138(a6)";
#define rtScreenToFrontSafely(screen) __rtScreenToFrontSafely(ReqToolsBase, (screen))

ULONG __rtScreenModeRequestA(__reg("a6") void *, __reg("a1") struct rtScreenModeRequester * screenmodereq, __reg("a3") char * title, __reg("a0") struct TagItem * taglist)="\tjsr\t-144(a6)";
#define rtScreenModeRequestA(screenmodereq, title, taglist) __rtScreenModeRequestA(ReqToolsBase, (screenmodereq), (title), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __rtScreenModeRequest(__reg("a6") void *, __reg("a1") struct rtScreenModeRequester * screenmodereq, __reg("a3") char * title, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-144(a6)\n\tmovea.l\t(a7)+,a0";
#define rtScreenModeRequest(screenmodereq, title, ...) __rtScreenModeRequest(ReqToolsBase, (screenmodereq), (title), __VA_ARGS__)
#endif

void __rtCloseWindowSafely(__reg("a6") void *, __reg("a0") struct Window * win)="\tjsr\t-150(a6)";
#define rtCloseWindowSafely(win) __rtCloseWindowSafely(ReqToolsBase, (win))

APTR __rtLockWindow(__reg("a6") void *, __reg("a0") struct Window * win)="\tjsr\t-156(a6)";
#define rtLockWindow(win) __rtLockWindow(ReqToolsBase, (win))

void __rtUnlockWindow(__reg("a6") void *, __reg("a0") struct Window * win, __reg("a1") APTR winlock)="\tjsr\t-162(a6)";
#define rtUnlockWindow(win, winlock) __rtUnlockWindow(ReqToolsBase, (win), (winlock))

#endif /*  _VBCCINLINE_REQTOOLS_H  */
