#ifndef CLIB_GRAPHICS_PROTOS_H
#define CLIB_GRAPHICS_PROTOS_H


/*
**	$VER: graphics_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif
#ifndef  GRAPHICS_GELS_H
#include <graphics/gels.h>
#endif
#ifndef  GRAPHICS_RASTPORT_H
#include <graphics/rastport.h>
#endif
#ifndef  GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif
#ifndef  GRAPHICS_COPPER_H
#include <graphics/copper.h>
#endif
#ifndef  GRAPHICS_CLIP_H
#include <graphics/clip.h>
#endif
#ifndef  GRAPHICS_REGIONS_H
#include <graphics/regions.h>
#endif
#ifndef  GRAPHICS_SPRITE_H
#include <graphics/sprite.h>
#endif
#ifndef  GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif
#ifndef  HARDWARE_BLIT_H
#include <hardware/blit.h>
#endif

LONG BltBitMap(const struct BitMap * srcBitMap, LONG xSrc, LONG ySrc,
	struct BitMap * destBitMap, LONG xDest, LONG yDest, LONG xSize,
	LONG ySize, ULONG minterm, ULONG mask, PLANEPTR tempA);
VOID BltTemplate(const PLANEPTR source, LONG xSrc, LONG srcMod, struct RastPort * destRP,
	LONG xDest, LONG yDest, LONG xSize, LONG ySize);
VOID ClearEOL(struct RastPort * rp);
VOID ClearScreen(struct RastPort * rp);
WORD TextLength(struct RastPort * rp, const STRPTR string, ULONG count);
LONG Text(struct RastPort * rp, const STRPTR string, ULONG count);
LONG SetFont(struct RastPort * rp, const struct TextFont * textFont);
struct TextFont * OpenFont(struct TextAttr * textAttr);
VOID CloseFont(struct TextFont * textFont);
ULONG AskSoftStyle(struct RastPort * rp);
ULONG SetSoftStyle(struct RastPort * rp, ULONG style, ULONG enable);
VOID AddBob(struct Bob * bob, struct RastPort * rp);
VOID AddVSprite(struct VSprite * vSprite, struct RastPort * rp);
VOID DoCollision(struct RastPort * rp);
VOID DrawGList(struct RastPort * rp, struct ViewPort * vp);
VOID InitGels(struct VSprite * head, struct VSprite * tail,
	struct GelsInfo * gelsInfo);
VOID InitMasks(struct VSprite * vSprite);
VOID RemIBob(struct Bob * bob, struct RastPort * rp, struct ViewPort * vp);
VOID RemVSprite(struct VSprite * vSprite);
VOID SetCollision(ULONG num, VOID (*routine)(struct VSprite *gelA, struct VSprite *gelB),
	struct GelsInfo * gelsInfo);
VOID SortGList(struct RastPort * rp);
VOID AddAnimOb(struct AnimOb * anOb, struct AnimOb ** anKey, struct RastPort * rp);
VOID Animate(struct AnimOb ** anKey, struct RastPort * rp);
BOOL GetGBuffers(struct AnimOb * anOb, struct RastPort * rp, LONG flag);
VOID InitGMasks(struct AnimOb * anOb);
VOID DrawEllipse(struct RastPort * rp, LONG xCenter, LONG yCenter, LONG a, LONG b);
LONG AreaEllipse(struct RastPort * rp, LONG xCenter, LONG yCenter, LONG a, LONG b);
VOID LoadRGB4(struct ViewPort * vp, const UWORD * colors, LONG count);
VOID InitRastPort(struct RastPort * rp);
VOID InitVPort(struct ViewPort * vp);
ULONG MrgCop(struct View * view);
ULONG MakeVPort(struct View * view, struct ViewPort * vp);
VOID LoadView(struct View * view);
VOID WaitBlit(void);
VOID SetRast(struct RastPort * rp, ULONG pen);
VOID Move(struct RastPort * rp, LONG x, LONG y);
VOID Draw(struct RastPort * rp, LONG x, LONG y);
LONG AreaMove(struct RastPort * rp, LONG x, LONG y);
LONG AreaDraw(struct RastPort * rp, LONG x, LONG y);
LONG AreaEnd(struct RastPort * rp);
VOID WaitTOF(void);
VOID QBlit(struct bltnode * blit);
VOID InitArea(struct AreaInfo * areaInfo, void * vectorBuffer, LONG maxVectors);
VOID SetRGB4(struct ViewPort * vp, LONG index, ULONG red, ULONG green, ULONG blue);
VOID QBSBlit(struct bltnode * blit);
VOID BltClear(PLANEPTR memBlock, ULONG byteCount, ULONG flags);
VOID RectFill(struct RastPort * rp, LONG xMin, LONG yMin, LONG xMax, LONG yMax);
VOID BltPattern(struct RastPort * rp, const PLANEPTR mask, LONG xMin, LONG yMin,
	LONG xMax, LONG yMax, ULONG maskBPR);
ULONG ReadPixel(struct RastPort * rp, LONG x, LONG y);
LONG WritePixel(struct RastPort * rp, LONG x, LONG y);
BOOL Flood(struct RastPort * rp, ULONG mode, LONG x, LONG y);
VOID PolyDraw(struct RastPort * rp, LONG count, const WORD * polyTable);
VOID SetAPen(struct RastPort * rp, ULONG pen);
VOID SetBPen(struct RastPort * rp, ULONG pen);
VOID SetDrMd(struct RastPort * rp, ULONG drawMode);
VOID InitView(struct View * view);
VOID CBump(struct UCopList * copList);
VOID CMove(struct UCopList * copList, void * destination, LONG data);
VOID CWait(struct UCopList * copList, LONG v, LONG h);
LONG VBeamPos(void);
VOID InitBitMap(struct BitMap * bitMap, LONG depth, LONG width, LONG height);
VOID ScrollRaster(struct RastPort * rp, LONG dx, LONG dy, LONG xMin, LONG yMin, LONG xMax,
	LONG yMax);
VOID WaitBOVP(struct ViewPort * vp);
WORD GetSprite(struct SimpleSprite * sprite, LONG num);
VOID FreeSprite(LONG num);
VOID ChangeSprite(struct ViewPort * vp, struct SimpleSprite * sprite, UWORD * newData);
VOID MoveSprite(struct ViewPort * vp, struct SimpleSprite * sprite, LONG x, LONG y);
VOID LockLayerRom(struct Layer * layer);
VOID UnlockLayerRom(struct Layer * layer);
VOID SyncSBitMap(struct Layer * layer);
VOID CopySBitMap(struct Layer * layer);
VOID OwnBlitter(void);
VOID DisownBlitter(void);
struct TmpRas * InitTmpRas(struct TmpRas * tmpRas, PLANEPTR buffer, LONG size);
VOID AskFont(struct RastPort * rp, struct TextAttr * textAttr);
VOID AddFont(struct TextFont * textFont);
VOID RemFont(struct TextFont * textFont);
PLANEPTR AllocRaster(ULONG width, ULONG height);
VOID FreeRaster(PLANEPTR p, ULONG width, ULONG height);
VOID AndRectRegion(struct Region * region, const struct Rectangle * rectangle);
BOOL OrRectRegion(struct Region * region, const struct Rectangle * rectangle);
struct Region * NewRegion(void);
BOOL ClearRectRegion(struct Region * region, const struct Rectangle * rectangle);
VOID ClearRegion(struct Region * region);
VOID DisposeRegion(struct Region * region);
VOID FreeVPortCopLists(struct ViewPort * vp);
VOID FreeCopList(struct CopList * copList);
VOID ClipBlit(struct RastPort * srcRP, LONG xSrc, LONG ySrc, struct RastPort * destRP,
	LONG xDest, LONG yDest, LONG xSize, LONG ySize, ULONG minterm);
BOOL XorRectRegion(struct Region * region, const struct Rectangle * rectangle);
VOID FreeCprList(struct cprlist * cprList);
struct ColorMap * GetColorMap(LONG entries);
VOID FreeColorMap(struct ColorMap * colorMap);
ULONG GetRGB4(struct ColorMap * colorMap, LONG entry);
VOID ScrollVPort(struct ViewPort * vp);
struct CopList * UCopperListInit(struct UCopList * uCopList, LONG n);
VOID FreeGBuffers(struct AnimOb * anOb, struct RastPort * rp, LONG flag);
VOID BltBitMapRastPort(const struct BitMap * srcBitMap, LONG xSrc, LONG ySrc,
	struct RastPort * destRP, LONG xDest, LONG yDest, LONG xSize,
	LONG ySize, ULONG minterm);
BOOL OrRegionRegion(const struct Region * srcRegion, struct Region * destRegion);
BOOL XorRegionRegion(const struct Region * srcRegion, struct Region * destRegion);
BOOL AndRegionRegion(const struct Region * srcRegion, struct Region * destRegion);
VOID SetRGB4CM(struct ColorMap * colorMap, LONG index, ULONG red, ULONG green,
	ULONG blue);
VOID BltMaskBitMapRastPort(const struct BitMap * srcBitMap, LONG xSrc, LONG ySrc,
	struct RastPort * destRP, LONG xDest, LONG yDest, LONG xSize,
	LONG ySize, ULONG minterm, const PLANEPTR bltMask);
BOOL AttemptLockLayerRom(struct Layer * layer);

#endif	/*  CLIB_GRAPHICS_PROTOS_H  */
