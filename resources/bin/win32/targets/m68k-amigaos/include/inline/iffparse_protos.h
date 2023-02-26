#ifndef _VBCCINLINE_IFFPARSE_H
#define _VBCCINLINE_IFFPARSE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct IFFHandle * __AllocIFF(__reg("a6") void *)="\tjsr\t-30(a6)";
#define AllocIFF() __AllocIFF(IFFParseBase)

LONG __OpenIFF(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG rwMode)="\tjsr\t-36(a6)";
#define OpenIFF(iff, rwMode) __OpenIFF(IFFParseBase, (iff), (rwMode))

LONG __ParseIFF(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG control)="\tjsr\t-42(a6)";
#define ParseIFF(iff, control) __ParseIFF(IFFParseBase, (iff), (control))

VOID __CloseIFF(__reg("a6") void *, __reg("a0") struct IFFHandle * iff)="\tjsr\t-48(a6)";
#define CloseIFF(iff) __CloseIFF(IFFParseBase, (iff))

VOID __FreeIFF(__reg("a6") void *, __reg("a0") struct IFFHandle * iff)="\tjsr\t-54(a6)";
#define FreeIFF(iff) __FreeIFF(IFFParseBase, (iff))

LONG __ReadChunkBytes(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") APTR buf, __reg("d0") LONG numBytes)="\tjsr\t-60(a6)";
#define ReadChunkBytes(iff, buf, numBytes) __ReadChunkBytes(IFFParseBase, (iff), (buf), (numBytes))

LONG __WriteChunkBytes(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") CONST APTR buf, __reg("d0") LONG numBytes)="\tjsr\t-66(a6)";
#define WriteChunkBytes(iff, buf, numBytes) __WriteChunkBytes(IFFParseBase, (iff), (buf), (numBytes))

LONG __ReadChunkRecords(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") APTR buf, __reg("d0") LONG bytesPerRecord, __reg("d1") LONG numRecords)="\tjsr\t-72(a6)";
#define ReadChunkRecords(iff, buf, bytesPerRecord, numRecords) __ReadChunkRecords(IFFParseBase, (iff), (buf), (bytesPerRecord), (numRecords))

LONG __WriteChunkRecords(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") CONST APTR buf, __reg("d0") LONG bytesPerRecord, __reg("d1") LONG numRecords)="\tjsr\t-78(a6)";
#define WriteChunkRecords(iff, buf, bytesPerRecord, numRecords) __WriteChunkRecords(IFFParseBase, (iff), (buf), (bytesPerRecord), (numRecords))

LONG __PushChunk(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id, __reg("d2") LONG size)="\tjsr\t-84(a6)";
#define PushChunk(iff, type, id, size) __PushChunk(IFFParseBase, (iff), (type), (id), (size))

LONG __PopChunk(__reg("a6") void *, __reg("a0") struct IFFHandle * iff)="\tjsr\t-90(a6)";
#define PopChunk(iff) __PopChunk(IFFParseBase, (iff))

LONG __EntryHandler(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id, __reg("d2") LONG position, __reg("a1") struct Hook * handler, __reg("a2") APTR object)="\tjsr\t-102(a6)";
#define EntryHandler(iff, type, id, position, handler, object) __EntryHandler(IFFParseBase, (iff), (type), (id), (position), (handler), (object))

LONG __ExitHandler(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id, __reg("d2") LONG position, __reg("a1") struct Hook * handler, __reg("a2") APTR object)="\tjsr\t-108(a6)";
#define ExitHandler(iff, type, id, position, handler, object) __ExitHandler(IFFParseBase, (iff), (type), (id), (position), (handler), (object))

LONG __PropChunk(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-114(a6)";
#define PropChunk(iff, type, id) __PropChunk(IFFParseBase, (iff), (type), (id))

LONG __PropChunks(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") CONST LONG * propArray, __reg("d0") LONG numPairs)="\tjsr\t-120(a6)";
#define PropChunks(iff, propArray, numPairs) __PropChunks(IFFParseBase, (iff), (propArray), (numPairs))

LONG __StopChunk(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-126(a6)";
#define StopChunk(iff, type, id) __StopChunk(IFFParseBase, (iff), (type), (id))

LONG __StopChunks(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") CONST LONG * propArray, __reg("d0") LONG numPairs)="\tjsr\t-132(a6)";
#define StopChunks(iff, propArray, numPairs) __StopChunks(IFFParseBase, (iff), (propArray), (numPairs))

LONG __CollectionChunk(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-138(a6)";
#define CollectionChunk(iff, type, id) __CollectionChunk(IFFParseBase, (iff), (type), (id))

LONG __CollectionChunks(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") CONST LONG * propArray, __reg("d0") LONG numPairs)="\tjsr\t-144(a6)";
#define CollectionChunks(iff, propArray, numPairs) __CollectionChunks(IFFParseBase, (iff), (propArray), (numPairs))

LONG __StopOnExit(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-150(a6)";
#define StopOnExit(iff, type, id) __StopOnExit(IFFParseBase, (iff), (type), (id))

struct StoredProperty * __FindProp(__reg("a6") void *, __reg("a0") CONST struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-156(a6)";
#define FindProp(iff, type, id) __FindProp(IFFParseBase, (iff), (type), (id))

struct CollectionItem * __FindCollection(__reg("a6") void *, __reg("a0") CONST struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id)="\tjsr\t-162(a6)";
#define FindCollection(iff, type, id) __FindCollection(IFFParseBase, (iff), (type), (id))

struct ContextNode * __FindPropContext(__reg("a6") void *, __reg("a0") CONST struct IFFHandle * iff)="\tjsr\t-168(a6)";
#define FindPropContext(iff) __FindPropContext(IFFParseBase, (iff))

struct ContextNode * __CurrentChunk(__reg("a6") void *, __reg("a0") CONST struct IFFHandle * iff)="\tjsr\t-174(a6)";
#define CurrentChunk(iff) __CurrentChunk(IFFParseBase, (iff))

struct ContextNode * __ParentChunk(__reg("a6") void *, __reg("a0") CONST struct ContextNode * contextNode)="\tjsr\t-180(a6)";
#define ParentChunk(contextNode) __ParentChunk(IFFParseBase, (contextNode))

struct LocalContextItem * __AllocLocalItem(__reg("a6") void *, __reg("d0") LONG type, __reg("d1") LONG id, __reg("d2") LONG ident, __reg("d3") LONG dataSize)="\tjsr\t-186(a6)";
#define AllocLocalItem(type, id, ident, dataSize) __AllocLocalItem(IFFParseBase, (type), (id), (ident), (dataSize))

APTR __LocalItemData(__reg("a6") void *, __reg("a0") CONST struct LocalContextItem * localItem)="\tjsr\t-192(a6)";
#define LocalItemData(localItem) __LocalItemData(IFFParseBase, (localItem))

VOID __SetLocalItemPurge(__reg("a6") void *, __reg("a0") struct LocalContextItem * localItem, __reg("a1") CONST struct Hook * purgeHook)="\tjsr\t-198(a6)";
#define SetLocalItemPurge(localItem, purgeHook) __SetLocalItemPurge(IFFParseBase, (localItem), (purgeHook))

VOID __FreeLocalItem(__reg("a6") void *, __reg("a0") struct LocalContextItem * localItem)="\tjsr\t-204(a6)";
#define FreeLocalItem(localItem) __FreeLocalItem(IFFParseBase, (localItem))

struct LocalContextItem * __FindLocalItem(__reg("a6") void *, __reg("a0") CONST struct IFFHandle * iff, __reg("d0") LONG type, __reg("d1") LONG id, __reg("d2") LONG ident)="\tjsr\t-210(a6)";
#define FindLocalItem(iff, type, id, ident) __FindLocalItem(IFFParseBase, (iff), (type), (id), (ident))

LONG __StoreLocalItem(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") struct LocalContextItem * localItem, __reg("d0") LONG position)="\tjsr\t-216(a6)";
#define StoreLocalItem(iff, localItem, position) __StoreLocalItem(IFFParseBase, (iff), (localItem), (position))

VOID __StoreItemInContext(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("a1") struct LocalContextItem * localItem, __reg("a2") struct ContextNode * contextNode)="\tjsr\t-222(a6)";
#define StoreItemInContext(iff, localItem, contextNode) __StoreItemInContext(IFFParseBase, (iff), (localItem), (contextNode))

VOID __InitIFF(__reg("a6") void *, __reg("a0") struct IFFHandle * iff, __reg("d0") LONG flags, __reg("a1") CONST struct Hook * streamHook)="\tjsr\t-228(a6)";
#define InitIFF(iff, flags, streamHook) __InitIFF(IFFParseBase, (iff), (flags), (streamHook))

VOID __InitIFFasDOS(__reg("a6") void *, __reg("a0") struct IFFHandle * iff)="\tjsr\t-234(a6)";
#define InitIFFasDOS(iff) __InitIFFasDOS(IFFParseBase, (iff))

VOID __InitIFFasClip(__reg("a6") void *, __reg("a0") struct IFFHandle * iff)="\tjsr\t-240(a6)";
#define InitIFFasClip(iff) __InitIFFasClip(IFFParseBase, (iff))

struct ClipboardHandle * __OpenClipboard(__reg("a6") void *, __reg("d0") LONG unitNumber)="\tjsr\t-246(a6)";
#define OpenClipboard(unitNumber) __OpenClipboard(IFFParseBase, (unitNumber))

VOID __CloseClipboard(__reg("a6") void *, __reg("a0") struct ClipboardHandle * clipHandle)="\tjsr\t-252(a6)";
#define CloseClipboard(clipHandle) __CloseClipboard(IFFParseBase, (clipHandle))

LONG __GoodID(__reg("a6") void *, __reg("d0") LONG id)="\tjsr\t-258(a6)";
#define GoodID(id) __GoodID(IFFParseBase, (id))

LONG __GoodType(__reg("a6") void *, __reg("d0") LONG type)="\tjsr\t-264(a6)";
#define GoodType(type) __GoodType(IFFParseBase, (type))

STRPTR __IDtoStr(__reg("a6") void *, __reg("d0") LONG id, __reg("a0") STRPTR buf)="\tjsr\t-270(a6)";
#define IDtoStr(id, buf) __IDtoStr(IFFParseBase, (id), (buf))

#endif /*  _VBCCINLINE_IFFPARSE_H  */
