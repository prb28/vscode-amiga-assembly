#ifndef _VBCCINLINE_LAYERS_H
#define _VBCCINLINE_LAYERS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __InitLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-30(a6)";
#define InitLayers(li) __InitLayers(LayersBase, (li))

struct Layer * __CreateUpfrontLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") LONG x0, __reg("d1") LONG y0, __reg("d2") LONG x1, __reg("d3") LONG y1, __reg("d4") LONG flags, __reg("a2") struct BitMap * bm2)="\tjsr\t-36(a6)";
#define CreateUpfrontLayer(li, bm, x0, y0, x1, y1, flags, bm2) __CreateUpfrontLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (bm2))

struct Layer * __CreateBehindLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") LONG x0, __reg("d1") LONG y0, __reg("d2") LONG x1, __reg("d3") LONG y1, __reg("d4") LONG flags, __reg("a2") struct BitMap * bm2)="\tjsr\t-42(a6)";
#define CreateBehindLayer(li, bm, x0, y0, x1, y1, flags, bm2) __CreateBehindLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (bm2))

LONG __UpfrontLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer)="\tjsr\t-48(a6)";
#define UpfrontLayer(dummy, layer) __UpfrontLayer(LayersBase, (void *)(dummy), (layer))

LONG __BehindLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer)="\tjsr\t-54(a6)";
#define BehindLayer(dummy, layer) __BehindLayer(LayersBase, (void *)(dummy), (layer))

LONG __MoveLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-60(a6)";
#define MoveLayer(dummy, layer, dx, dy) __MoveLayer(LayersBase, (void *)(dummy), (layer), (dx), (dy))

LONG __SizeLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-66(a6)";
#define SizeLayer(dummy, layer, dx, dy) __SizeLayer(LayersBase, (void *)(dummy), (layer), (dx), (dy))

VOID __ScrollLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-72(a6)";
#define ScrollLayer(dummy, layer, dx, dy) __ScrollLayer(LayersBase, (void *)(dummy), (layer), (dx), (dy))

LONG __BeginUpdate(__reg("a6") void *, __reg("a0") struct Layer * l)="\tjsr\t-78(a6)";
#define BeginUpdate(l) __BeginUpdate(LayersBase, (l))

VOID __EndUpdate(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("d0") ULONG flag)="\tjsr\t-84(a6)";
#define EndUpdate(layer, flag) __EndUpdate(LayersBase, (layer), (flag))

LONG __DeleteLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer)="\tjsr\t-90(a6)";
#define DeleteLayer(dummy, layer) __DeleteLayer(LayersBase, (void *)(dummy), (layer))

VOID __LockLayer(__reg("a6") void *, __reg("a0") void * dummy, __reg("a1") struct Layer * layer)="\tjsr\t-96(a6)";
#define LockLayer(dummy, layer) __LockLayer(LayersBase, (void *)(dummy), (layer))

VOID __UnlockLayer(__reg("a6") void *, __reg("a0") struct Layer * layer)="\tjsr\t-102(a6)";
#define UnlockLayer(layer) __UnlockLayer(LayersBase, (layer))

VOID __LockLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-108(a6)";
#define LockLayers(li) __LockLayers(LayersBase, (li))

VOID __UnlockLayers(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-114(a6)";
#define UnlockLayers(li) __UnlockLayers(LayersBase, (li))

VOID __LockLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-120(a6)";
#define LockLayerInfo(li) __LockLayerInfo(LayersBase, (li))

VOID __SwapBitsRastPortClipRect(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct ClipRect * cr)="\tjsr\t-126(a6)";
#define SwapBitsRastPortClipRect(rp, cr) __SwapBitsRastPortClipRect(LayersBase, (rp), (cr))

struct Layer * __WhichLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("d0") LONG x, __reg("d1") LONG y)="\tjsr\t-132(a6)";
#define WhichLayer(li, x, y) __WhichLayer(LayersBase, (li), (x), (y))

