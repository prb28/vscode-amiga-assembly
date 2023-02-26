#ifndef _VBCCINLINE_GRAPHICS_H
#define _VBCCINLINE_GRAPHICS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __BltBitMap(__reg("a6") void *, __reg("a0") struct BitMap * srcBitMap, __reg("d0") long srcX, __reg("d1") long srcY, __reg("a1") struct BitMap* destBitMap, __reg("d2") long destX, __reg("d3") long destY, __reg("d4") long sizeX, __reg("d5") long sizeY, __reg("d6") long minterm, __reg("d7") long mask, __reg("a2") char * tempA)="\tjsr\t-30(a6)";
#define BltBitMap(srcBitMap, srcX, srcY, destBitMap, destX, destY, sizeX, sizeY, minterm, mask, tempA) __BltBitMap(GfxBase, (srcBitMap), (srcX), (srcY), (destBitMap), (destX), (destY), (sizeX), (sizeY), (minterm), (mask), (tempA))

void __BltTemplate(__reg("a6") void *, __reg("a0") char * source, __reg("d0") long srcX, __reg("d1") long srcMod, __reg("a1") struct RastPort * destRastPort, __reg("d2") long destX, __reg("d3") long destY, __reg("d4") long sizeX, __reg("d5") long sizeY)="\tjsr\t-36(a6)";
#define BltTemplate(source, srcX, srcMod, destRastPort, destX, destY, sizeX, sizeY) __BltTemplate(GfxBase, (source), (srcX), (srcMod), (destRastPort), (destX), (destY), (sizeX), (sizeY))

