/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct Layer_Info */
#ifndef GRAPHICS_LAYERS_H
#include <graphics/layers.h>
#endif

/* struct Layer, struct ClipRect */
#ifndef GRAPHICS_CLIP_H 
#include <graphics/clip.h>
#endif

/* struct Bitmap */
#ifndef GRAPHICS_GFX_H 
#include <graphics/gfx.h>
#endif

/* struct RastPort */
#ifndef GRAPHICS_RASTPORT_H 
#include <graphics/rasport.h>
#endif

/* struct Region */
#ifndef GRAPHICS_REGIONS_H 
#include <graphics/regions.h>
#endif

extern struct LayersBase *LayersBase;
/*layerlib routines*/
void InitLayers(struct Layer_Info *);
struct Layer *CreateUpfrontLayer(struct Layer_Info *, struct BitMap *, long, long, long, long, long, struct BitMap *);
struct Layer *CreateBehindLayer(struct Layer_Info *, struct BitMap *, long, long, long, long, long, struct BitMap *);
long UpfrontLayer(struct Layer_Info *, struct Layer *);
long BehindLayer(struct Layer_Info *, struct Layer *);
void MoveLayer(struct Layer_Info *, struct Layer *, long, long);
void SizeLayer(struct Layer_Info *, struct Layer *, long, long);
void ScrollLayer(struct Layer_Info *, struct Layer *, long, long);
void BeginUpdate(struct Layer *);
void EndUpdate(struct Layer *, long);
void DeleteLayer(struct Layer_Info *, struct Layer *);
void LockLayer(struct Layer_Info *, struct Layer *);
void UnlockLayer(struct Layer *);
void LockLayers(struct Layer_Info *);
void UnlockLayers(struct Layer_Info *);
void LockLayerInfo(struct Layer_Info *);
void SwapBitsRastPortClipRect(struct RastPort *, struct ClipRect *);
struct Layer *WhichLayer(struct Layer_Info *, long, long);
void UnlockLayerInfo(struct Layer_Info *);
struct Layer_Info *NewLayerInfo(void);
void DisposeLayerInfo(struct Layer_Info *);
void FattenLayerInfo(struct Layer_Info *);
void ThinLayerInfo(struct Layer_Info *);
long MoveLayerInFrontOf(struct Layer *, struct Layer *);
struct Region *InstallClipRegion(struct Layer *, struct Region *);
