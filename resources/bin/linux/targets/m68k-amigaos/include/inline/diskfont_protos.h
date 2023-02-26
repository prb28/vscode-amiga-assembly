#ifndef _VBCCINLINE_DISKFONT_H
#define _VBCCINLINE_DISKFONT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct TextFont * __OpenDiskFont(__reg("a6") void *, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-30(a6)";
#define OpenDiskFont(textAttr) __OpenDiskFont(DiskfontBase, (textAttr))

LONG __AvailFonts(__reg("a6") void *, __reg("a0") STRPTR buffer, __reg("d0") LONG bufBytes, __reg("d1") LONG flags)="\tjsr\t-36(a6)";
#define AvailFonts(buffer, bufBytes, flags) __AvailFonts(DiskfontBase, (buffer), (bufBytes), (flags))

struct FontContentsHeader * __NewFontContents(__reg("a6") void *, __reg("a0") void * fontsLock, __reg("a1") STRPTR fontName)="\tjsr\t-42(a6)";
#define NewFontContents(fontsLock, fontName) __NewFontContents(DiskfontBase, (void *)(fontsLock), (fontName))

VOID __DisposeFontContents(__reg("a6") void *, __reg("a1") struct FontContentsHeader * fontContentsHeader)="\tjsr\t-48(a6)";
#define DisposeFontContents(fontContentsHeader) __DisposeFontContents(DiskfontBase, (fontContentsHeader))

struct DiskFont * __NewScaledDiskFont(__reg("a6") void *, __reg("a0") struct TextFont * sourceFont, __reg("a1") struct TextAttr * destTextAttr)="\tjsr\t-54(a6)";
#define NewScaledDiskFont(sourceFont, destTextAttr) __NewScaledDiskFont(DiskfontBase, (sourceFont), (destTextAttr))

LONG __GetDiskFontCtrl(__reg("a6") void *, __reg("d0") LONG tagid)="\tjsr\t-60(a6)";
#define GetDiskFontCtrl(tagid) __GetDiskFontCtrl(DiskfontBase, (tagid))

VOID __SetDiskFontCtrlA(__reg("a6") void *, __reg("a0") struct TagItem * taglist)="\tjsr\t-66(a6)";
#define SetDiskFontCtrlA(taglist) __SetDiskFontCtrlA(DiskfontBase, (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetDiskFontCtrl(__reg("a6") void *, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-66(a6)\n\tmovea.l\t(a7)+,a0";
#define SetDiskFontCtrl(...) __SetDiskFontCtrl(DiskfontBase, __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_DISKFONT_H  */
