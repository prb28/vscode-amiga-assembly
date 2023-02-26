/* UBYTE */
#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

/* struct GfxBase */
#ifndef GRAPHICS_GFXBASE_H 
#include <graphics/gfxbase.h>
#endif

/* struct BitMap, struct Rectangle */
#ifndef GRAPHICS_GFX_H 
#include <graphics/gfx.h>
#endif

/* struct AreaInfo, struct GelsInfo, struct RastPort, struct TmpRas */
#ifndef GRAPHICS_RASTPORT_H 
#include <graphics/rastport.h>
#endif

/* struct ColorMap, struct View, struct ViewPort */
#ifndef GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif

/* struct TextFont, struct TextAttr */
#ifndef GRAPHICS_TEXT_H 
#include <graphics/text.h>
#endif

/* struct AnimOb, struct Bob, struct VSprite, */
#ifndef GRAPHICS_GELS_H 
#include <graphics/gels.h>
#endif

/* struct bltnode */
#ifndef HARDWARE_BLIT_H 
#include <hardware/blit.h>
#endif

/* struct SimpleSprite */
#ifndef GRAPHICS_SPRITE_H 
#include <graphics/sprite.h>
#endif

/* struct Layer */
#ifndef GRAPHICS_CLIP_H 
#include <graphics/clip.h>
#endif

/* struct Region */
#ifndef GRAPHICS_REGIONS_H 
#include <graphics/regions.h>
#endif

/* struct CopList, struct cprlist, struct UCopList */
#ifndef GRAPHICS_COPPER_H 
#include <graphics/copper.h>
#endif

extern struct GfxBase *GfxBase;
typedef void (*__fgptr)();
/*------ Text routines*/
long BltBitMap(struct BitMap *, long, long, struct BitMap*,long, long, long, long, long, long, char *);
void BltTemplate(char *, long, long, struct RastPort *, long, long, long, long);
void ClearEOL(struct RastPort *);
void ClearScreen(struct RastPort *);
long TextLength(struct RastPort *, char *, long);
long Text(struct RastPort *, char *, long);
long SetFont(struct RastPort *, struct TextFont*);
struct TextFont *OpenFont(struct TextAttr *);
void CloseFont(struct TextFont *);
long AskSoftStyle(struct RastPort *);
long SetSoftStyle(struct RastPort *, long, long);
/*------	Gels routines ------*/
void AddBob(struct Bob *, struct RastPort *);
void AddVSprite(struct VSprite *, struct RastPort *);
void DoCollision(struct RastPort *);
void DrawGList(struct RastPort *, struct ViewPort *);
void InitGels(struct VSprite *, struct VSprite *, struct GelsInfo *);
void InitMasks(struct VSprite *);
void RemIBob(struct Bob *, struct RastPort *, struct ViewPort *);
void RemVSprite(struct VSprite *);
void SetCollision(long, __fgptr, struct GelsInfo*);
void SortGList(struct RastPort *);
void AddAnimOb(struct AnimOb *, long, struct RastPort *);
void Animate(long, struct RastPort *);
void GetGBuffers(struct AnimOb *, struct RastPort *, long);
void InitGMasks(struct AnimOb *);
void DrawEllipse(struct RastPort *, long, long, long, long);
long AreaEllipse(struct RastPort *, long, long, long, long);
/*------	Remaining graphics routines ------*/
void LoadRGB4(struct ViewPort *, short *, long);
void InitRastPort(struct RastPort *);
void InitVPort(struct ViewPort *);
void MrgCop(struct View *);
void MakeVPort(struct View *, struct ViewPort *);
void LoadView(struct View *);
void WaitBlit(void);
void SetRast(struct RastPort *, long);
void Move(struct RastPort *, long, long);
void Draw(struct RastPort *, long, long);
long AreaMove(struct RastPort *, long, long);
long AreaDraw(struct RastPort *, long, long);
void AreaEnd(struct RastPort *);
void WaitTOF(void);
void QBlit(struct bltnode *);
void InitArea(struct AreaInfo *, short *, long);
void SetRGB4(struct ViewPort *, long, long, long, long);
void QBSBlit(struct bltnode *);
void BltClear(char *, long, long);
void RectFill(struct RastPort *, long, long, long, long);
void BltPattern(struct RastPort *, struct RastPort *, long, long, long, long, long);
long ReadPixel(struct RastPort *, long, long);
void WritePixel(struct RastPort *, long, long);
void Flood(struct RastPort *, long, long, long);
void PolyDraw(struct RastPort *, long, short *);
void SetAPen(struct RastPort *, long);
void SetBPen(struct RastPort *, long);
void SetDrMd(struct RastPort *, long);
void InitView(struct View *);
void CBump(struct UCopList *);
void CMove(struct UCopList *, long, long);
void CWait(struct UCopList *, long, long);
long VBeamPos(void);
void InitBitMap(struct BitMap *, long, long, long);
void ScrollRaster(struct RastPort *, long, long, long, long, long, long);
void WaitBOVP(struct ViewPort *);
long GetSprite(struct SimpleSprite *, long);
void FreeSprite(long);
void ChangeSprite(struct ViewPort *, struct SimpleSprite *, short *);
void MoveSprite(struct ViewPort *, struct SimpleSprite *, long, long);
void LockLayerRom(struct Layer *);
void UnlockLayerRom(struct Layer *);
void SyncSBitMap(struct Layer *);
void CopySBitMap(struct Layer *);
void OwnBlitter(void);
void DisownBlitter(void);
struct TmpRas *InitTmpRas(struct TmpRas *, char *, long);
void AskFont(struct RastPort *, struct TextAttr *);
void AddFont(struct TextFont *);
long RemFont(struct TextFont*);
PLANEPTR AllocRaster(long, long);
void FreeRaster(PLANEPTR, long, long);
void AndRectRegion(struct Region *, struct Rectangle *);
void OrRectRegion(struct Region *, struct Rectangle *);
struct Region *NewRegion(void);
long ClearRectRegion(struct Region *, struct Rectangle *);
void ClearRegion(struct Region *);
void DisposeRegion(struct Region *);
void FreeVPortCopLists(struct ViewPort *);
void FreeCopList(struct CopList *);
void ClipBlit(struct RastPort *, long, long, struct RastPort *, long, long, long, long, long);
void XorRectRegion(struct Region *, struct Rectangle *);
void FreeCprList(struct cprlist *);
struct ColorMap *GetColorMap(long);
void FreeColorMap(struct ColorMap *);
long GetRGB4(struct ColorMap *, long);
void ScrollVPort(struct ViewPort *);
void UCopperListInit(struct UCopList *, long);
void FreeGBuffers(struct AnimOb *, struct RastPort *, long);
void BltBitMapRastPort(struct BitMap *, long, long, struct RastPort *, long, long, long, long, long);
long OrRegionRegion(struct Region *, struct Region *);
long XorRegionRegion(struct Region *, struct Region *);
long AndRegionRegion(struct Region *, struct Region *);
void SetRGB4CM(struct ColorMap *, long, long, long, long);
void BltMaskBitMapRastPort(struct BitMap *,long, long, struct RastPort *,long,long,long,long,long,APTR);
long AttemptLockLayerRom(struct Layer *);
