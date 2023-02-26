#ifndef _VBCCINLINE_BULLET_H
#define _VBCCINLINE_BULLET_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct GlyphEngine * __OpenEngine(__reg("a6") void *)="\tjsr\t-30(a6)";
#define OpenEngine() __OpenEngine(BulletBase)

VOID __CloseEngine(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine)="\tjsr\t-36(a6)";
#define CloseEngine(glyphEngine) __CloseEngine(BulletBase, (glyphEngine))

ULONG __SetInfoA(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, __reg("a1") struct TagItem * tagList)="\tjsr\t-42(a6)";
#define SetInfoA(glyphEngine, tagList) __SetInfoA(BulletBase, (glyphEngine), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetInfo(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a1";
#define SetInfo(glyphEngine, ...) __SetInfo(BulletBase, (glyphEngine), __VA_ARGS__)
#endif

ULONG __ObtainInfoA(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, __reg("a1") struct TagItem * tagList)="\tjsr\t-48(a6)";
#define ObtainInfoA(glyphEngine, tagList) __ObtainInfoA(BulletBase, (glyphEngine), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __ObtainInfo(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define ObtainInfo(glyphEngine, ...) __ObtainInfo(BulletBase, (glyphEngine), __VA_ARGS__)
#endif

ULONG __ReleaseInfoA(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, __reg("a1") struct TagItem * tagList)="\tjsr\t-54(a6)";
#define ReleaseInfoA(glyphEngine, tagList) __ReleaseInfoA(BulletBase, (glyphEngine), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __ReleaseInfo(__reg("a6") void *, __reg("a0") struct GlyphEngine * glyphEngine, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define ReleaseInfo(glyphEngine, ...) __ReleaseInfo(BulletBase, (glyphEngine), __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_BULLET_H  */
