#ifndef _VBCCINLINE_GRAPHICS_H
#define _VBCCINLINE_GRAPHICS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __BltBitMap(__reg("a6") void *, __reg("a0") const struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct BitMap * destBitMap, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm, __reg("d7") ULONG mask, __reg("a2") PLANEPTR tempA)="\tjsr\t-30(a6)";
#define BltBitMap(srcBitMap, xSrc, ySrc, destBitMap, xDest, yDest, xSize, ySize, minterm, mask, tempA) __BltBitMap(GfxBase, (srcBitMap), (xSrc), (ySrc), (destBitMap), (xDest), (yDest), (xSize), (ySize), (minterm), (mask), (tempA))

VOID __BltTemplate(__reg("a6") void *, __reg("a0") const PLANEPTR source, __reg("d0") LONG xSrc, __reg("d1") LONG srcMod, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize)="\tjsr\t-36(a6)";
#define BltTemplate(source, xSrc, srcMod, destRP, xDest, yDest, xSize, ySize) __BltTemplate(GfxBase, (source), (xSrc), (srcMod), (destRP), (xDest), (yDest), (xSize), (ySize))

VOID __ClearEOL(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-42(a6)";
#define ClearEOL(rp) __ClearEOL(GfxBase, (rp))

VOID __ClearScreen(__reg("a6") void *, __reg("a1") struct RastPort * rp)="\tjsr\t-48(a6)";
#define ClearScreen(rp) __ClearScreen(GfxBase, (rp))

WORD __TextLength(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") const STRPTR string, __reg("d0") ULONG count)="\tjsr\t-54(a6)";
#define TextLength(rp, string, count) __TextLength(GfxBase, (rp), (string), (count))

LONG __Text(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") const STRPTR string, __reg("d0") ULONG count)="\tjsr\t-60(a6)";
#define Text(rp, string, count) __Text(GfxBase, (rp), (string), (count))

LONG __SetFont(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") const struct TextFont * textFont)="\tjsr\t-66(a6)";
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

VOID __LoadRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") const UWORD * colors, __reg("d0") LONG count)="\tjsr\t-192(a6)";
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

VOID __InitArea(__reg("a6") void *, __reg("a0") struct AreaInfo * areaInfo, __reg("a1") void * vectorBuffer, __reg("d0") LONG maxVectors)="\tjsr\t-282(a6)";
#define InitArea(areaInfo, vectorBuffer, maxVectors) __InitArea(GfxBase, (areaInfo), (vectorBuffer), (maxVectors))

VOID __SetRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("d0") LONG index, __reg("d1") ULONG red, __reg("d2") ULONG green, __reg("d3") ULONG blue)="\tjsr\t-288(a6)";
#define SetRGB4(vp, index, red, green, blue) __SetRGB4(GfxBase, (vp), (index), (red), (green), (blue))

VOID __QBSBlit(__reg("a6") void *, __reg("a1") struct bltnode * blit)="\tjsr\t-294(a6)";
#define QBSBlit(blit) __QBSBlit(GfxBase, (blit))

VOID __BltClear(__reg("a6") void *, __reg("a1") PLANEPTR memBlock, __reg("d0") ULONG byteCount, __reg("d1") ULONG flags)="\tjsr\t-300(a6)";
#define BltClear(memBlock, byteCount, flags) __BltClear(GfxBase, (memBlock), (byteCount), (flags))

VOID __RectFill(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG xMin, __reg("d1") LONG yMin, __reg("d2") LONG xMax, __reg("d3") LONG yMax)="\tjsr\t-306(a6)";
#define RectFill(rp, xMin, yMin, xMax, yMax) __RectFill(GfxBase, (rp), (xMin), (yMin), (xMax), (yMax))

VOID __BltPattern(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("a0") const PLANEPTR mask, __reg("d0") LONG xMin, __reg("d1") LONG yMin, __reg("d2") LONG xMax, __reg("d3") LONG yMax, __reg("d4") ULONG maskBPR)="\tjsr\t-312(a6)";
#define BltPattern(rp, mask, xMin, yMin, xMax, yMax, maskBPR) __BltPattern(GfxBase, (rp), (mask), (xMin), (yMin), (xMax), (yMax), (maskBPR))

ULONG __ReadPixel(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-318(a6)";
#define ReadPixel(rp, x, y) __ReadPixel(GfxBase, (rp), (x), (y))

LONG __WritePixel(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-324(a6)";
#define WritePixel(rp, x, y) __WritePixel(GfxBase, (rp), (x), (y))

BOOL __Flood(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d2") ULONG mode, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-330(a6)";
#define Flood(rp, mode, x, y) __Flood(GfxBase, (rp), (mode), (x), (y))

VOID __PolyDraw(__reg("a6") void *, __reg("a1") struct RastPort * rp, __reg("d0") LONG count, __reg("a0") const WORD * polyTable)="\tjsr\t-336(a6)";
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

VOID __CMove(__reg("a6") void *, __reg("a1") struct UCopList * copList, __reg("d0") void * destination, __reg("d1") LONG data)="\tjsr\t-372(a6)";
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

VOID __AndRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") const struct Rectangle * rectangle)="\tjsr\t-504(a6)";
#define AndRectRegion(region, rectangle) __AndRectRegion(GfxBase, (region), (rectangle))

BOOL __OrRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") const struct Rectangle * rectangle)="\tjsr\t-510(a6)";
#define OrRectRegion(region, rectangle) __OrRectRegion(GfxBase, (region), (rectangle))

struct Region * __NewRegion(__reg("a6") void *)="\tjsr\t-516(a6)";
#define NewRegion() __NewRegion(GfxBase)

BOOL __ClearRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") const struct Rectangle * rectangle)="\tjsr\t-522(a6)";
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

BOOL __XorRectRegion(__reg("a6") void *, __reg("a0") struct Region * region, __reg("a1") const struct Rectangle * rectangle)="\tjsr\t-558(a6)";
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

VOID __BltBitMapRastPort(__reg("a6") void *, __reg("a0") const struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm)="\tjsr\t-606(a6)";
#define BltBitMapRastPort(srcBitMap, xSrc, ySrc, destRP, xDest, yDest, xSize, ySize, minterm) __BltBitMapRastPort(GfxBase, (srcBitMap), (xSrc), (ySrc), (destRP), (xDest), (yDest), (xSize), (ySize), (minterm))

BOOL __OrRegionRegion(__reg("a6") void *, __reg("a0") const struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-612(a6)";
#define OrRegionRegion(srcRegion, destRegion) __OrRegionRegion(GfxBase, (srcRegion), (destRegion))

BOOL __XorRegionRegion(__reg("a6") void *, __reg("a0") const struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-618(a6)";
#define XorRegionRegion(srcRegion, destRegion) __XorRegionRegion(GfxBase, (srcRegion), (destRegion))

BOOL __AndRegionRegion(__reg("a6") void *, __reg("a0") const struct Region * srcRegion, __reg("a1") struct Region * destRegion)="\tjsr\t-624(a6)";
#define AndRegionRegion(srcRegion, destRegion) __AndRegionRegion(GfxBase, (srcRegion), (destRegion))

VOID __SetRGB4CM(__reg("a6") void *, __reg("a0") struct ColorMap * colorMap, __reg("d0") LONG index, __reg("d1") ULONG red, __reg("d2") ULONG green, __reg("d3") ULONG blue)="\tjsr\t-630(a6)";
#define SetRGB4CM(colorMap, index, red, green, blue) __SetRGB4CM(GfxBase, (colorMap), (index), (red), (green), (blue))

VOID __BltMaskBitMapRastPort(__reg("a6") void *, __reg("a0") const struct BitMap * srcBitMap, __reg("d0") LONG xSrc, __reg("d1") LONG ySrc, __reg("a1") struct RastPort * destRP, __reg("d2") LONG xDest, __reg("d3") LONG yDest, __reg("d4") LONG xSize, __reg("d5") LONG ySize, __reg("d6") ULONG minterm, __reg("a2") const PLANEPTR bltMask)="\tjsr\t-636(a6)";
#define BltMaskBitMapRastPort(srcBitMap, xSrc, ySrc, destRP, xDest, yDest, xSize, ySize, minterm, bltMask) __BltMaskBitMapRastPort(GfxBase, (srcBitMap), (xSrc), (ySrc), (destRP), (xDest), (yDest), (xSize), (ySize), (minterm), (bltMask))

BOOL __AttemptLockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-654(a6)";
#define AttemptLockLayerRom(layer) __AttemptLockLayerRom(GfxBase, (layer))

#endif /*  _VBCCINLINE_GRAPHICS_H  */
