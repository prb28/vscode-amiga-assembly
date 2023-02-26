#ifndef _VBCCINLINE_EXPANSION_H
#define _VBCCINLINE_EXPANSION_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __AddConfigDev(__reg("a6") void *, __reg("a0") struct ConfigDev * configDev)="\tjsr\t-30(a6)";
#define AddConfigDev(configDev) __AddConfigDev(ExpansionBase, (configDev))

BOOL __AddBootNode(__reg("a6") void *, __reg("d0") LONG bootPri, __reg("d1") ULONG flags, __reg("a0") struct DeviceNode * deviceNode, __reg("a1") struct ConfigDev * configDev)="\tjsr\t-36(a6)";
#define AddBootNode(bootPri, flags, deviceNode, configDev) __AddBootNode(ExpansionBase, (bootPri), (flags), (deviceNode), (configDev))

VOID __AllocBoardMem(__reg("a6") void *, __reg("d0") ULONG slotSpec)="\tjsr\t-42(a6)";
#define AllocBoardMem(slotSpec) __AllocBoardMem(ExpansionBase, (slotSpec))

struct ConfigDev * __AllocConfigDev(__reg("a6") void *)="\tjsr\t-48(a6)";
#define AllocConfigDev() __AllocConfigDev(ExpansionBase)

APTR __AllocExpansionMem(__reg("a6") void *, __reg("d0") ULONG numSlots, __reg("d1") ULONG slotAlign)="\tjsr\t-54(a6)";
#define AllocExpansionMem(numSlots, slotAlign) __AllocExpansionMem(ExpansionBase, (numSlots), (slotAlign))

VOID __ConfigBoard(__reg("a6") void *, __reg("a0") APTR board, __reg("a1") struct ConfigDev * configDev)="\tjsr\t-60(a6)";
#define ConfigBoard(board, configDev) __ConfigBoard(ExpansionBase, (board), (configDev))

VOID __ConfigChain(__reg("a6") void *, __reg("a0") APTR baseAddr)="\tjsr\t-66(a6)";
#define ConfigChain(baseAddr) __ConfigChain(ExpansionBase, (baseAddr))

struct ConfigDev * __FindConfigDev(__reg("a6") void *, __reg("a0") CONST struct ConfigDev * oldConfigDev, __reg("d0") LONG manufacturer, __reg("d1") LONG product)="\tjsr\t-72(a6)";
#define FindConfigDev(oldConfigDev, manufacturer, product) __FindConfigDev(ExpansionBase, (oldConfigDev), (manufacturer), (product))

VOID __FreeBoardMem(__reg("a6") void *, __reg("d0") ULONG startSlot, __reg("d1") ULONG slotSpec)="\tjsr\t-78(a6)";
#define FreeBoardMem(startSlot, slotSpec) __FreeBoardMem(ExpansionBase, (startSlot), (slotSpec))

VOID __FreeConfigDev(__reg("a6") void *, __reg("a0") struct ConfigDev * configDev)="\tjsr\t-84(a6)";
#define FreeConfigDev(configDev) __FreeConfigDev(ExpansionBase, (configDev))

VOID __FreeExpansionMem(__reg("a6") void *, __reg("d0") ULONG startSlot, __reg("d1") ULONG numSlots)="\tjsr\t-90(a6)";
#define FreeExpansionMem(startSlot, numSlots) __FreeExpansionMem(ExpansionBase, (startSlot), (numSlots))

UBYTE __ReadExpansionByte(__reg("a6") void *, __reg("a0") CONST APTR board, __reg("d0") ULONG offset)="\tjsr\t-96(a6)";
#define ReadExpansionByte(board, offset) __ReadExpansionByte(ExpansionBase, (board), (offset))

VOID __ReadExpansionRom(__reg("a6") void *, __reg("a0") CONST APTR board, __reg("a1") struct ConfigDev * configDev)="\tjsr\t-102(a6)";
#define ReadExpansionRom(board, configDev) __ReadExpansionRom(ExpansionBase, (board), (configDev))

VOID __RemConfigDev(__reg("a6") void *, __reg("a0") struct ConfigDev * configDev)="\tjsr\t-108(a6)";
#define RemConfigDev(configDev) __RemConfigDev(ExpansionBase, (configDev))

VOID __WriteExpansionByte(__reg("a6") void *, __reg("a0") APTR board, __reg("d0") ULONG offset, __reg("d1") ULONG byte)="\tjsr\t-114(a6)";
#define WriteExpansionByte(board, offset, byte) __WriteExpansionByte(ExpansionBase, (board), (offset), (byte))

VOID __ObtainConfigBinding(__reg("a6") void *)="\tjsr\t-120(a6)";
#define ObtainConfigBinding() __ObtainConfigBinding(ExpansionBase)

VOID __ReleaseConfigBinding(__reg("a6") void *)="\tjsr\t-126(a6)";
#define ReleaseConfigBinding() __ReleaseConfigBinding(ExpansionBase)

VOID __SetCurrentBinding(__reg("a6") void *, __reg("a0") struct CurrentBinding * currentBinding, __reg("d0") ULONG bindingSize)="\tjsr\t-132(a6)";
#define SetCurrentBinding(currentBinding, bindingSize) __SetCurrentBinding(ExpansionBase, (currentBinding), (bindingSize))

ULONG __GetCurrentBinding(__reg("a6") void *, __reg("a0") CONST struct CurrentBinding * currentBinding, __reg("d0") ULONG bindingSize)="\tjsr\t-138(a6)";
#define GetCurrentBinding(currentBinding, bindingSize) __GetCurrentBinding(ExpansionBase, (currentBinding), (bindingSize))

struct DeviceNode * __MakeDosNode(__reg("a6") void *, __reg("a0") CONST APTR parmPacket)="\tjsr\t-144(a6)";
#define MakeDosNode(parmPacket) __MakeDosNode(ExpansionBase, (parmPacket))

BOOL __AddDosNode(__reg("a6") void *, __reg("d0") LONG bootPri, __reg("d1") ULONG flags, __reg("a0") struct DeviceNode * deviceNode)="\tjsr\t-150(a6)";
#define AddDosNode(bootPri, flags, deviceNode) __AddDosNode(ExpansionBase, (bootPri), (flags), (deviceNode))

#endif /*  _VBCCINLINE_EXPANSION_H  */
