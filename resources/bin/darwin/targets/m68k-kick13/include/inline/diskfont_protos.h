#ifndef _VBCCINLINE_DISKFONT_H
#define _VBCCINLINE_DISKFONT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct TextFont * __OpenDiskFont(__reg("a6") void *, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-30(a6)";
#define OpenDiskFont(textAttr) __OpenDiskFont(DiskfontBase, (textAttr))

long __AvailFonts(__reg("a6") void *, __reg("a0") char * buffer, __reg("d0") long bufBytes, __reg("d1") long flags)="\tjsr\t-36(a6)";
#define AvailFonts(buffer, bufBytes, flags) __AvailFonts(DiskfontBase, (buffer), (bufBytes), (flags))

#endif /*  _VBCCINLINE_DISKFONT_H  */
