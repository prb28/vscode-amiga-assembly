#ifndef _VBCCINLINE_CYBERGRAPHICS_H
#define _VBCCINLINE_CYBERGRAPHICS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BOOL __IsCyberModeID(__reg("a6") void *, __reg("d0") ULONG displayID)="\tjsr\t-54(a6)";
#define IsCyberModeID(displayID) __IsCyberModeID(CyberGfxBase, (displayID))

ULONG __BestCModeIDTagList(__reg("a6") void *, __reg("a0") struct TagItem * BestModeIDTags)="\tjsr\t-60(a6)";
#define BestCModeIDTagList(BestModeIDTags) __BestCModeIDTagList(CyberGfxBase, (BestModeIDTags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __BestCModeIDTags(__reg("a6") void *, Tag BestModeIDTags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-60(a6)\n\tmovea.l\t(a7)+,a0";
#define BestCModeIDTags(...) __BestCModeIDTags(CyberGfxBase, __VA_ARGS__)
#endif

ULONG __CModeRequestTagList(__reg("a6") void *, __reg("a0") APTR ModeRequest, __reg("a1") struct TagItem * ModeRequestTags)="\tjsr\t-66(a6)";
#define CModeRequestTagList(ModeRequest, ModeRequestTags) __CModeRequestTagList(CyberGfxBase, (ModeRequest), (ModeRequestTags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __CModeRequestTags(__reg("a6") void *, __reg("a0") APTR ModeRequest, Tag ModeRequestTags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-66(a6)\n\tmovea.l\t(a7)+,a1";
#define CModeRequestTags(ModeRequest, ...) __CModeRequestTags(CyberGfxBase, (ModeRequest), __VA_ARGS__)
#endif

struct List * __AllocCModeListTagList(__reg("a6") void *, __reg("a1") struct TagItem * ModeListTags)="\tjsr\t-72(a6)";
#define AllocCModeListTagList(ModeListTags) __AllocCModeListTagList(CyberGfxBase, (ModeListTags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct List * __AllocCModeListTags(__reg("a6") void *, Tag ModeListTags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-72(a6)\n\tmovea.l\t(a7)+,a1";
#define AllocCModeListTags(...) __AllocCModeListTags(CyberGfxBase, __VA_ARGS__)
#endif

void __FreeCModeList(__reg("a6") void *, __reg("a0") struct List * ModeList)="\tjsr\t-78(a6)";
#define FreeCModeList(ModeList) __FreeCModeList(CyberGfxBase, (ModeList))

LONG __ScalePixelArray(__reg("a6") void *, __reg("a0") APTR srcRect, __reg("d0") UWORD SrcW, __reg("d1") UWORD SrcH, __reg("d2") UWORD SrcMod, __reg("a1") struct RastPort * a1arg, __reg("d3") UWORD DestX, __reg("d4") UWORD DestY, __reg("d5") UWORD DestW, __reg("d6") UWORD DestH, __reg("d7") UBYTE SrcFormat)="\tjsr\t-90(a6)";
#define ScalePixelArray(srcRect, SrcW, SrcH, SrcMod, a1arg, DestX, DestY, DestW, DestH, SrcFormat) __ScalePixelArray(CyberGfxBase, (srcRect), (SrcW), (SrcH), (SrcMod), (a1arg), (DestX), (DestY), (DestW), (DestH), (SrcFormat))

ULONG __GetCyberMapAttr(__reg("a6") void *, __reg("a0") struct BitMap * CyberGfxBitmap, __reg("d0") ULONG CyberAttrTag)="\tjsr\t-96(a6)";
#define GetCyberMapAttr(CyberGfxBitmap, CyberAttrTag) __GetCyberMapAttr(CyberGfxBase, (CyberGfxBitmap), (CyberAttrTag))

ULONG __GetCyberIDAttr(__reg("a6") void *, __reg("d0") ULONG CyberIDAttr, __reg("d1") ULONG CyberDisplayModeID)="\tjsr\t-102(a6)";
#define GetCyberIDAttr(CyberIDAttr, CyberDisplayModeID) __GetCyberIDAttr(CyberGfxBase, (CyberIDAttr), (CyberDisplayModeID))

