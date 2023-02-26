#ifndef _VBCCINLINE_POWERPC_H
#define _VBCCINLINE_POWERPC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

ULONG __RunPPC(__reg("a6") void *, __reg("a0") struct PPCArgs * PPStruct)="\tjsr\t-30(a6)";
#define RunPPC(PPStruct) __RunPPC(PowerPCBase, (PPStruct))

ULONG __WaitForPPC(__reg("a6") void *, __reg("a0") struct PPCArgs * PPStruct)="\tjsr\t-36(a6)";
#define WaitForPPC(PPStruct) __WaitForPPC(PowerPCBase, (PPStruct))

ULONG __GetCPU(__reg("a6") void *)="\tjsr\t-42(a6)";
#define GetCPU() __GetCPU(PowerPCBase)

VOID __PowerDebugMode(__reg("a6") void *, __reg("d0") ULONG debuglevel)="\tjsr\t-48(a6)";
#define PowerDebugMode(debuglevel) __PowerDebugMode(PowerPCBase, (debuglevel))

APTR __AllocVec32(__reg("a6") void *, __reg("d0") ULONG memsize, __reg("d1") ULONG attributes)="\tjsr\t-54(a6)";
#define AllocVec32(memsize, attributes) __AllocVec32(PowerPCBase, (memsize), (attributes))

VOID __FreeVec32(__reg("a6") void *, __reg("a1") APTR memblock)="\tjsr\t-60(a6)";
#define FreeVec32(memblock) __FreeVec32(PowerPCBase, (memblock))

VOID __SPrintF68K(__reg("a6") void *, __reg("a0") STRPTR Formatstring, __reg("a1") APTR values)="\tjsr\t-66(a6)";
#define SPrintF68K(Formatstring, values) __SPrintF68K(PowerPCBase, (Formatstring), (values))

struct Message * __AllocXMsg(__reg("a6") void *, __reg("d0") ULONG bodysize, __reg("a0") struct MsgPort * replyport)="\tjsr\t-72(a6)";
#define AllocXMsg(bodysize, replyport) __AllocXMsg(PowerPCBase, (bodysize), (replyport))

VOID __FreeXMsg(__reg("a6") void *, __reg("a0") struct Message * message)="\tjsr\t-78(a6)";
#define FreeXMsg(message) __FreeXMsg(PowerPCBase, (message))

VOID __PutXMsg(__reg("a6") void *, __reg("a0") struct MsgPortPPC * MsgPortPPC, __reg("a1") struct Message * message)="\tjsr\t-84(a6)";
#define PutXMsg(MsgPortPPC, message) __PutXMsg(PowerPCBase, (MsgPortPPC), (message))

ULONG __GetPPCState(__reg("a6") void *)="\tjsr\t-90(a6)";
#define GetPPCState() __GetPPCState(PowerPCBase)

void __SetCache68K(__reg("a6") void *, __reg("d0") ULONG flags, __reg("a0") void * addr, __reg("d1") ULONG length)="\tjsr\t-96(a6)";
#define SetCache68K(flags, addr, length) __SetCache68K(PowerPCBase, (flags), (addr), (length))

struct TaskPPC * __CreatePPCTask(__reg("a6") void *, __reg("a0") struct TagItem * taglist)="\tjsr\t-102(a6)";
#define CreatePPCTask(taglist) __CreatePPCTask(PowerPCBase, (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct TaskPPC * __CreatePPCTaskTags(__reg("a6") void *, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-102(a6)\n\tmovea.l\t(a7)+,a0";
#define CreatePPCTaskTags(...) __CreatePPCTaskTags(PowerPCBase, __VA_ARGS__)
#endif

void __CausePPCInterrupt(__reg("a6") void *)="\tjsr\t-108(a6)";
#define CausePPCInterrupt() __CausePPCInterrupt(PowerPCBase)

#endif /*  _VBCCINLINE_POWERPC_H  */
