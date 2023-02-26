#ifndef _VBCCINLINE_GRAPHICS_H
#define _VBCCINLINE_GRAPHICS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __BltBitMap(__reg("a6") void *, __reg("a0") CONST struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct BitMap * destBitMap, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm, __reg("d7") ULONG mask, __reg("a2") PLANEPTR tempA)="\tjsr\t-30(a6)";
#define BltBitMap(srcBitMap, xSrc, ySrc, destBitMap, xDest, yDest, xSize, ySize, minterm, mask, tempA) __BltBitMap(GfxBase, (srcBitMap), (xSrc), (ySrc), (destBitMap), (xDest), (yDest), (xSize), (ySize), (minterm), (mask), (tempA))

VOID __BltTemplate(__reg("a6") void *, __reg("a0") CONST PLANEPTR source, __reg("d0") LONG xSrc, __reg("d1") LONG srcMod, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize)="\tjsr\t-36(a6)";
#define BltTemplate(source, xSrc, srcMod, destRP, xDest, yDest, xSize, ySize) __BltTemplate(GfxBase, (source), (xSrc), (srcMod), (destRP), (xDest), (yDest), (xSize), (ySize))

VOID __ClearEOL(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-42(a6)";
#define ClearEOL(rp) __ClearEOL(GfxBase, (rp))

VOID __ClearScreen(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-48(a6)";
#define ClearScreen(rp) __ClearScreen(GfxBase, (rp))

WORD __TextLength(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST_STRPTR string, __reg("d0") ULONG count)="\tjsr\t-54(a6)";
#define TextLength(rp, string, count) __TextLength(GfxBase, (rp), (string), (count))

LONG __Text(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST_STRPTR string, __reg("d0") ULONG count)="\tjsr\t-60(a6)";
#define Text(rp, string, count) __Text(GfxBase, (rp), (string), (count))

LONG __SetFont(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST struct TextFont * textFont)="\tjsr\t-66(a6)";
#define SetFont(rp, textFont) __SetFont(GfxBase, (rp), (textFont))

struct TextFont * __OpenFont(__reg("a6") void *, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-72(a6)";
#define OpenFont(textAttr) __OpenFont(GfxBase, (textAttr))

VOID __CloseFont(__reg("a6") void *, __reg("a1") struct TextFont * textFont)="\tjsr\t-78(a6)";
#define CloseFont(textFont) __CloseFont(GfxBase, (textFont))

ULONG __AskSoftStyle(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-84(a6)";
#define AskSoftStyle(rp) __AskSoftStyle(GfxBase, (rp))

ULONG __SetSoftStyle(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG style, __reg("d1") ULONG enable)="\tjsr\t-90(a6)";
#define SetSoftStyle(rp, style, enable) __SetSoftStyle(GfxBase, (rp), (style), (enable))

VOID __AddBob(__reg("a6") void *, __reg("a0") struct Bob * bob, __reg("a1") struct RastPort * rp)="\tjsr\t-96(a6)";
#define AddBob(bob, rp) __AddBob(GfxBase, (bob), (rp))

VOID __AddVSprite(__reg("a6") void *, __reg("a0") struct VSprite * vSprite, __reg("a1") struct RastPort * rp)="\tjsr\t-102(a6)";
#define AddVSprite(vSprite, rp) __AddVSprite(GfxBase, (vSprite), (rp))

VOID __DoCollision(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-108(a6)";
#define DoCollision(rp) __DoCollision(GfxBase, (rp))

VOID __DrawGList(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") struct ViewPort * vp)="\tjsr\t-114(a6)";
#define DrawGList(rp, vp) __DrawGList(GfxBase, (rp), (vp))

VOID __InitGels(__reg("a6") void *, __reg("a0") struct VSprite * head, __reg("a1") struct VSprite * tail, __reg("a2") struct GelsInfo * gelsInfo)="\tjsr\t-120(a6)";
#define InitGels(head, tail, gelsInfo) __InitGels(GfxBase, (head), (tail), (gelsInfo))

VOID __InitMasks(__reg("a6") void *, __reg("a0") struct VSprite * vSprite)="\tjsr\t-126(a6)";
#define InitMasks(vSprite) __InitMasks(GfxBase, (vSprite))

VOID __RemIBob(__reg("a6") void *, __reg("a0") struct Bob * bob, __reg("a1") struct RastPort * rp, __reg("a2") struct ViewPort * vp)="\tjsr\t-132(a6)";
#define RemIBob(bob, rp, vp) __RemIBob(GfxBase, (bob), (rp), (vp))

VOID __RemVSprite(__reg("a6") void *, __reg("a0") struct VSprite * vSprite)="\tjsr\t-138(a6)";
#define RemVSprite(vSprite) __RemVSprite(GfxBase, (vSprite))

VOID __SetCollision(__reg("a6") void *, __reg("d0") ULONG num, __reg("a0") VOID (*routine)(struct VSprite *gelA, struct VSprite *gelB), __reg("a1") struct GelsInfo * gelsInfo)="\tjsr\t-144(a6)";
#define SetCollision(num, routine, gelsInfo) __SetCollision(GfxBase, (num), (routine), (gelsInfo))

VOID __SortGList(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-150(a6)";
#define SortGList(rp) __SortGList(GfxBase, (rp))

VOID __AddAnimOb(__reg("a6") void *, __reg("a0") struct AnimOb * anOb, __reg("a1") struct AnimOb ** anKey, __reg("a2") struct RastPort * rp)="\tjsr\t-156(a6)";
#define AddAnimOb(anOb, anKey, rp) __AddAnimOb(GfxBase, (anOb), (anKey), (rp))

VOID __Animate(__reg("a6") void *, __reg("a0") struct AnimOb ** anKey, __reg("a1") struct RastPort * rp)="\tjsr\t-162(a6)";
#define Animate(anKey, rp) __Animate(GfxBase, (anKey), (rp))

BOOL __GetGBuffers(__reg("a6") void *, __reg("a0") struct AnimOb * anOb, __reg("a1") struct RastPort * rp, __reg("d0") LONG flag)="\tjsr\t-168(a6)";
#define GetGBuffers(anOb, rp, flag) __GetGBuffers(GfxBase, (anOb), (rp), (flag))

VOID __InitGMasks(__reg("a6") void *, __reg("a0") struct AnimOb * anOb)="\tjsr\t-174(a6)";
#define InitGMasks(anOb) __InitGMasks(GfxBase, (anOb))

VOID __DrawEllipse(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG xCenter, __reg("d1") LONG yCenter, __reg("d2") LONG a, __reg("d3") LONG b)="\tjsr\t-180(a6)";
#define DrawEllipse(rp, xCenter, yCenter, a, b) __DrawEllipse(GfxBase, (rp), (xCenter), (yCenter), (a), (b))

LONG __AreaEllipse(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG xCenter, __reg("d1") LONG yCenter, __reg("d2") LONG a, __reg("d3") LONG b)="\tjsr\t-186(a6)";
#define AreaEllipse(rp, xCenter, yCenter, a, b) __AreaEllipse(GfxBase, (rp), (xCenter), (yCenter), (a), (b))

VOID __LoadRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") CONST UWORD * colors, __reg("d0") LONG count)="\tjsr\t-192(a6)";
#define LoadRGB4(vp, colors, count) __LoadRGB4(GfxBase, (vp), (colors), (count))

VOID __InitRastPort(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-198(a6)";
#define InitRastPort(rp) __InitRastPort(GfxBase, (rp))

VOID __InitVPort(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-204(a6)";
#define InitVPort(vp) __InitVPort(GfxBase, (vp))

ULONG __MrgCop(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-210(a6)";
#define MrgCop(view) __MrgCop(GfxBase, (view))

ULONG __MakeVPort(__reg("a6") void *, __reg("a0") struct View * view, __reg("a1") struct ViewPort * vp)="\tjsr\t-216(a6)";
#define MakeVPort(view, vp) __MakeVPort(GfxBase, (view), (vp))

VOID __LoadView(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-222(a6)";
#define LoadView(view) __LoadView(GfxBase, (view))

VOID __WaitBlit(__reg("a6") void *)="\tjsr\t-228(a6)";
#define WaitBlit() __WaitBlit(GfxBase)

VOID __SetRast(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG pen)="\tjsr\t-234(a6)";
#define SetRast(rp, pen) __SetRast(GfxBase, (rp), (pen))

VOID __Move(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-240(a6)";
#define Move(rp, x, y) __Move(GfxBase, (rp), (x), (y))

VOID __Draw(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-246(a6)";
#define Draw(rp, x, y) __Draw(GfxBase, (rp), (x), (y))

LONG __AreaMove(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-252(a6)";
#define AreaMove(rp, x, y) __AreaMove(GfxBase, (rp), (x), (y))

LONG __AreaDraw(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-258(a6)";
#define AreaDraw(rp, x, y) __AreaDraw(GfxBase, (rp), (x), (y))

LONG __AreaEnd(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-264(a6)";
#define AreaEnd(rp) __AreaEnd(GfxBase, (rp))

VOID __WaitTOF(__reg("a6") void *)="\tjsr\t-270(a6)";
#define WaitTOF() __WaitTOF(GfxBase)

VOID __QBlit(__reg("a6") void *, __reg("a1") struct bltnode * blit)="\tjsr\t-276(a6)";
#define QBlit(blit) __QBlit(GfxBase, (blit))

VOID __InitArea(__reg("a6") void *, __reg("a0") struct AreaInfo * areaInfo, __reg("a1") APTR vectorBuffer, __reg("d0") LONG maxVectors)="\tjsr\t-282(a6)";
#define InitArea(areaInfo, vectorBuffer, maxVectors) __InitArea(GfxBase, (areaInfo), (vectorBuffer), (maxVectors))

VOID __SetRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("d0") LONG index, __reg("d1") ULONG red, __reg("d2") ULONG green, __reg("d3") ULONG blue)="\tjsr\t-288(a6)";
#define SetRGB4(vp, index, red, green, blue) __SetRGB4(GfxBase, (vp), (index), (red), (green), (blue))

VOID __QBSBlit(__reg("a6") void *, __reg("a1") struct bltnode * blit)="\tjsr\t-294(a6)";
#define QBSBlit(blit) __QBSBlit(GfxBase, (blit))

VOID __BltClear(__reg("a6") void *, __reg("a1") PLANEPTR memBlock, __reg("d0") ULONG byteCount, __reg("d1") ULONG flags)="\tjsr\t-300(a6)";
#define BltClear(memBlock, byteCount, flags) __BltClear(GfxBase, (memBlock), (byteCount), (flags))

VOID __RectFill(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG xMin, __reg("d1") LONG yMin, __reg("d2") LONG xMax, __reg("d3") LONG yMax)="\tjsr\t-306(a6)";
#define RectFill(rp, xMin, yMin, xMax, yMax) __RectFill(GfxBase, (rp), (xMin), (yMin), (xMax), (yMax))

VOID __BltPattern(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST PLANEPTR mask, __reg("d0") LONG xMin, __reg("d1") LONG yMin, __reg("d2") LONG xMax, __reg("d3") LONG yMax, __reg("d4") ULONG maskBPR)="\tjsr\t-312(a6)";
#define BltPattern(rp, mask, xMin, yMin, xMax, yMax, maskBPR) __BltPattern(GfxBase, (rp), (mask), (xMin), (yMin), (xMax), (yMax), (maskBPR))

ULONG __ReadPixel(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-318(a6)";
#define ReadPixel(rp, x, y) __ReadPixel(GfxBase, (rp), (x), (y))

LONG __WritePixel(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-324(a6)";
#define WritePixel(rp, x, y) __WritePixel(GfxBase, (rp), (x), (y))

BOOL __Flood(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d2") ULONG mode, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-330(a6)";
#define Flood(rp, mode, x, y) __Flood(GfxBase, (rp), (mode), (x), (y))

VOID __PolyDraw(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG count, __reg("a0") CONST WORD * polyTable)="\tjsr\t-336(a6)";
#define PolyDraw(rp, count, polyTable) __PolyDraw(GfxBase, (rp), (count), (polyTable))

VOID __SetAPen(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG pen)="\tjsr\t-342(a6)";
#define SetAPen(rp, pen) __SetAPen(GfxBase, (rp), (pen))

VOID __SetBPen(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG pen)="\tjsr\t-348(a6)";
#define SetBPen(rp, pen) __SetBPen(GfxBase, (rp), (pen))

VOID __SetDrMd(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG drawMode)="\tjsr\t-354(a6)";
#define SetDrMd(rp, drawMode) __SetDrMd(GfxBase, (rp), (drawMode))

VOID __InitView(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-360(a6)";
#define InitView(view) __InitView(GfxBase, (view))

VOID __CBump(__reg("a6") void *, __reg("a1") struct UCopList * copList)="\tjsr\t-366(a6)";
#define CBump(copList) __CBump(GfxBase, (copList))

VOID __CMove(__reg("a6") void *, __reg("a1") struct UCopList * copList, __reg("d0") APTR destination, __reg("d1") LONG data)="\tjsr\t-372(a6)";
#define CMove(copList, destination, data) __CMove(GfxBase, (copList), (destination), (data))

VOID __CWait(__reg("a6") void *, __reg("a1") struct UCopList * copList, __reg("d0") LONG v, __reg("d1") LONG h)="\tjsr\t-378(a6)";
#define CWait(copList, v, h) __CWait(GfxBase, (copList), (v), (h))

LONG __VBeamPos(__reg("a6") void *)="\tjsr\t-384(a6)";
#define VBeamPos() __VBeamPos(GfxBase)

VOID __InitBitMap(__reg("a6") void *, __reg("a0") struct BitMap * bitMap, __reg("d0") LONG depth, __reg("d1") LONG width, __reg("d2") LONG height)="\tjsr\t-390(a6)";
#define InitBitMap(bitMap, depth, width, height) __InitBitMap(GfxBase, (bitMap), (depth), (width), (height))

VOID __ScrollRaster(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG dx, __reg("d1") LONG dy, __reg("d2") LONG xMin, __reg("d3") LONG yMin, __reg("d4") LONG xMax, __reg("d5") LONG yMax)="\tjsr\t-396(a6)";
#define ScrollRaster(rp, dx, dy, xMin, yMin, xMax, yMax) __ScrollRaster(GfxBase, (rp), (dx), (dy), (xMin), (yMin), (xMax), (yMax))

VOID __WaitBOVP(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-402(a6)";
#define WaitBOVP(vp) __WaitBOVP(GfxBase, (vp))

WORD __GetSprite(__reg("a6") void *, __reg("a0") struct SimpleSprite * sprite, __reg("d0") LONG num)="\tjsr\t-408(a6)";
#define GetSprite(sprite, num) __GetSprite(GfxBase, (sprite), (num))

VOID __FreeSprite(__reg("a6") void *, __reg("d0") LONG num)="\tjsr\t-414(a6)";
#define FreeSprite(num) __FreeSprite(GfxBase, (num))

VOID __ChangeSprite(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct SimpleSprite * sprite, __reg("a2") UWORD * newData)="\tjsr\t-420(a6)";
#define ChangeSprite(vp, sprite, newData) __ChangeSprite(GfxBase, (vp), (sprite), (newData))

VOID __MoveSprite(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct SimpleSprite * sprite, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-426(a6)";
#define MoveSprite(vp, sprite, x, y) __MoveSprite(GfxBase, (vp), (sprite), (x), (y))

VOID __LockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-432(a6)";
#define LockLayerRom(layer) __LockLayerRom(GfxBase, (layer))

VOID __UnlockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-438(a6)";
#define UnlockLayerRom(layer) __UnlockLayerRom(GfxBase, (layer))

VOID __SyncSBitMap(__reg("a6") void *, __reg("a0") struct Layer * layer)="\tjsr\t-444(a6)";
#define SyncSBitMap(layer) __SyncSBitMap(GfxBase, (layer))

VOID __CopySBitMap(__reg("a6") void *, __reg("a0") struct Layer * layer)="\tjsr\t-450(a6)";
#define CopySBitMap(layer) __CopySBitMap(GfxBase, (layer))

VOID __OwnBlitter(__reg("a6") void *)="\tjsr\t-456(a6)";
#define OwnBlitter() __OwnBlitter(GfxBase)

VOID __DisownBlitter(__reg("a6") void *)="\tjsr\t-462(a6)";
#define DisownBlitter() __DisownBlitter(GfxBase)

struct TmpRas * __InitTmpRas(__reg("a6") void *, __reg("a0") struct TmpRas * tmpRas, __reg("a1") PLANEPTR buffer, __reg("d0") LONG size)="\tjsr\t-468(a6)";
#define InitTmpRas(tmpRas, buffer, size) __InitTmpRas(GfxBase, (tmpRas), (buffer), (size))

VOID __AskFont(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-474(a6)";
#define AskFont(rp, textAttr) __AskFont(GfxBase, (rp), (textAttr))

VOID __AddFont(__reg("a6") void *, __reg("a1") struct TextFont * textFont)="\tjsr\t-480(a6)";
#define AddFont(textFont) __AddFont(GfxBase, (textFont))

VOID __RemFont(__reg("a6") void *, __reg("a1") struct TextFont * textFont)="\tjsr\t-486(a6)";
#define RemFont(textFont) __RemFont(GfxBase, (textFont))

PLANEPTR __AllocRaster(__reg("a6") void *, __reg("d0") ULONG width, __reg("d1") ULONG height)="\tjsr\t-492(a6)";
#define AllocRaster(width, height) __AllocRaster(GfxBase, (width), (height))

VOID __FreeRaster(__reg("a6") void *, __reg("a0") PLANEPTR p, __reg("d0") ULONG width, __reg("d1") ULONG height)="\tjsr\t-498(a6)";
#define FreeRaster(p, width, height) __FreeRaster(GfxBase, (p), (width), (height))

VOID __AndRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") CONST struct Rectangle * rectangle)="\tjsr\t-504(a6)";
#define AndRectRegion(region, rectangle) __AndRectRegion(GfxBase, (region), (rectangle))

BOOL __OrRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") CONST struct Rectangle * rectangle)="\tjsr\t-510(a6)";
#define OrRectRegion(region, rectangle) __OrRectRegion(GfxBase, (region), (rectangle))

struct Region * __NewRegion(__reg("a6") void *)="\tjsr\t-516(a6)";
#define NewRegion() __NewRegion(GfxBase)

BOOL __ClearRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") CONST struct Rectangle * rectangle)="\tjsr\t-522(a6)";
#define ClearRectRegion(region, rectangle) __ClearRectRegion(GfxBase, (region), (rectangle))

VOID __ClearRegion(__reg("a6") void *, __reg("a0") struct Region * region)="\tjsr\t-528(a6)";
#define ClearRegion(region) __ClearRegion(GfxBase, (region))

VOID __DisposeRegion(__reg("a6") void *, __reg("a0") struct Region * region)="\tjsr\t-534(a6)";
#define DisposeRegion(region) __DisposeRegion(GfxBase, (region))

VOID __FreeVPortCopLists(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-540(a6)";
#define FreeVPortCopLists(vp) __FreeVPortCopLists(GfxBase, (vp))

VOID __FreeCopList(__reg("a6") void *, __reg("a0") struct CopList * copList)="\tjsr\t-546(a6)";
#define FreeCopList(copList) __FreeCopList(GfxBase, (copList))

VOID __ClipBlit(__reg("a6") void *, __reg("a0") struct RastPort * srcRP, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm)="\tjsr\t-552(a6)";
#define ClipBlit(srcRP, xSrc, ySrc, destRP, xDest, yDest, xSize, ySize, minterm) __ClipBlit(GfxBase, (srcRP), (xSrc), (ySrc), (destRP), (xDest), (yDest), (xSize), (ySize), (minterm))

BOOL __XorRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") CONST struct Rectangle * rectangle)="\tjsr\t-558(a6)";
#define XorRectRegion(region, rectangle) __XorRectRegion(GfxBase, (region), (rectangle))

VOID __FreeCprList(__reg("a6") void *, __reg("a0") struct cprlist * cprList)="\tjsr\t-564(a6)";
#define FreeCprList(cprList) __FreeCprList(GfxBase, (cprList))

struct ColorMap * __GetColorMap(__reg("a6") void *, __reg("d0") LONG entries)="\tjsr\t-570(a6)";
#define GetColorMap(entries) __GetColorMap(GfxBase, (entries))

VOID __FreeColorMap(__reg("a6") void *, __reg("a0") struct ColorMap * colorMap)="\tjsr\t-576(a6)";
#define FreeColorMap(colorMap) __FreeColorMap(GfxBase, (colorMap))

ULONG __GetRGB4(__reg("a6") void *, __reg("a0") struct ColorMap * colorMap, __reg("d0") LONG entry)="\tjsr\t-582(a6)";
#define GetRGB4(colorMap, entry) __GetRGB4(GfxBase, (colorMap), (entry))

VOID __ScrollVPort(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-588(a6)";
#define ScrollVPort(vp) __ScrollVPort(GfxBase, (vp))

struct CopList * __UCopperListInit(__reg("a6") void *, __reg("a0") struct UCopList * uCopList, __reg("d0") LONG n)="\tjsr\t-594(a6)";
#define UCopperListInit(uCopList, n) __UCopperListInit(GfxBase, (uCopList), (n))

VOID __FreeGBuffers(__reg("a6") void *, __reg("a0") struct AnimOb * anOb, __reg("a1") struct RastPort * rp, __reg("d0") LONG flag)="\tjsr\t-600(a6)";
#define FreeGBuffers(anOb, rp, flag) __FreeGBuffers(GfxBase, (anOb), (rp), (flag))

VOID __BltBitMapRastPort(__reg("a6") void *, __reg("a0") CONST struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm)="\tjsr\t-606(a6)";
#define BltBitMapRastPort(srcBitMap, xSrc, ySrc, destRP, xDest, yDest, xSize, ySize, minterm) __BltBitMapRastPort(GfxBase, (srcBitMap), (xSrc), (ySrc), (destRP), (xDest), (yDest), (xSize), (ySize), (minterm))

BOOL __OrRegionRegion(__reg("a6") void *, __reg("a0") CONST struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-612(a6)";
#define OrRegionRegion(srcRegion, destRegion) __OrRegionRegion(GfxBase, (srcRegion), (destRegion))

BOOL __XorRegionRegion(__reg("a6") void *, __reg("a0") CONST struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-618(a6)";
#define XorRegionRegion(srcRegion, destRegion) __XorRegionRegion(GfxBase, (srcRegion), (destRegion))

BOOL __AndRegionRegion(__reg("a6") void *, __reg("a0") CONST struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-624(a6)";
#define AndRegionRegion(srcRegion, destRegion) __AndRegionRegion(GfxBase, (srcRegion), (destRegion))

VOID __SetRGB4CM(__reg("a6") void *, __reg("a0") struct ColorMap * colorMap, __reg("d0") LONG index, __reg("d1") ULONG red, __reg("d2") ULONG green, __reg("d3") ULONG blue)="\tjsr\t-630(a6)";
#define SetRGB4CM(colorMap, index, red, green, blue) __SetRGB4CM(GfxBase, (colorMap), (index), (red), (green), (blue))

VOID __BltMaskBitMapRastPort(__reg("a6") void *, __reg("a0") CONST struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm, __reg("a2") CONST PLANEPTR bltMask)="\tjsr\t-636(a6)";
#define BltMaskBitMapRastPort(srcBitMap, xSrc, ySrc, destRP, xDest, yDest, xSize, ySize, minterm, bltMask) __BltMaskBitMapRastPort(GfxBase, (srcBitMap), (xSrc), (ySrc), (destRP), (xDest), (yDest), (xSize), (ySize), (minterm), (bltMask))

BOOL __AttemptLockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-654(a6)";
#define AttemptLockLayerRom(layer) __AttemptLockLayerRom(GfxBase, (layer))

APTR __GfxNew(__reg("a6") void *, __reg("d0") ULONG gfxNodeType)="\tjsr\t-660(a6)";
#define GfxNew(gfxNodeType) __GfxNew(GfxBase, (gfxNodeType))

VOID __GfxFree(__reg("a6") void *, __reg("a0") APTR gfxNodePtr)="\tjsr\t-666(a6)";
#define GfxFree(gfxNodePtr) __GfxFree(GfxBase, (gfxNodePtr))

VOID __GfxAssociate(__reg("a6") void *, __reg("a0") CONST APTR associateNode, __reg("a1") APTR gfxNodePtr)="\tjsr\t-672(a6)";
#define GfxAssociate(associateNode, gfxNodePtr) __GfxAssociate(GfxBase, (associateNode), (gfxNodePtr))

VOID __BitMapScale(__reg("a6") void *, __reg("a0") struct BitScaleArgs * bitScaleArgs)="\tjsr\t-678(a6)";
#define BitMapScale(bitScaleArgs) __BitMapScale(GfxBase, (bitScaleArgs))

UWORD __ScalerDiv(__reg("a6") void *, __reg("d0") ULONG factor, __reg("d1") ULONG numerator, __reg("d2") ULONG denominator)="\tjsr\t-684(a6)";
#define ScalerDiv(factor, numerator, denominator) __ScalerDiv(GfxBase, (factor), (numerator), (denominator))

WORD __TextExtent(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST_STRPTR string, __reg("d0") LONG count, __reg("a2") struct TextExtent * textExtent)="\tjsr\t-690(a6)";
#define TextExtent(rp, string, count, textExtent) __TextExtent(GfxBase, (rp), (string), (count), (textExtent))

ULONG __TextFit(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") CONST_STRPTR string, __reg("d0") ULONG strLen, __reg("a2") CONST struct TextExtent * textExtent, __reg("a3") CONST struct TextExtent * constrainingExtent, __reg("d1") LONG strDirection, __reg("d2") ULONG constrainingBitWidth, __reg("d3") ULONG constrainingBitHeight)="\tjsr\t-696(a6)";
#define TextFit(rp, string, strLen, textExtent, constrainingExtent, strDirection, constrainingBitWidth, constrainingBitHeight) __TextFit(GfxBase, (rp), (string), (strLen), (textExtent), (constrainingExtent), (strDirection), (constrainingBitWidth), (constrainingBitHeight))

APTR __GfxLookUp(__reg("a6") void *, __reg("a0") CONST APTR associateNode)="\tjsr\t-702(a6)";
#define GfxLookUp(associateNode) __GfxLookUp(GfxBase, (associateNode))

BOOL __VideoControl(__reg("a6") void *, __reg("a0") struct ColorMap * colorMap, __reg("a1") struct TagItem * tagarray)="\tjsr\t-708(a6)";
#define VideoControl(colorMap, tagarray) __VideoControl(GfxBase, (colorMap), (tagarray))

struct MonitorSpec * __OpenMonitor(__reg("a6") void *, __reg("a1") CONST_STRPTR monitorName, __reg("d0") ULONG displayID)="\tjsr\t-714(a6)";
#define OpenMonitor(monitorName, displayID) __OpenMonitor(GfxBase, (monitorName), (displayID))

BOOL __CloseMonitor(__reg("a6") void *, __reg("a0") struct MonitorSpec * monitorSpec)="\tjsr\t-720(a6)";
#define CloseMonitor(monitorSpec) __CloseMonitor(GfxBase, (monitorSpec))

DisplayInfoHandle __FindDisplayInfo(__reg("a6") void *, __reg("d0") ULONG displayID)="\tjsr\t-726(a6)";
#define FindDisplayInfo(displayID) __FindDisplayInfo(GfxBase, (displayID))

ULONG __NextDisplayInfo(__reg("a6") void *, __reg("d0") ULONG displayID)="\tjsr\t-732(a6)";
#define NextDisplayInfo(displayID) __NextDisplayInfo(GfxBase, (displayID))

ULONG __GetDisplayInfoData(__reg("a6") void *, __reg("a0") CONST DisplayInfoHandle handle, __reg("a1") APTR buf, __reg("d0") ULONG size, __reg("d1") ULONG tagID, __reg("d2") ULONG displayID)="\tjsr\t-756(a6)";
#define GetDisplayInfoData(handle, buf, size, tagID, displayID) __GetDisplayInfoData(GfxBase, (handle), (buf), (size), (tagID), (displayID))

VOID __FontExtent(__reg("a6") void *, __reg("a0") CONST struct TextFont * font, __reg("a1") struct TextExtent * fontExtent)="\tjsr\t-762(a6)";
#define FontExtent(font, fontExtent) __FontExtent(GfxBase, (font), (fontExtent))

LONG __ReadPixelLine8(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG xstart, __reg("d1") ULONG ystart, __reg("d2") ULONG width, __reg("a2") UBYTE * array, __reg("a1") struct RastPort * tempRP)="\tjsr\t-768(a6)";
#define ReadPixelLine8(rp, xstart, ystart, width, array, tempRP) __ReadPixelLine8(GfxBase, (rp), (xstart), (ystart), (width), (array), (tempRP))

LONG __WritePixelLine8(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG xstart, __reg("d1") ULONG ystart, __reg("d2") ULONG width, __reg("a2") UBYTE * array, __reg("a1") struct RastPort * tempRP)="\tjsr\t-774(a6)";
#define WritePixelLine8(rp, xstart, ystart, width, array, tempRP) __WritePixelLine8(GfxBase, (rp), (xstart), (ystart), (width), (array), (tempRP))

LONG __ReadPixelArray8(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG xstart, __reg("d1") ULONG ystart, __reg("d2") ULONG xstop, __reg("d3") ULONG ystop, __reg("a2") UBYTE * array, __reg("a1") struct RastPort * temprp)="\tjsr\t-780(a6)";
#define ReadPixelArray8(rp, xstart, ystart, xstop, ystop, array, temprp) __ReadPixelArray8(GfxBase, (rp), (xstart), (ystart), (xstop), (ystop), (array), (temprp))

LONG __WritePixelArray8(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG xstart, __reg("d1") ULONG ystart, __reg("d2") ULONG xstop, __reg("d3") ULONG ystop, __reg("a2") UBYTE * array, __reg("a1") struct RastPort * temprp)="\tjsr\t-786(a6)";
#define WritePixelArray8(rp, xstart, ystart, xstop, ystop, array, temprp) __WritePixelArray8(GfxBase, (rp), (xstart), (ystart), (xstop), (ystop), (array), (temprp))

LONG __GetVPModeID(__reg("a6") void *, __reg("a0") CONST struct ViewPort * vp)="\tjsr\t-792(a6)";
#define GetVPModeID(vp) __GetVPModeID(GfxBase, (vp))

LONG __ModeNotAvailable(__reg("a6") void *, __reg("d0") ULONG modeID)="\tjsr\t-798(a6)";
#define ModeNotAvailable(modeID) __ModeNotAvailable(GfxBase, (modeID))

VOID __EraseRect(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG xMin, __reg("d1") LONG yMin, __reg("d2") LONG xMax, __reg("d3") LONG yMax)="\tjsr\t-810(a6)";
#define EraseRect(rp, xMin, yMin, xMax, yMax) __EraseRect(GfxBase, (rp), (xMin), (yMin), (xMax), (yMax))

ULONG __ExtendFont(__reg("a6") void *, __reg("a0") struct TextFont * font, __reg("a1") CONST struct TagItem * fontTags)="\tjsr\t-816(a6)";
#define ExtendFont(font, fontTags) __ExtendFont(GfxBase, (font), (fontTags))

VOID __StripFont(__reg("a6") void *, __reg("a0") struct TextFont * font)="\tjsr\t-822(a6)";
#define StripFont(font) __StripFont(GfxBase, (font))

UWORD __CalcIVG(__reg("a6") void *, __reg("a0") struct View * v, __reg("a1") struct ViewPort * vp)="\tjsr\t-828(a6)";
#define CalcIVG(v, vp) __CalcIVG(GfxBase, (v), (vp))

LONG __AttachPalExtra(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("a1") struct ViewPort * vp)="\tjsr\t-834(a6)";
#define AttachPalExtra(cm, vp) __AttachPalExtra(GfxBase, (cm), (vp))

LONG __ObtainBestPenA(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-840(a6)";
#define ObtainBestPenA(cm, r, g, b, tags) __ObtainBestPenA(GfxBase, (cm), (r), (g), (b), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __ObtainBestPen(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b, ULONG tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-840(a6)\n\tmovea.l\t(a7)+,a1";
#define ObtainBestPen(cm, r, g, b, ...) __ObtainBestPen(GfxBase, (cm), (r), (g), (b), __VA_ARGS__)
#endif

VOID __SetRGB32(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("d0") ULONG n, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b)="\tjsr\t-852(a6)";
#define SetRGB32(vp, n, r, g, b) __SetRGB32(GfxBase, (vp), (n), (r), (g), (b))

ULONG __GetAPen(__reg("a6") void *, __reg("a0") struct RastPort * rp)="\tjsr\t-858(a6)";
#define GetAPen(rp) __GetAPen(GfxBase, (rp))

ULONG __GetBPen(__reg("a6") void *, __reg("a0") struct RastPort * rp)="\tjsr\t-864(a6)";
#define GetBPen(rp) __GetBPen(GfxBase, (rp))

ULONG __GetDrMd(__reg("a6") void *, __reg("a0") struct RastPort * rp)="\tjsr\t-870(a6)";
#define GetDrMd(rp) __GetDrMd(GfxBase, (rp))

ULONG __GetOutlinePen(__reg("a6") void *, __reg("a0") struct RastPort * rp)="\tjsr\t-876(a6)";
#define GetOutlinePen(rp) __GetOutlinePen(GfxBase, (rp))

VOID __LoadRGB32(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") CONST ULONG * table)="\tjsr\t-882(a6)";
#define LoadRGB32(vp, table) __LoadRGB32(GfxBase, (vp), (table))

ULONG __SetChipRev(__reg("a6") void *, __reg("d0") ULONG want)="\tjsr\t-888(a6)";
#define SetChipRev(want) __SetChipRev(GfxBase, (want))

VOID __SetABPenDrMd(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") ULONG apen, __reg("d1") ULONG bpen, __reg("d2") ULONG drawmode)="\tjsr\t-894(a6)";
#define SetABPenDrMd(rp, apen, bpen, drawmode) __SetABPenDrMd(GfxBase, (rp), (apen), (bpen), (drawmode))

VOID __GetRGB32(__reg("a6") void *, __reg("a0") CONST struct ColorMap * cm, __reg("d0") ULONG firstcolor, __reg("d1") ULONG ncolors, __reg("a1") ULONG * table)="\tjsr\t-900(a6)";
#define GetRGB32(cm, firstcolor, ncolors, table) __GetRGB32(GfxBase, (cm), (firstcolor), (ncolors), (table))

struct BitMap * __AllocBitMap(__reg("a6") void *, __reg("d0") ULONG sizex, __reg("d1") ULONG sizey, __reg("d2") ULONG depth, __reg("d3") ULONG flags, __reg("a0") CONST struct BitMap * friend_bitmap)="\tjsr\t-918(a6)";
#define AllocBitMap(sizex, sizey, depth, flags, friend_bitmap) __AllocBitMap(GfxBase, (sizex), (sizey), (depth), (flags), (friend_bitmap))

VOID __FreeBitMap(__reg("a6") void *, __reg("a0") struct BitMap * bm)="\tjsr\t-924(a6)";
#define FreeBitMap(bm) __FreeBitMap(GfxBase, (bm))

LONG __GetExtSpriteA(__reg("a6") void *, __reg("a2") struct ExtSprite * ss, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-930(a6)";
#define GetExtSpriteA(ss, tags) __GetExtSpriteA(GfxBase, (ss), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __GetExtSprite(__reg("a6") void *, __reg("a2") struct ExtSprite * ss, ULONG tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-930(a6)\n\tmovea.l\t(a7)+,a1";
#define GetExtSprite(ss, ...) __GetExtSprite(GfxBase, (ss), __VA_ARGS__)
#endif

ULONG __CoerceMode(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("d0") ULONG monitorid, __reg("d1") ULONG flags)="\tjsr\t-936(a6)";
#define CoerceMode(vp, monitorid, flags) __CoerceMode(GfxBase, (vp), (monitorid), (flags))

VOID __ChangeVPBitMap(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct BitMap * bm, __reg("a2") struct DBufInfo * db)="\tjsr\t-942(a6)";
#define ChangeVPBitMap(vp, bm, db) __ChangeVPBitMap(GfxBase, (vp), (bm), (db))

VOID __ReleasePen(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d0") ULONG n)="\tjsr\t-948(a6)";
#define ReleasePen(cm, n) __ReleasePen(GfxBase, (cm), (n))

ULONG __ObtainPen(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d0") ULONG n, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b, __reg("d4") LONG f)="\tjsr\t-954(a6)";
#define ObtainPen(cm, n, r, g, b, f) __ObtainPen(GfxBase, (cm), (n), (r), (g), (b), (f))

ULONG __GetBitMapAttr(__reg("a6") void *, __reg("a0") CONST struct BitMap * bm, __reg("d1") ULONG attrnum)="\tjsr\t-960(a6)";
#define GetBitMapAttr(bm, attrnum) __GetBitMapAttr(GfxBase, (bm), (attrnum))

struct DBufInfo * __AllocDBufInfo(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-966(a6)";
#define AllocDBufInfo(vp) __AllocDBufInfo(GfxBase, (vp))

VOID __FreeDBufInfo(__reg("a6") void *, __reg("a1") struct DBufInfo * dbi)="\tjsr\t-972(a6)";
#define FreeDBufInfo(dbi) __FreeDBufInfo(GfxBase, (dbi))

ULONG __SetOutlinePen(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG pen)="\tjsr\t-978(a6)";
#define SetOutlinePen(rp, pen) __SetOutlinePen(GfxBase, (rp), (pen))

ULONG __SetWriteMask(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG msk)="\tjsr\t-984(a6)";
#define SetWriteMask(rp, msk) __SetWriteMask(GfxBase, (rp), (msk))

VOID __SetMaxPen(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG maxpen)="\tjsr\t-990(a6)";
#define SetMaxPen(rp, maxpen) __SetMaxPen(GfxBase, (rp), (maxpen))

VOID __SetRGB32CM(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d0") ULONG n, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b)="\tjsr\t-996(a6)";
#define SetRGB32CM(cm, n, r, g, b) __SetRGB32CM(GfxBase, (cm), (n), (r), (g), (b))

VOID __ScrollRasterBF(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG dx, __reg("d1") LONG dy, __reg("d2") LONG xMin, __reg("d3") LONG yMin, __reg("d4") LONG xMax, __reg("d5") LONG yMax)="\tjsr\t-1002(a6)";
#define ScrollRasterBF(rp, dx, dy, xMin, yMin, xMax, yMax) __ScrollRasterBF(GfxBase, (rp), (dx), (dy), (xMin), (yMin), (xMax), (yMax))

LONG __FindColor(__reg("a6") void *, __reg("a3") struct ColorMap * cm, __reg("d1") ULONG r, __reg("d2") ULONG g, __reg("d3") ULONG b, __reg("d4") LONG maxcolor)="\tjsr\t-1008(a6)";
#define FindColor(cm, r, g, b, maxcolor) __FindColor(GfxBase, (cm), (r), (g), (b), (maxcolor))

struct ExtSprite * __AllocSpriteDataA(__reg("a6") void *, __reg("a2") CONST struct BitMap * bm, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-1020(a6)";
#define AllocSpriteDataA(bm, tags) __AllocSpriteDataA(GfxBase, (bm), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct ExtSprite * __AllocSpriteData(__reg("a6") void *, __reg("a2") CONST struct BitMap * bm, ULONG tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-1020(a6)\n\tmovea.l\t(a7)+,a1";
#define AllocSpriteData(bm, ...) __AllocSpriteData(GfxBase, (bm), __VA_ARGS__)
#endif

LONG __ChangeExtSpriteA(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct ExtSprite * oldsprite, __reg("a2") struct ExtSprite * newsprite, __reg("a3") CONST struct TagItem * tags)="\tjsr\t-1026(a6)";
#define ChangeExtSpriteA(vp, oldsprite, newsprite, tags) __ChangeExtSpriteA(GfxBase, (vp), (oldsprite), (newsprite), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __ChangeExtSprite(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct ExtSprite * oldsprite, __reg("a2") struct ExtSprite * newsprite, ULONG tags, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-1026(a6)\n\tmovea.l\t(a7)+,a3";
#define ChangeExtSprite(vp, oldsprite, newsprite, ...) __ChangeExtSprite(GfxBase, (vp), (oldsprite), (newsprite), __VA_ARGS__)
#endif

VOID __FreeSpriteData(__reg("a6") void *, __reg("a2") struct ExtSprite * sp)="\tjsr\t-1032(a6)";
#define FreeSpriteData(sp) __FreeSpriteData(GfxBase, (sp))

VOID __SetRPAttrsA(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-1038(a6)";
#define SetRPAttrsA(rp, tags) __SetRPAttrsA(GfxBase, (rp), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetRPAttrs(__reg("a6") void *, __reg("a0") struct RastPort * rp, ULONG tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-1038(a6)\n\tmovea.l\t(a7)+,a1";
#define SetRPAttrs(rp, ...) __SetRPAttrs(GfxBase, (rp), __VA_ARGS__)
#endif

VOID __GetRPAttrsA(__reg("a6") void *, __reg("a0") CONST struct RastPort * rp, __reg("a1") CONST struct TagItem * tags)="\tjsr\t-1044(a6)";
#define GetRPAttrsA(rp, tags) __GetRPAttrsA(GfxBase, (rp), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __GetRPAttrs(__reg("a6") void *, __reg("a0") CONST struct RastPort * rp, ULONG tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-1044(a6)\n\tmovea.l\t(a7)+,a1";
#define GetRPAttrs(rp, ...) __GetRPAttrs(GfxBase, (rp), __VA_ARGS__)
#endif

ULONG __BestModeIDA(__reg("a6") void *, __reg("a0") CONST struct TagItem * tags)="\tjsr\t-1050(a6)";
#define BestModeIDA(tags) __BestModeIDA(GfxBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __BestModeID(__reg("a6") void *, ULONG tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-1050(a6)\n\tmovea.l\t(a7)+,a0";
#define BestModeID(...) __BestModeID(GfxBase, __VA_ARGS__)
#endif

VOID __WriteChunkyPixels(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("d0") ULONG xstart, __reg("d1") ULONG ystart, __reg("d2") ULONG xstop, __reg("d3") ULONG ystop, __reg("a2") CONST UBYTE * array, __reg("d4") LONG bytesperrow)="\tjsr\t-1056(a6)";
#define WriteChunkyPixels(rp, xstart, ystart, xstop, ystop, array, bytesperrow) __WriteChunkyPixels(GfxBase, (rp), (xstart), (ystart), (xstop), (ystop), (array), (bytesperrow))

#endif /*  _VBCCINLINE_GRAPHICS_H  */
