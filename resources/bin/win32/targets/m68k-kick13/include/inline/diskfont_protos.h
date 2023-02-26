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

#endif /*  _VBCCINLINE_DISKFONT_H  */
