#ifndef _VBCCINLINE_LOWLEVEL_H
#define _VBCCINLINE_LOWLEVEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

ULONG __ReadJoyPort(__reg("a6") void *, __reg("d0") ULONG port)="\tjsr\t-30(a6)";
#define ReadJoyPort(port) __ReadJoyPort(LowLevelBase, (port))

UBYTE __GetLanguageSelection(__reg("a6") void *)="\tjsr\t-36(a6)";
#define GetLanguageSelection() __GetLanguageSelection(LowLevelBase)

ULONG __GetKey(__reg("a6") void *)="\tjsr\t-48(a6)";
#define GetKey() __GetKey(LowLevelBase)

VOID __QueryKeys(__reg("a6") void *, __reg("a0") struct KeyQuery * queryArray, __reg("d1") ULONG arraySize)="\tjsr\t-54(a6)";
#define QueryKeys(queryArray, arraySize) __QueryKeys(LowLevelBase, (queryArray), (arraySize))

APTR __AddKBInt(__reg("a6") void *, __reg("a0") CONST APTR intRoutine, __reg("a1") CONST APTR intData)="\tjsr\t-60(a6)";
#define AddKBInt(intRoutine, intData) __AddKBInt(LowLevelBase, (intRoutine), (intData))

VOID __RemKBInt(__reg("a6") void *, __reg("a1") APTR intHandle)="\tjsr\t-66(a6)";
#define RemKBInt(intHandle) __RemKBInt(LowLevelBase, (intHandle))

ULONG __SystemControlA(__reg("a6") void *, __reg("a1") CONST struct TagItem * tagList)="\tjsr\t-72(a6)";
#define SystemControlA(tagList) __SystemControlA(LowLevelBase, (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SystemControl(__reg("a6") void *, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-72(a6)\n\tmovea.l\t(a7)+,a1";
#define SystemControl(...) __SystemControl(LowLevelBase, __VA_ARGS__)
#endif

APTR __AddTimerInt(__reg("a6") void *, __reg("a0") CONST APTR intRoutine, __reg("a1") CONST APTR intData)="\tjsr\t-78(a6)";
#define AddTimerInt(intRoutine, intData) __AddTimerInt(LowLevelBase, (intRoutine), (intData))

VOID __RemTimerInt(__reg("a6") void *, __reg("a1") APTR intHandle)="\tjsr\t-84(a6)";
#define RemTimerInt(intHandle) __RemTimerInt(LowLevelBase, (intHandle))

VOID __StopTimerInt(__reg("a6") void *, __reg("a1") APTR intHandle)="\tjsr\t-90(a6)";
#define StopTimerInt(intHandle) __StopTimerInt(LowLevelBase, (intHandle))

VOID __StartTimerInt(__reg("a6") void *, __reg("a1") APTR intHandle, __reg("d0") ULONG timeInterval, __reg("d1") LONG continuous)="\tjsr\t-96(a6)";
#define StartTimerInt(intHandle, timeInterval, continuous) __StartTimerInt(LowLevelBase, (intHandle), (timeInterval), (continuous))

ULONG __ElapsedTime(__reg("a6") void *, __reg("a0") struct EClockVal * context)="\tjsr\t-102(a6)";
#define ElapsedTime(context) __ElapsedTime(LowLevelBase, (context))

APTR __AddVBlankInt(__reg("a6") void *, __reg("a0") CONST APTR intRoutine, __reg("a1") CONST APTR intData)="\tjsr\t-108(a6)";
#define AddVBlankInt(intRoutine, intData) __AddVBlankInt(LowLevelBase, (intRoutine), (intData))

VOID __RemVBlankInt(__reg("a6") void *, __reg("a1") APTR intHandle)="\tjsr\t-114(a6)";
#define RemVBlankInt(intHandle) __RemVBlankInt(LowLevelBase, (intHandle))

BOOL __SetJoyPortAttrsA(__reg("a6") void *, __reg("d0") ULONG portNumber, __reg("a1") CONST struct TagItem * tagList)="\tjsr\t-132(a6)";
#define SetJoyPortAttrsA(portNumber, tagList) __SetJoyPortAttrsA(LowLevelBase, (portNumber), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __SetJoyPortAttrs(__reg("a6") void *, __reg("d0") ULONG portNumber, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-132(a6)\n\tmovea.l\t(a7)+,a1";
#define SetJoyPortAttrs(portNumber, ...) __SetJoyPortAttrs(LowLevelBase, (portNumber), __VA_ARGS__)
#endif

#endif /*  _VBCCINLINE_LOWLEVEL_H  */
