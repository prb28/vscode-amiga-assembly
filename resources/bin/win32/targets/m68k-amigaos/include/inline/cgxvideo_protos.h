#ifndef _VBCCINLINE_CGXVIDEO_H
#define _VBCCINLINE_CGXVIDEO_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct VLayerHandle * __CreateVLayerHandleTagList(__reg("a6") void *, __reg("a0") struct Screen * Screen, __reg("a1") struct TagItem * Tags)="\tjsr\t-30(a6)";
#define CreateVLayerHandleTagList(Screen, Tags) __CreateVLayerHandleTagList(CGXVideoBase, (Screen), (Tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct VLayerHandle * __CreateVLayerHandleTags(__reg("a6") void *, __reg("a0") struct Screen * Screen, Tag Tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a1";
#define CreateVLayerHandleTags(Screen, ...) __CreateVLayerHandleTags(CGXVideoBase, (Screen), __VA_ARGS__)
#endif

ULONG __DeleteVLayerHandle(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle)="\tjsr\t-36(a6)";
#define DeleteVLayerHandle(VLayerHandle) __DeleteVLayerHandle(CGXVideoBase, (VLayerHandle))

ULONG __AttachVLayerTagList(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle, __reg("a1") struct Window * Window, __reg("a2") struct TagItem * Tags)="\tjsr\t-42(a6)";
#define AttachVLayerTagList(VLayerHandle, Window, Tags) __AttachVLayerTagList(CGXVideoBase, (VLayerHandle), (Window), (Tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __AttachVLayerTags(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle, __reg("a1") struct Window * Window, Tag Tags, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a2";
#define AttachVLayerTags(VLayerHandle, Window, ...) __AttachVLayerTags(CGXVideoBase, (VLayerHandle), (Window), __VA_ARGS__)
#endif

ULONG __DetachVLayer(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle)="\tjsr\t-48(a6)";
#define DetachVLayer(VLayerHandle) __DetachVLayer(CGXVideoBase, (VLayerHandle))

ULONG __GetVLayerAttr(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle, __reg("d0") ULONG AttrID)="\tjsr\t-54(a6)";
#define GetVLayerAttr(VLayerHandle, AttrID) __GetVLayerAttr(CGXVideoBase, (VLayerHandle), (AttrID))

ULONG __LockVLayer(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle)="\tjsr\t-60(a6)";
#define LockVLayer(VLayerHandle) __LockVLayer(CGXVideoBase, (VLayerHandle))

ULONG __UnlockVLayer(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle)="\tjsr\t-66(a6)";
#define UnlockVLayer(VLayerHandle) __UnlockVLayer(CGXVideoBase, (VLayerHandle))

void __SetVLayerAttrTagList(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle, __reg("a1") struct TagItem * Tags)="\tjsr\t-72(a6)";
#define SetVLayerAttrTagList(VLayerHandle, Tags) __SetVLayerAttrTagList(CGXVideoBase, (VLayerHandle), (Tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __SetVLayerAttrTags(__reg("a6") void *, __reg("a0") struct VLayerHandle * VLayerHandle, Tag Tags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-72(a6)\n\tmovea.l\t(a7)+,a1";
#define SetVLayerAttrTags(VLayerHandle, ...) __SetVLayerAttrTags(CGXVideoBase, (VLayerHandle), __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_CGXVIDEO_H  */
