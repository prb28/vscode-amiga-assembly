#ifndef _VBCCINLINE_NONVOLATILE_H
#define _VBCCINLINE_NONVOLATILE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

APTR __GetCopyNV(__reg("a6") void *, __reg("a0") CONST_STRPTR appName, __reg("a1") CONST_STRPTR itemName, __reg("d1") LONG killRequesters)="\tjsr\t-30(a6)";
#define GetCopyNV(appName, itemName, killRequesters) __GetCopyNV(NVBase, (appName), (itemName), (killRequesters))

VOID __FreeNVData(__reg("a6") void *, __reg("a0") APTR data)="\tjsr\t-36(a6)";
#define FreeNVData(data) __FreeNVData(NVBase, (data))

UWORD __StoreNV(__reg("a6") void *, __reg("a0") CONST_STRPTR appName, __reg("a1") CONST_STRPTR itemName, __reg("a2") CONST APTR data, __reg("d0") ULONG length, __reg("d1") LONG killRequesters)="\tjsr\t-42(a6)";
#define StoreNV(appName, itemName, data, length, killRequesters) __StoreNV(NVBase, (appName), (itemName), (data), (length), (killRequesters))

BOOL __DeleteNV(__reg("a6") void *, __reg("a0") CONST_STRPTR appName, __reg("a1") CONST_STRPTR itemName, __reg("d1") LONG killRequesters)="\tjsr\t-48(a6)";
#define DeleteNV(appName, itemName, killRequesters) __DeleteNV(NVBase, (appName), (itemName), (killRequesters))

struct NVInfo * __GetNVInfo(__reg("a6") void *, __reg("d1") LONG killRequesters)="\tjsr\t-54(a6)";
#define GetNVInfo(killRequesters) __GetNVInfo(NVBase, (killRequesters))

struct MinList * __GetNVList(__reg("a6") void *, __reg("a0") CONST_STRPTR appName, __reg("d1") LONG killRequesters)="\tjsr\t-60(a6)";
#define GetNVList(appName, killRequesters) __GetNVList(NVBase, (appName), (killRequesters))

BOOL __SetNVProtection(__reg("a6") void *, __reg("a0") CONST_STRPTR appName, __reg("a1") CONST_STRPTR itemName, __reg("d2") LONG mask, __reg("d1") LONG killRequesters)="\tjsr\t-66(a6)";
#define SetNVProtection(appName, itemName, mask, killRequesters) __SetNVProtection(NVBase, (appName), (itemName), (mask), (killRequesters))

#endif /*  _VBCCINLINE_NONVOLATILE_H  */
