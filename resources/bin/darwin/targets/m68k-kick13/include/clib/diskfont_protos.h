/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct TextFont, struct TextAttr */
#ifndef GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif

#ifndef LIBRARIES_DISKFONT_H
#include <libraries/diskfont.h>
#endif

extern struct Library *DiskfontBase;
struct TextFont *OpenDiskFont(struct TextAttr *);
long AvailFonts(char *, long, long);
