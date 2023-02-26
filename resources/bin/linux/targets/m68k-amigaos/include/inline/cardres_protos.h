#ifndef _VBCCINLINE_CARDRES_H
#define _VBCCINLINE_CARDRES_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct CardHandle * __OwnCard(__reg("a6") void *, __reg("a1") struct CardHandle * handle)="\tjsr\t-6(a6)";
#define OwnCard(handle) __OwnCard(CardResource, (handle))

VOID __ReleaseCard(__reg("a6") void *, __reg("a1") struct CardHandle * handle, __reg("d0") ULONG flags)="\tjsr\t-12(a6)";
#define ReleaseCard(handle, flags) __ReleaseCard(CardResource, (handle), (flags))

struct CardMemoryMap * __GetCardMap(__reg("a6") void *)="\tjsr\t-18(a6)";
#define GetCardMap() __GetCardMap(CardResource)

BOOL __BeginCardAccess(__reg("a6") void *, __reg("a1") struct CardHandle * handle)="\tjsr\t-24(a6)";
#define BeginCardAccess(handle) __BeginCardAccess(CardResource, (handle))

BOOL __EndCardAccess(__reg("a6") void *, __reg("a1") struct CardHandle * handle)="\tjsr\t-30(a6)";
#define EndCardAccess(handle) __EndCardAccess(CardResource, (handle))

UBYTE __ReadCardStatus(__reg("a6") void *)="\tjsr\t-36(a6)";
#define ReadCardStatus() __ReadCardStatus(CardResource)

BOOL __CardResetRemove(__reg("a6") void *, __reg("a1") struct CardHandle * handle, __reg("d0") ULONG flag)="\tjsr\t-42(a6)";
#define CardResetRemove(handle, flag) __CardResetRemove(CardResource, (handle), (flag))

UBYTE __CardMiscControl(__reg("a6") void *, __reg("a1") struct CardHandle * handle, __reg("d1") ULONG control_bits)="\tjsr\t-48(a6)";
#define CardMiscControl(handle, control_bits) __CardMiscControl(CardResource, (handle), (control_bits))

ULONG __CardAccessSpeed(__reg("a6") void *, __reg("a1") struct CardHandle * handle, __reg("d0") ULONG nanoseconds)="\tjsr\t-54(a6)";
#define CardAccessSpeed(handle, nanoseconds) __CardAccessSpeed(CardResource, (handle), (nanoseconds))

LONG __CardProgramVoltage(__reg("a6") void *, __reg("a1") struct CardHandle * handle, __reg("d0") ULONG voltage)="\tjsr\t-60(a6)";
#define CardProgramVoltage(handle, voltage) __CardProgramVoltage(CardResource, (handle), (voltage))

BOOL __CardResetCard(__reg("a6") void *, __reg("a1") struct CardHandle * handle)="\tjsr\t-66(a6)";
#define CardResetCard(handle) __CardResetCard(CardResource, (handle))

BOOL __CopyTuple(__reg("a6") void *, __reg("a1") CONST struct CardHandle * handle, __reg("a0") UBYTE * buffer, __reg("d1") ULONG tuplecode, __reg("d0") ULONG size)="\tjsr\t-72(a6)";
#define CopyTuple(handle, buffer, tuplecode, size) __CopyTuple(CardResource, (handle), (buffer), (tuplecode), (size))

ULONG __DeviceTuple(__reg("a6") void *, __reg("a0") CONST UBYTE * tuple_data, __reg("a1") struct DeviceTData * storage)="\tjsr\t-78(a6)";
#define DeviceTuple(tuple_data, storage) __DeviceTuple(CardResource, (tuple_data), (storage))

struct Resident * __IfAmigaXIP(__reg("a6") void *, __reg("a2") CONST struct CardHandle * handle)="\tjsr\t-84(a6)";
#define IfAmigaXIP(handle) __IfAmigaXIP(CardResource, (handle))

BOOL __CardForceChange(__reg("a6") void *)="\tjsr\t-90(a6)";
#define CardForceChange() __CardForceChange(CardResource)

ULONG __CardChangeCount(__reg("a6") void *)="\tjsr\t-96(a6)";
#define CardChangeCount() __CardChangeCount(CardResource)

ULONG __CardInterface(__reg("a6") void *)="\tjsr\t-102(a6)";
#define CardInterface() __CardInterface(CardResource)

#endif /*  _VBCCINLINE_CARDRES_H  */