void __ClearEOL(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-42(a6)";
#define ClearEOL(a1arg) __ClearEOL(GfxBase, (a1arg))

void __ClearScreen(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-48(a6)";
#define ClearScreen(a1arg) __ClearScreen(GfxBase, (a1arg))

long __TextLength(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("a0") char * string, __reg("d0") long count)="\tjsr\t-54(a6)";
#define TextLength(a1arg, string, count) __TextLength(GfxBase, (a1arg), (string), (count))

long __Text(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("a0") char * string, __reg("d0") long count)="\tjsr\t-60(a6)";
#define Text(a1arg, string, count) __Text(GfxBase, (a1arg), (string), (count))

long __SetFont(__reg("a6") void *, __reg("a1") struct RastPort * RastPortID, __reg("a0") struct TextFont* textFont)="\tjsr\t-66(a6)";
#define SetFont(RastPortID, textFont) __SetFont(GfxBase, (RastPortID), (textFont))

struct TextFont * __OpenFont(__reg("a6") void *, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-72(a6)";
#define OpenFont(textAttr) __OpenFont(GfxBase, (textAttr))

void __CloseFont(__reg("a6") void *, __reg("a1") struct TextFont * textFont)="\tjsr\t-78(a6)";
#define CloseFont(textFont) __CloseFont(GfxBase, (textFont))

long __AskSoftStyle(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-84(a6)";
#define AskSoftStyle(a1arg) __AskSoftStyle(GfxBase, (a1arg))

long __SetSoftStyle(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long style, __reg("d1") long enable)="\tjsr\t-90(a6)";
#define SetSoftStyle(a1arg, style, enable) __SetSoftStyle(GfxBase, (a1arg), (style), (enable))

void __AddBob(__reg("a6") void *, __reg("a0") struct Bob * bob, __reg("a1") struct RastPort * a1arg)="\tjsr\t-96(a6)";
#define AddBob(bob, a1arg) __AddBob(GfxBase, (bob), (a1arg))

void __AddVSprite(__reg("a6") void *, __reg("a0") struct VSprite * vSprite, __reg("a1") struct RastPort * a1arg)="\tjsr\t-102(a6)";
#define AddVSprite(vSprite, a1arg) __AddVSprite(GfxBase, (vSprite), (a1arg))

void __DoCollision(__reg("a6") void *, __reg("a1") struct RastPort * rasPort)="\tjsr\t-108(a6)";
#define DoCollision(rasPort) __DoCollision(GfxBase, (rasPort))

void __DrawGList(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("a0") struct ViewPort * viewPort)="\tjsr\t-114(a6)";
#define DrawGList(a1arg, viewPort) __DrawGList(GfxBase, (a1arg), (viewPort))

void __InitGels(__reg("a6") void *, __reg("a0") struct VSprite * dummyHead, __reg("a1") struct VSprite * dummyTail, __reg("a2") struct GelsInfo * GelsInfo)="\tjsr\t-120(a6)";
#define InitGels(dummyHead, dummyTail, GelsInfo) __InitGels(GfxBase, (dummyHead), (dummyTail), (GelsInfo))

void __InitMasks(__reg("a6") void *, __reg("a0") struct VSprite * vSprite)="\tjsr\t-126(a6)";
#define InitMasks(vSprite) __InitMasks(GfxBase, (vSprite))

void __RemIBob(__reg("a6") void *, __reg("a0") struct Bob * bob, __reg("a1") struct RastPort * a1arg, __reg("a2") struct ViewPort * viewPort)="\tjsr\t-132(a6)";
#define RemIBob(bob, a1arg, viewPort) __RemIBob(GfxBase, (bob), (a1arg), (viewPort))

void __RemVSprite(__reg("a6") void *, __reg("a0") struct VSprite * vSprite)="\tjsr\t-138(a6)";
#define RemVSprite(vSprite) __RemVSprite(GfxBase, (vSprite))

void __SetCollision(__reg("a6") void *, __reg("d0") long type, __reg("a0") void * routine, __reg("a1") struct GelsInfo* gelsInfo)="\tjsr\t-144(a6)";
#define SetCollision(type, routine, gelsInfo) __SetCollision(GfxBase, (type), (void *)(routine), (gelsInfo))

void __SortGList(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-150(a6)";
#define SortGList(a1arg) __SortGList(GfxBase, (a1arg))

void __AddAnimOb(__reg("a6") void *, __reg("a0") struct AnimOb * obj, __reg("a1") void * animationKey, __reg("a2") struct RastPort * a2arg)="\tjsr\t-156(a6)";
#define AddAnimOb(obj, animationKey, a2arg) __AddAnimOb(GfxBase, (obj), (void *)(animationKey), (a2arg))

void __Animate(__reg("a6") void *, __reg("a0") void * animationKey, __reg("a1") struct RastPort * a1arg)="\tjsr\t-162(a6)";
#define Animate(animationKey, a1arg) __Animate(GfxBase, (void *)(animationKey), (a1arg))

void __GetGBuffers(__reg("a6") void *, __reg("a0") struct AnimOb * animationObj, __reg("a1") struct RastPort * a1arg, __reg("d0") long doubleBuffer)="\tjsr\t-168(a6)";
#define GetGBuffers(animationObj, a1arg, doubleBuffer) __GetGBuffers(GfxBase, (animationObj), (a1arg), (doubleBuffer))

void __InitGMasks(__reg("a6") void *, __reg("a0") struct AnimOb * animationObj)="\tjsr\t-174(a6)";
#define InitGMasks(animationObj) __InitGMasks(GfxBase, (animationObj))

void __DrawEllipse(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long cx, __reg("d1") long cy, __reg("d2") long a, __reg("d3") long b)="\tjsr\t-180(a6)";
#define DrawEllipse(a1arg, cx, cy, a, b) __DrawEllipse(GfxBase, (a1arg), (cx), (cy), (a), (b))

long __AreaEllipse(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long cx, __reg("d1") long cy, __reg("d2") long a, __reg("d3") long b)="\tjsr\t-186(a6)";
#define AreaEllipse(a1arg, cx, cy, a, b) __AreaEllipse(GfxBase, (a1arg), (cx), (cy), (a), (b))

void __LoadRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * viewPort, __reg("a1") short * colors, __reg("d0") long count)="\tjsr\t-192(a6)";
#define LoadRGB4(viewPort, colors, count) __LoadRGB4(GfxBase, (viewPort), (colors), (count))

void __InitRastPort(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-198(a6)";
#define InitRastPort(a1arg) __InitRastPort(GfxBase, (a1arg))

void __InitVPort(__reg("a6") void *, __reg("a0") struct ViewPort * viewPort)="\tjsr\t-204(a6)";
#define InitVPort(viewPort) __InitVPort(GfxBase, (viewPort))

void __MrgCop(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-210(a6)";
#define MrgCop(view) __MrgCop(GfxBase, (view))

void __MakeVPort(__reg("a6") void *, __reg("a0") struct View * view, __reg("a1") struct ViewPort * viewPort)="\tjsr\t-216(a6)";
#define MakeVPort(view, viewPort) __MakeVPort(GfxBase, (view), (viewPort))

void __LoadView(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-222(a6)";
#define LoadView(view) __LoadView(GfxBase, (view))

void __WaitBlit(__reg("a6") void *)="\tjsr\t-228(a6)";
#define WaitBlit() __WaitBlit(GfxBase)

void __SetRast(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long color)="\tjsr\t-234(a6)";
#define SetRast(a1arg, color) __SetRast(GfxBase, (a1arg), (color))

void __Move(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-240(a6)";
#define Move(a1arg, x, y) __Move(GfxBase, (a1arg), (x), (y))

void __Draw(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-246(a6)";
#define Draw(a1arg, x, y) __Draw(GfxBase, (a1arg), (x), (y))

long __AreaMove(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-252(a6)";
#define AreaMove(a1arg, x, y) __AreaMove(GfxBase, (a1arg), (x), (y))

long __AreaDraw(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-258(a6)";
#define AreaDraw(a1arg, x, y) __AreaDraw(GfxBase, (a1arg), (x), (y))

void __AreaEnd(__reg("a6") void *, __reg("a1") struct RastPort * a1arg)="\tjsr\t-264(a6)";
#define AreaEnd(a1arg) __AreaEnd(GfxBase, (a1arg))

void __WaitTOF(__reg("a6") void *)="\tjsr\t-270(a6)";
#define WaitTOF() __WaitTOF(GfxBase)

void __QBlit(__reg("a6") void *, __reg("a1") struct bltnode * blit)="\tjsr\t-276(a6)";
#define QBlit(blit) __QBlit(GfxBase, (blit))

void __InitArea(__reg("a6") void *, __reg("a0") struct AreaInfo * areaInfo, __reg("a1") short * vectorTable, __reg("d0") long vectorTableSize)="\tjsr\t-282(a6)";
#define InitArea(areaInfo, vectorTable, vectorTableSize) __InitArea(GfxBase, (areaInfo), (vectorTable), (vectorTableSize))

void __SetRGB4(__reg("a6") void *, __reg("a0") struct ViewPort * viewPort, __reg("d0") long index, __reg("d1") long r, __reg("d2") long g, __reg("d3") long b)="\tjsr\t-288(a6)";
#define SetRGB4(viewPort, index, r, g, b) __SetRGB4(GfxBase, (viewPort), (index), (r), (g), (b))

void __QBSBlit(__reg("a6") void *, __reg("a1") struct bltnode * blit)="\tjsr\t-294(a6)";
#define QBSBlit(blit) __QBSBlit(GfxBase, (blit))

void __BltClear(__reg("a6") void *, __reg("a1") char * memory, __reg("d0") long size, __reg("d1") long flags)="\tjsr\t-300(a6)";
#define BltClear(memory, size, flags) __BltClear(GfxBase, (memory), (size), (flags))

void __RectFill(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long xl, __reg("d1") long yl, __reg("d2") long xu, __reg("d3") long yu)="\tjsr\t-306(a6)";
#define RectFill(a1arg, xl, yl, xu, yu) __RectFill(GfxBase, (a1arg), (xl), (yl), (xu), (yu))

void __BltPattern(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("a0") struct RastPort * ras, __reg("d0") long xl, __reg("d1") long yl, __reg("d2") long maxX, __reg("d3") long maxY, __reg("d4") long fillBytes)="\tjsr\t-312(a6)";
#define BltPattern(a1arg, ras, xl, yl, maxX, maxY, fillBytes) __BltPattern(GfxBase, (a1arg), (ras), (xl), (yl), (maxX), (maxY), (fillBytes))

long __ReadPixel(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-318(a6)";
#define ReadPixel(a1arg, x, y) __ReadPixel(GfxBase, (a1arg), (x), (y))

void __WritePixel(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-324(a6)";
#define WritePixel(a1arg, x, y) __WritePixel(GfxBase, (a1arg), (x), (y))

void __Flood(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d2") long mode, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-330(a6)";
#define Flood(a1arg, mode, x, y) __Flood(GfxBase, (a1arg), (mode), (x), (y))

void __PolyDraw(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long count, __reg("a0") short * polyTable)="\tjsr\t-336(a6)";
#define PolyDraw(a1arg, count, polyTable) __PolyDraw(GfxBase, (a1arg), (count), (polyTable))

void __SetAPen(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long pen)="\tjsr\t-342(a6)";
#define SetAPen(a1arg, pen) __SetAPen(GfxBase, (a1arg), (pen))

void __SetBPen(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long pen)="\tjsr\t-348(a6)";
#define SetBPen(a1arg, pen) __SetBPen(GfxBase, (a1arg), (pen))

void __SetDrMd(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long drawMode)="\tjsr\t-354(a6)";
#define SetDrMd(a1arg, drawMode) __SetDrMd(GfxBase, (a1arg), (drawMode))

void __InitView(__reg("a6") void *, __reg("a1") struct View * view)="\tjsr\t-360(a6)";
#define InitView(view) __InitView(GfxBase, (view))

void __CBump(__reg("a6") void *, __reg("a1") struct UCopList * copperList)="\tjsr\t-366(a6)";
#define CBump(copperList) __CBump(GfxBase, (copperList))

void __CMove(__reg("a6") void *, __reg("a1") struct UCopList * copperList, __reg("d0") long destination, __reg("d1") long data)="\tjsr\t-372(a6)";
#define CMove(copperList, destination, data) __CMove(GfxBase, (copperList), (destination), (data))

void __CWait(__reg("a6") void *, __reg("a1") struct UCopList * copperList, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-378(a6)";
#define CWait(copperList, x, y) __CWait(GfxBase, (copperList), (x), (y))

long __VBeamPos(__reg("a6") void *)="\tjsr\t-384(a6)";
#define VBeamPos() __VBeamPos(GfxBase)

void __InitBitMap(__reg("a6") void *, __reg("a0") struct BitMap * bitMap, __reg("d0") long depth, __reg("d1") long width, __reg("d2") long height)="\tjsr\t-390(a6)";
#define InitBitMap(bitMap, depth, width, height) __InitBitMap(GfxBase, (bitMap), (depth), (width), (height))

void __ScrollRaster(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("d0") long dX, __reg("d1") long dY, __reg("d2") long minx, __reg("d3") long miny, __reg("d4") long maxx, __reg("d5") long maxy)="\tjsr\t-396(a6)";
#define ScrollRaster(a1arg, dX, dY, minx, miny, maxx, maxy) __ScrollRaster(GfxBase, (a1arg), (dX), (dY), (minx), (miny), (maxx), (maxy))

void __WaitBOVP(__reg("a6") void *, __reg("a0") struct ViewPort * viewport)="\tjsr\t-402(a6)";
#define WaitBOVP(viewport) __WaitBOVP(GfxBase, (viewport))

long __GetSprite(__reg("a6") void *, __reg("a0") struct SimpleSprite * simplesprite, __reg("d0") long num)="\tjsr\t-408(a6)";
#define GetSprite(simplesprite, num) __GetSprite(GfxBase, (simplesprite), (num))

void __FreeSprite(__reg("a6") void *, __reg("d0") long num)="\tjsr\t-414(a6)";
#define FreeSprite(num) __FreeSprite(GfxBase, (num))

void __ChangeSprite(__reg("a6") void *, __reg("a0") struct ViewPort * vp, __reg("a1") struct SimpleSprite * simplesprite, __reg("a2") short * data)="\tjsr\t-420(a6)";
#define ChangeSprite(vp, simplesprite, data) __ChangeSprite(GfxBase, (vp), (simplesprite), (data))

void __MoveSprite(__reg("a6") void *, __reg("a0") struct ViewPort * viewport, __reg("a1") struct SimpleSprite * simplesprite, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-426(a6)";
#define MoveSprite(viewport, simplesprite, x, y) __MoveSprite(GfxBase, (viewport), (simplesprite), (x), (y))

void __LockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-432(a6)";
#define LockLayerRom(layer) __LockLayerRom(GfxBase, (layer))

void __UnlockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-438(a6)";
#define UnlockLayerRom(layer) __UnlockLayerRom(GfxBase, (layer))

void __SyncSBitMap(__reg("a6") void *, __reg("a0") struct Layer * l)="\tjsr\t-444(a6)";
#define SyncSBitMap(l) __SyncSBitMap(GfxBase, (l))

void __CopySBitMap(__reg("a6") void *, __reg("a0") struct Layer * l)="\tjsr\t-450(a6)";
#define CopySBitMap(l) __CopySBitMap(GfxBase, (l))

void __OwnBlitter(__reg("a6") void *)="\tjsr\t-456(a6)";
#define OwnBlitter() __OwnBlitter(GfxBase)

void __DisownBlitter(__reg("a6") void *)="\tjsr\t-462(a6)";
#define DisownBlitter() __DisownBlitter(GfxBase)

struct TmpRas * __InitTmpRas(__reg("a6") void *, __reg("a0") struct TmpRas * tmpras, __reg("a1") char * buff, __reg("d0") long size)="\tjsr\t-468(a6)";
#define InitTmpRas(tmpras, buff, size) __InitTmpRas(GfxBase, (tmpras), (buff), (size))

void __AskFont(__reg("a6") void *, __reg("a1") struct RastPort * a1arg, __reg("a0") struct TextAttr * textAttr)="\tjsr\t-474(a6)";
#define AskFont(a1arg, textAttr) __AskFont(GfxBase, (a1arg), (textAttr))

void __AddFont(__reg("a6") void *, __reg("a1") struct TextFont * textFont)="\tjsr\t-480(a6)";
#define AddFont(textFont) __AddFont(GfxBase, (textFont))

long __RemFont(__reg("a6") void *, __reg("a1") struct TextFont* textFont)="\tjsr\t-486(a6)";
#define RemFont(textFont) __RemFont(GfxBase, (textFont))

PLANEPTR __AllocRaster(__reg("a6") void *, __reg("d0") long width, __reg("d1") long height)="\tjsr\t-492(a6)";
#define AllocRaster(width, height) __AllocRaster(GfxBase, (width), (height))

void __FreeRaster(__reg("a6") void *, __reg("a0") PLANEPTR planeptr, __reg("d0") long width, __reg("d1") long height)="\tjsr\t-498(a6)";
#define FreeRaster(planeptr, width, height) __FreeRaster(GfxBase, (planeptr), (width), (height))

void __AndRectRegion(__reg("a6") void *, __reg("a0") struct Region * rgn, __reg("a1") struct Rectangle * rect)="\tjsr\t-504(a6)";
#define AndRectRegion(rgn, rect) __AndRectRegion(GfxBase, (rgn), (rect))

void __OrRectRegion(__reg("a6") void *, __reg("a0") struct Region * rgn, __reg("a1") struct Rectangle * rect)="\tjsr\t-510(a6)";
#define OrRectRegion(rgn, rect) __OrRectRegion(GfxBase, (rgn), (rect))

struct Region * __NewRegion(__reg("a6") void *)="\tjsr\t-516(a6)";
#define NewRegion() __NewRegion(GfxBase)

long __ClearRectRegion(__reg("a6") void *, __reg("a0") struct Region * rgn, __reg("a1") struct Rectangle * rect)="\tjsr\t-522(a6)";
#define ClearRectRegion(rgn, rect) __ClearRectRegion(GfxBase, (rgn), (rect))

void __ClearRegion(__reg("a6") void *, __reg("a0") struct Region * rgn)="\tjsr\t-528(a6)";
#define ClearRegion(rgn) __ClearRegion(GfxBase, (rgn))

void __DisposeRegion(__reg("a6") void *, __reg("a0") struct Region * rgn)="\tjsr\t-534(a6)";
#define DisposeRegion(rgn) __DisposeRegion(GfxBase, (rgn))

void __FreeVPortCopLists(__reg("a6") void *, __reg("a0") struct ViewPort * viewport)="\tjsr\t-540(a6)";
#define FreeVPortCopLists(viewport) __FreeVPortCopLists(GfxBase, (viewport))

void __FreeCopList(__reg("a6") void *, __reg("a0") struct CopList * coplist)="\tjsr\t-546(a6)";
#define FreeCopList(coplist) __FreeCopList(GfxBase, (coplist))

void __ClipBlit(__reg("a6") void *, __reg("a0") struct RastPort * srcrp, __reg("d0") long srcX, __reg("d1") long srcY, __reg("a1") struct RastPort * destrp, __reg("d2") long destX, __reg("d3") long destY, __reg("d4") long sizeX, __reg("d5") long sizeY, __reg("d6") long minterm)="\tjsr\t-552(a6)";
#define ClipBlit(srcrp, srcX, srcY, destrp, destX, destY, sizeX, sizeY, minterm) __ClipBlit(GfxBase, (srcrp), (srcX), (srcY), (destrp), (destX), (destY), (sizeX), (sizeY), (minterm))

void __XorRectRegion(__reg("a6") void *, __reg("a0") struct Region * rgn, __reg("a1") struct Rectangle * rect)="\tjsr\t-558(a6)";
#define XorRectRegion(rgn, rect) __XorRectRegion(GfxBase, (rgn), (rect))

void __FreeCprList(__reg("a6") void *, __reg("a0") struct cprlist * cprlist)="\tjsr\t-564(a6)";
#define FreeCprList(cprlist) __FreeCprList(GfxBase, (cprlist))

struct ColorMap * __GetColorMap(__reg("a6") void *, __reg("d0") long entries)="\tjsr\t-570(a6)";
#define GetColorMap(entries) __GetColorMap(GfxBase, (entries))

void __FreeColorMap(__reg("a6") void *, __reg("a0") struct ColorMap * colormap)="\tjsr\t-576(a6)";
#define FreeColorMap(colormap) __FreeColorMap(GfxBase, (colormap))

long __GetRGB4(__reg("a6") void *, __reg("a0") struct ColorMap * colormap, __reg("d0") long entry)="\tjsr\t-582(a6)";
#define GetRGB4(colormap, entry) __GetRGB4(GfxBase, (colormap), (entry))

void __ScrollVPort(__reg("a6") void *, __reg("a0") struct ViewPort * vp)="\tjsr\t-588(a6)";
#define ScrollVPort(vp) __ScrollVPort(GfxBase, (vp))

void __UCopperListInit(__reg("a6") void *, __reg("a0") struct UCopList * copperlist, __reg("d0") long num)="\tjsr\t-594(a6)";
#define UCopperListInit(copperlist, num) __UCopperListInit(GfxBase, (copperlist), (num))

void __FreeGBuffers(__reg("a6") void *, __reg("a0") struct AnimOb * animationObj, __reg("a1") struct RastPort * a1arg, __reg("d0") long doubleBuffer)="\tjsr\t-600(a6)";
#define FreeGBuffers(animationObj, a1arg, doubleBuffer) __FreeGBuffers(GfxBase, (animationObj), (a1arg), (doubleBuffer))

void __BltBitMapRastPort(__reg("a6") void *, __reg("a0") struct BitMap * srcbm, __reg("d0") long srcx, __reg("d1") long srcy, __reg("a1") struct RastPort * destrp, __reg("d2") long destX, __reg("d3") long destY, __reg("d4") long sizeX, __reg("d5") long sizeY, __reg("d6") long minterm)="\tjsr\t-606(a6)";
#define BltBitMapRastPort(srcbm, srcx, srcy, destrp, destX, destY, sizeX, sizeY, minterm) __BltBitMapRastPort(GfxBase, (srcbm), (srcx), (srcy), (destrp), (destX), (destY), (sizeX), (sizeY), (minterm))

long __OrRegionRegion(__reg("a6") void *, __reg("a0") struct Region * src, __reg("a1") struct Region * dst)="\tjsr\t-612(a6)";
#define OrRegionRegion(src, dst) __OrRegionRegion(GfxBase, (src), (dst))

long __XorRegionRegion(__reg("a6") void *, __reg("a0") struct Region * src, __reg("a1") struct Region * dst)="\tjsr\t-618(a6)";
#define XorRegionRegion(src, dst) __XorRegionRegion(GfxBase, (src), (dst))

long __AndRegionRegion(__reg("a6") void *, __reg("a0") struct Region * src, __reg("a1") struct Region * dst)="\tjsr\t-624(a6)";
#define AndRegionRegion(src, dst) __AndRegionRegion(GfxBase, (src), (dst))

void __SetRGB4CM(__reg("a6") void *, __reg("a0") struct ColorMap * cm, __reg("d0") long i, __reg("d1") long r, __reg("d2") long g, __reg("d3") long b)="\tjsr\t-630(a6)";
#define SetRGB4CM(cm, i, r, g, b) __SetRGB4CM(GfxBase, (cm), (i), (r), (g), (b))

void __BltMaskBitMapRastPort(__reg("a6") void *, __reg("a0") struct BitMap * srcbm, __reg("d0") long srcx, __reg("d1") long srcy, __reg("a1") struct RastPort * destrp, __reg("d2") long destX, __reg("d3") long destY, __reg("d4") long sizeX, __reg("d5") long sizeY, __reg("d6") long minterm, __reg("a2") APTR bltmask)="\tjsr\t-636(a6)";
#define BltMaskBitMapRastPort(srcbm, srcx, srcy, destrp, destX, destY, sizeX, sizeY, minterm, bltmask) __BltMaskBitMapRastPort(GfxBase, (srcbm), (srcx), (srcy), (destrp), (destX), (destY), (sizeX), (sizeY), (minterm), (bltmask))

long __AttemptLockLayerRom(__reg("a6") void *, __reg("a5") struct Layer * layer)="\tjsr\t-654(a6)";
#define AttemptLockLayerRom(layer) __AttemptLockLayerRom(GfxBase, (layer))

#endif /*  _VBCCINLINE_GRAPHICS_H  */
