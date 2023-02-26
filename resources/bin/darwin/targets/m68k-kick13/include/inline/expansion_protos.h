#ifndef _VBCCINLINE_EXPANSION_H
#define _VBCCINLINE_EXPANSION_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

void __AddConfigDev(__reg("a6") void *, __reg("a0") void * configDev)="\tjsr\t-30(a6)";
#define AddConfigDev(configDev) __AddConfigDev(ExpansionBase, (void *)(configDev))

void __AllocBoardMem(__reg("a6") void *, __reg("d0") long slotSpec)="\tjsr\t-42(a6)";
#define AllocBoardMem(slotSpec) __AllocBoardMem(ExpansionBase, (slotSpec))

struct ConfigDev * __AllocConfigDev(__reg("a6") void *)="\tjsr\t-48(a6)";
#define AllocConfigDev() __AllocConfigDev(ExpansionBase)

CPTR __AllocExpansionMem(__reg("a6") void *, __reg("d0") long numSlots, __reg("d1") long SlotAlign, __reg("d2") long SlotOffset)="\tjsr\t-54(a6)";
#define AllocExpansionMem(numSlots, SlotAlign, SlotOffset) __AllocExpansionMem(ExpansionBase, (numSlots), (SlotAlign), (SlotOffset))

void __ConfigBoard(__reg("a6") void *, __reg("a0") void * board, __reg("a1") void * configDev)="\tjsr\t-60(a6)";
#define ConfigBoard(board, configDev) __ConfigBoard(ExpansionBase, (void *)(board), (void *)(configDev))

void __ConfigChain(__reg("a6") void *, __reg("a0") void * baseAddr)="\tjsr\t-66(a6)";
#define ConfigChain(baseAddr) __ConfigChain(ExpansionBase, (void *)(baseAddr))

struct ConfigDev * __FindConfigDev(__reg("a6") void *, __reg("a0") void * oldConfigDev, __reg("d0") long manufacturer, __reg("d1") long product)="\tjsr\t-72(a6)";
#define FindConfigDev(oldConfigDev, manufacturer, product) __FindConfigDev(ExpansionBase, (void *)(oldConfigDev), (manufacturer), (product))

void __FreeBoardMem(__reg("a6") void *, __reg("d0") long startSlot, __reg("d1") long slotSpec)="\tjsr\t-78(a6)";
#define FreeBoardMem(startSlot, slotSpec) __FreeBoardMem(ExpansionBase, (startSlot), (slotSpec))

void __FreeConfigDev(__reg("a6") void *, __reg("a0") void * configDev)="\tjsr\t-84(a6)";
#define FreeConfigDev(configDev) __FreeConfigDev(ExpansionBase, (void *)(configDev))

void __FreeExpansionMem(__reg("a6") void *, __reg("d0") long startSlot, __reg("d1") long numSlots)="\tjsr\t-90(a6)";
#define FreeExpansionMem(startSlot, numSlots) __FreeExpansionMem(ExpansionBase, (startSlot), (numSlots))

void __ReadExpansionByte(__reg("a6") void *, __reg("a0") void * board, __reg("d0") long offset)="\tjsr\t-96(a6)";
#define ReadExpansionByte(board, offset) __ReadExpansionByte(ExpansionBase, (void *)(board), (offset))

void __ReadExpansionRom(__reg("a6") void *, __reg("a0") void * board, __reg("a1") void * configDev)="\tjsr\t-102(a6)";
#define ReadExpansionRom(board, configDev) __ReadExpansionRom(ExpansionBase, (void *)(board), (void *)(configDev))

void __RemConfigDev(__reg("a6") void *, __reg("a0") void * configDev)="\tjsr\t-108(a6)";
#define RemConfigDev(configDev) __RemConfigDev(ExpansionBase, (void *)(configDev))

void __WriteExpansionByte(__reg("a6") void *, __reg("a0") void * board, __reg("d0") long offset, __reg("d1") long byte)="\tjsr\t-114(a6)";
#define WriteExpansionByte(board, offset, byte) __WriteExpansionByte(ExpansionBase, (void *)(board), (offset), (byte))

void __ObtainConfigBinding(__reg("a6") void *)="\tjsr\t-120(a6)";
#define ObtainConfigBinding() __ObtainConfigBinding(ExpansionBase)

void __ReleaseConfigBinding(__reg("a6") void *)="\tjsr\t-126(a6)";
#define ReleaseConfigBinding() __ReleaseConfigBinding(ExpansionBase)

void __SetCurrentBinding(__reg("a6") void *, __reg("a0") void * currentBinding, __reg("d0") long bindingSize)="\tjsr\t-132(a6)";
#define SetCurrentBinding(currentBinding, bindingSize) __SetCurrentBinding(ExpansionBase, (void *)(currentBinding), (bindingSize))

void __GetCurrentBinding(__reg("a6") void *, __reg("a0") void * currentBinding, __reg("d0") long bindingSize)="\tjsr\t-138(a6)";
#define GetCurrentBinding(currentBinding, bindingSize) __GetCurrentBinding(ExpansionBase, (void *)(currentBinding), (bindingSize))

struct DeviceNode * __MakeDosNode(__reg("a6") void *, __reg("a0") long * parmPacket)="\tjsr\t-144(a6)";
#define MakeDosNode(parmPacket) __MakeDosNode(ExpansionBase, (parmPacket))

void __AddDosNode(__reg("a6") void *, __reg("d0") long bootPri, __reg("d1") long flags, __reg("a0") struct DeviceNode * dosNode)="\tjsr\t-150(a6)";
#define AddDosNode(bootPri, flags, dosNode) __AddDosNode(ExpansionBase, (bootPri), (flags), (dosNode))

#endif /*  _VBCCINLINE_EXPANSION_H  */
