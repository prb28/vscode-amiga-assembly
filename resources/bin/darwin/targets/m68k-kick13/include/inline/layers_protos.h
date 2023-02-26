#ifndef _VBCCINLINE_LAYERS_H
#define _VBCCINLINE_LAYERS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

void __InitLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-30(a6)";
#define InitLayers(li) __InitLayers(LayersBase, (li))

struct Layer * __CreateUpfrontLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") long x0, __reg("d1") long y0, __reg("d2") long x1, __reg("d3") long y1, __reg("d4") long flags, __reg("a2") struct BitMap * bm2)="\tjsr\t-36(a6)";
#define CreateUpfrontLayer(li, bm, x0, y0, x1, y1, flags, bm2) __CreateUpfrontLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (bm2))

struct Layer * __CreateBehindLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") long x0, __reg("d1") long y0, __reg("d2") long x1, __reg("d3") long y1, __reg("d4") long flags, __reg("a2") struct BitMap * bm2)="\tjsr\t-42(a6)";
#define CreateBehindLayer(li, bm, x0, y0, x1, y1, flags, bm2) __CreateBehindLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (bm2))

long __UpfrontLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer)="\tjsr\t-48(a6)";
#define UpfrontLayer(li, layer) __UpfrontLayer(LayersBase, (li), (layer))

long __BehindLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer)="\tjsr\t-54(a6)";
#define BehindLayer(li, layer) __BehindLayer(LayersBase, (li), (layer))

void __MoveLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-60(a6)";
#define MoveLayer(li, layer, dx, dy) __MoveLayer(LayersBase, (li), (layer), (dx), (dy))

void __SizeLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-66(a6)";
#define SizeLayer(li, layer, dx, dy) __SizeLayer(LayersBase, (li), (layer), (dx), (dy))

void __ScrollLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-72(a6)";
#define ScrollLayer(li, layer, dx, dy) __ScrollLayer(LayersBase, (li), (layer), (dx), (dy))

void __BeginUpdate(__reg("a6") void *, __reg("a0") struct Layer * layer)="\tjsr\t-78(a6)";
#define BeginUpdate(layer) __BeginUpdate(LayersBase, (layer))

void __EndUpdate(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("d0") long flag)="\tjsr\t-84(a6)";
#define EndUpdate(layer, flag) __EndUpdate(LayersBase, (layer), (flag))

void __DeleteLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer)="\tjsr\t-90(a6)";
#define DeleteLayer(li, layer) __DeleteLayer(LayersBase, (li), (layer))

void __LockLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct Layer * layer)="\tjsr\t-96(a6)";
#define LockLayer(li, layer) __LockLayer(LayersBase, (li), (layer))

void __UnlockLayer(__reg("a6") void *, __reg("a0") struct Layer * layer)="\tjsr\t-102(a6)";
#define UnlockLayer(layer) __UnlockLayer(LayersBase, (layer))

void __LockLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-108(a6)";
#define LockLayers(li) __LockLayers(LayersBase, (li))

void __UnlockLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-114(a6)";
#define UnlockLayers(li) __UnlockLayers(LayersBase, (li))

void __LockLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-120(a6)";
#define LockLayerInfo(li) __LockLayerInfo(LayersBase, (li))

void __SwapBitsRastPortClipRect(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct ClipRect * cr)="\tjsr\t-126(a6)";
#define SwapBitsRastPortClipRect(rp, cr) __SwapBitsRastPortClipRect(LayersBase, (rp), (cr))

struct Layer * __WhichLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("d0") long x, __reg("d1") long y)="\tjsr\t-132(a6)";
#define WhichLayer(li, x, y) __WhichLayer(LayersBase, (li), (x), (y))

void __UnlockLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-138(a6)";
#define UnlockLayerInfo(li) __UnlockLayerInfo(LayersBase, (li))

struct Layer_Info * __NewLayerInfo(__reg("a6") void *)="\tjsr\t-144(a6)";
#define NewLayerInfo() __NewLayerInfo(LayersBase)

void __DisposeLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-150(a6)";
#define DisposeLayerInfo(li) __DisposeLayerInfo(LayersBase, (li))

void __FattenLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-156(a6)";
#define FattenLayerInfo(li) __FattenLayerInfo(LayersBase, (li))

void __ThinLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-162(a6)";
#define ThinLayerInfo(li) __ThinLayerInfo(LayersBase, (li))

long __MoveLayerInFrontOf(__reg("a6") void *, __reg("a0") struct Layer * layer_to_move, __reg("a1") struct Layer * layer_to_be_infront_of)="\tjsr\t-168(a6)";
#define MoveLayerInFrontOf(layer_to_move, layer_to_be_infront_of) __MoveLayerInFrontOf(LayersBase, (layer_to_move), (layer_to_be_infront_of))

struct Region * __InstallClipRegion(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("a1") struct Region * region)="\tjsr\t-174(a6)";
#define InstallClipRegion(layer, region) __InstallClipRegion(LayersBase, (layer), (region))

#endif /*  _VBCCINLINE_LAYERS_H  */