ULONG __ReadRGBPixel(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") UWORD x, __reg("d1") UWORD y)="\tjsr\t-108(a6)";
#define ReadRGBPixel(a1arg, x, y) __ReadRGBPixel(CyberGfxBase, (a1arg), (x), (y))

LONG __WriteRGBPixel(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") UWORD x, __reg("d1") UWORD y, __reg("d2") ULONG argb)="\tjsr\t-114(a6)";
#define WriteRGBPixel(a1arg, x, y, argb) __WriteRGBPixel(CyberGfxBase, (a1arg), (x), (y), (argb))

ULONG __ReadPixelArray(__reg("a6") void *, __reg("a0") APTR destRect, __reg("d0") UWORD destX, __reg("d1") UWORD destY, __reg("d2") UWORD destMod, __reg("a1") struct RastPort * a1arg, __reg("d3") UWORD SrcX, __reg("d4") UWORD SrcY, __reg("d5") UWORD SizeX, __reg("d6") UWORD SizeY, __reg("d7") UBYTE DestFormat)="\tjsr\t-120(a6)";
#define ReadPixelArray(destRect, destX, destY, destMod, a1arg, SrcX, SrcY, SizeX, SizeY, DestFormat) __ReadPixelArray(CyberGfxBase, (destRect), (destX), (destY), (destMod), (a1arg), (SrcX), (SrcY), (SizeX), (SizeY), (DestFormat))

ULONG __WritePixelArray(__reg("a6") void *, __reg("a0") APTR srcRect, __reg("d0") UWORD SrcX, __reg("d1") UWORD SrcY, __reg("d2") UWORD SrcMod, __reg("a1") struct RastPort * a1arg, __reg("d3") UWORD DestX, __reg("d4") UWORD DestY, __reg("d5") UWORD SizeX, __reg("d6") UWORD SizeY, __reg("d7") UBYTE SrcFormat)="\tjsr\t-126(a6)";
#define WritePixelArray(srcRect, SrcX, SrcY, SrcMod, a1arg, DestX, DestY, SizeX, SizeY, SrcFormat) __WritePixelArray(CyberGfxBase, (srcRect), (SrcX), (SrcY), (SrcMod), (a1arg), (DestX), (DestY), (SizeX), (SizeY), (SrcFormat))

ULONG __MovePixelArray(__reg("a6") void *, __reg("d0") UWORD SrcX, __reg("d1") UWORD SrcY, __reg("a1") struct RastPort * a1arg, __reg("d2") UWORD DestX, __reg("d3") UWORD DestY, __reg("d4") UWORD SizeX, __reg("d5") UWORD SizeY)="\tjsr\t-132(a6)";
#define MovePixelArray(SrcX, SrcY, a1arg, DestX, DestY, SizeX, SizeY) __MovePixelArray(CyberGfxBase, (SrcX), (SrcY), (a1arg), (DestX), (DestY), (SizeX), (SizeY))

ULONG __InvertPixelArray(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") UWORD DestX, __reg("d1") UWORD DestY, __reg("d2") UWORD SizeX, __reg("d3") UWORD SizeY)="\tjsr\t-144(a6)";
#define InvertPixelArray(a1arg, DestX, DestY, SizeX, SizeY) __InvertPixelArray(CyberGfxBase, (a1arg), (DestX), (DestY), (SizeX), (SizeY))

ULONG __FillPixelArray(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") UWORD DestX, __reg("d1") UWORD DestY, __reg("d2") UWORD SizeX, __reg("d3") UWORD SizeY, __reg("d4") ULONG ARGB)="\tjsr\t-150(a6)";
#define FillPixelArray(a1arg, DestX, DestY, SizeX, SizeY, ARGB) __FillPixelArray(CyberGfxBase, (a1arg), (DestX), (DestY), (SizeX), (SizeY), (ARGB))

void __DoCDrawMethodTagList(__reg("a6") void *, __reg("a0") struct Hook * Hook, __reg("a1") struct RastPort * a1arg, __reg("a2") struct TagItem * TagList)="\tjsr\t-156(a6)";
#define DoCDrawMethodTagList(Hook, a1arg, TagList) __DoCDrawMethodTagList(CyberGfxBase, (Hook), (a1arg), (TagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __DoCDrawMethodTags(__reg("a6") void *, __reg("a0") struct Hook * Hook, __reg("a1") struct RastPort * a1arg, Tag TagList, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-156(a6)\n\tmovea.l\t(a7)+,a2";
#define DoCDrawMethodTags(Hook, a1arg, ...) __DoCDrawMethodTags(CyberGfxBase, (Hook), (a1arg), __VA_ARGS__)
#endif

void __CVideoCtrlTagList(__reg("a6") void *, __reg("a0") struct ViewPort * ViewPort, __reg("a1") struct TagItem * TagList)="\tjsr\t-162(a6)";
#define CVideoCtrlTagList(ViewPort, TagList) __CVideoCtrlTagList(CyberGfxBase, (ViewPort), (TagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __CVideoCtrlTags(__reg("a6") void *, __reg("a0") struct ViewPort * ViewPort, Tag TagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-162(a6)\n\tmovea.l\t(a7)+,a1";
#define CVideoCtrlTags(ViewPort, ...) __CVideoCtrlTags(CyberGfxBase, (ViewPort), __VA_ARGS__)
#endif

APTR __LockBitMapTagList(__reg("a6") void *, __reg("a0") APTR BitMap, __reg("a1") struct TagItem * TagList)="\tjsr\t-168(a6)";
#define LockBitMapTagList(BitMap, TagList) __LockBitMapTagList(CyberGfxBase, (BitMap), (TagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __LockBitMapTags(__reg("a6") void *, __reg("a0") APTR BitMap, Tag TagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-168(a6)\n\tmovea.l\t(a7)+,a1";
#define LockBitMapTags(BitMap, ...) __LockBitMapTags(CyberGfxBase, (BitMap), __VA_ARGS__)
#endif

void __UnLockBitMap(__reg("a6") void *, __reg("a0") APTR Handle)="\tjsr\t-174(a6)";
#define UnLockBitMap(Handle) __UnLockBitMap(CyberGfxBase, (Handle))

#endif /*  _VBCCINLINE_CYBERGRAPHICS_H  */
