#ifndef _VBCCINLINE_CGXDITHER_H
#define _VBCCINLINE_CGXDITHER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

DITHERINFO __CreateDitherInfo(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct RastPort * rp, __reg("a2") ULONG   * rgbcm, __reg("d0") LONG size, __reg("d1") BOOL sharepens, __reg("d2") BOOL usecolour)="\tjsr\t-30(a6)";
#define CreateDitherInfo(vp, rp, rgbcm, size, sharepens, usecolour) __CreateDitherInfo(CGXDitherBase, (vp), (rp), (rgbcm), (size), (sharepens), (usecolour))

VOID __DeleteDitherInfo(__reg("a6") void *, __reg("a0") DITHERINFO ditherinfo)="\tjsr\t-36(a6)";
#define DeleteDitherInfo(ditherinfo) __DeleteDitherInfo(CGXDitherBase, (ditherinfo))

BOOL __SetDitherMode(__reg("a6") void *, __reg("a0") DITHERINFO ditherinfo, __reg("d0") ULONG mode)="\tjsr\t-42(a6)";
#define SetDitherMode(ditherinfo, mode) __SetDitherMode(CGXDitherBase, (ditherinfo), (mode))

BOOL __DitherMap(__reg("a6") void *, __reg("a0") struct BitMap * sbm, __reg("a1") struct BitMap * dbm, __reg("a2") DITHERINFO ditherinfo)="\tjsr\t-48(a6)";
#define DitherMap(sbm, dbm, ditherinfo) __DitherMap(CGXDitherBase, (sbm), (dbm), (ditherinfo))

BOOL __ConvertMap(__reg("a6") void *, __reg("a0") struct BitMap * sbm, __reg("a1") struct BitMap * dbm, __reg("d0") long left, __reg("d1") long top, __reg("d2") long width, __reg("d3") long height, __reg("d4") unsigned long flags)="\tjsr\t-54(a6)";
#define ConvertMap(sbm, dbm, left, top, width, height, flags) __ConvertMap(CGXDitherBase, (sbm), (dbm), (left), (top), (width), (height), (flags))

void __MapHistogram(__reg("a6") void *, __reg("a0") struct BitMap * bm, __reg("a1") ULONG  * histogram)="\tjsr\t-60(a6)";
#define MapHistogram(bm, histogram) __MapHistogram(CGXDitherBase, (bm), (histogram))

ULONG __RemapMapColours(__reg("a6") void *, __reg("a0") struct BitMap * sbm, __reg("a1") struct BitMap * dbm, __reg("a2") UBYTE  * remaparr1, __reg("a3") UBYTE  * remaparr2, __reg("a4") struct ColorMap * remapcm, __reg("d0") ULONG flags)="\tjsr\t-66(a6)";
#define RemapMapColours(sbm, dbm, remaparr1, remaparr2, remapcm, flags) __RemapMapColours(CGXDitherBase, (sbm), (dbm), (remaparr1), (remaparr2), (remapcm), (flags))

struct BitMap * __CreateMapMask(__reg("a6") void *, __reg("a0") struct BitMap * sbm, __reg("d0") ULONG transcol, __reg("d1") ULONG flags)="\tjsr\t-72(a6)";
#define CreateMapMask(sbm, transcol, flags) __CreateMapMask(CGXDitherBase, (sbm), (transcol), (flags))

void __FreeMapMask(__reg("a6") void *, __reg("a0") struct BitMap * maskbm)="\tjsr\t-78(a6)";
#define FreeMapMask(maskbm) __FreeMapMask(CGXDitherBase, (maskbm))

#endif /*  _VBCCINLINE_CGXDITHER_H  */