VOID __UnlockLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-138(a6)";
#define UnlockLayerInfo(li) __UnlockLayerInfo(LayersBase, (li))

struct Layer_Info * __NewLayerInfo(__reg("a6") void *)="\tjsr\t-144(a6)";
#define NewLayerInfo() __NewLayerInfo(LayersBase)

VOID __DisposeLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-150(a6)";
#define DisposeLayerInfo(li) __DisposeLayerInfo(LayersBase, (li))

LONG __FattenLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-156(a6)";
#define FattenLayerInfo(li) __FattenLayerInfo(LayersBase, (li))

VOID __ThinLayerInfo(__reg("a6") void *, __reg("a0") struct Layer_Info * li)="\tjsr\t-162(a6)";
#define ThinLayerInfo(li) __ThinLayerInfo(LayersBase, (li))

LONG __MoveLayerInFrontOf(__reg("a6") void *, __reg("a0") struct Layer * layer_to_move, __reg("a1") struct Layer * other_layer)="\tjsr\t-168(a6)";
#define MoveLayerInFrontOf(layer_to_move, other_layer) __MoveLayerInFrontOf(LayersBase, (layer_to_move), (other_layer))

struct Region * __InstallClipRegion(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("a1") CONST struct Region * region)="\tjsr\t-174(a6)";
#define InstallClipRegion(layer, region) __InstallClipRegion(LayersBase, (layer), (region))

LONG __MoveSizeLayer(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("d0") LONG dx, __reg("d1") LONG dy, __reg("d2") LONG dw, __reg("d3") LONG dh)="\tjsr\t-180(a6)";
#define MoveSizeLayer(layer, dx, dy, dw, dh) __MoveSizeLayer(LayersBase, (layer), (dx), (dy), (dw), (dh))

struct Layer * __CreateUpfrontHookLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") LONG x0, __reg("d1") LONG y0, __reg("d2") LONG x1, __reg("d3") LONG y1, __reg("d4") LONG flags, __reg("a3") struct Hook * hook, __reg("a2") struct BitMap * bm2)="\tjsr\t-186(a6)";
#define CreateUpfrontHookLayer(li, bm, x0, y0, x1, y1, flags, hook, bm2) __CreateUpfrontHookLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (hook), (bm2))

struct Layer * __CreateBehindHookLayer(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") struct BitMap * bm, __reg("d0") LONG x0, __reg("d1") LONG y0, __reg("d2") LONG x1, __reg("d3") LONG y1, __reg("d4") LONG flags, __reg("a3") struct Hook * hook, __reg("a2") struct BitMap * bm2)="\tjsr\t-192(a6)";
#define CreateBehindHookLayer(li, bm, x0, y0, x1, y1, flags, hook, bm2) __CreateBehindHookLayer(LayersBase, (li), (bm), (x0), (y0), (x1), (y1), (flags), (hook), (bm2))

struct Hook * __InstallLayerHook(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("a1") struct Hook * hook)="\tjsr\t-198(a6)";
#define InstallLayerHook(layer, hook) __InstallLayerHook(LayersBase, (layer), (hook))

struct Hook * __InstallLayerInfoHook(__reg("a6") void *, __reg("a0") struct Layer_Info * li, __reg("a1") CONST struct Hook * hook)="\tjsr\t-204(a6)";
#define InstallLayerInfoHook(li, hook) __InstallLayerInfoHook(LayersBase, (li), (hook))

VOID __SortLayerCR(__reg("a6") void *, __reg("a0") struct Layer * layer, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-210(a6)";
#define SortLayerCR(layer, dx, dy) __SortLayerCR(LayersBase, (layer), (dx), (dy))

VOID __DoHookClipRects(__reg("a6") void *, __reg("a0") struct Hook * hook, __reg("a1") struct RastPort * rport, __reg("a2") CONST struct Rectangle * rect)="\tjsr\t-216(a6)";
#define DoHookClipRects(hook, rport, rect) __DoHookClipRects(LayersBase, (hook), (rport), (rect))

#endif /*  _VBCCINLINE_LAYERS_H  */
