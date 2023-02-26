#ifndef _VBCCINLINE_EXEC_H
#define _VBCCINLINE_EXEC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

ULONG __Supervisor(__reg("a6") void *, __reg("a5") ULONG (*userFunction)())="\tjsr\t-30(a6)";
#define Supervisor(userFunction) __Supervisor(SysBase, (userFunction))

VOID __InitCode(__reg("a6") void *, __reg("d0") ULONG startClass, __reg("d1") ULONG version)="\tjsr\t-72(a6)";
#define InitCode(startClass, version) __InitCode(SysBase, (startClass), (version))

VOID __InitStruct(__reg("a6") void *, __reg("a1") const void * initTable, __reg("a2") void * memory, __reg("d0") ULONG size)="\tjsr\t-78(a6)";
#define InitStruct(initTable, memory, size) __InitStruct(SysBase, (initTable), (memory), (size))

struct Library * __MakeLibrary(__reg("a6") void *, __reg("a0") const void * funcInit, __reg("a1") const void * structInit, __reg("a2") ULONG (*libInit)(), __reg("d0") ULONG dataSize, __reg("d1") ULONG segList)="\tjsr\t-84(a6)";
#define MakeLibrary(funcInit, structInit, libInit, dataSize, segList) __MakeLibrary(SysBase, (funcInit), (structInit), (libInit), (dataSize), (segList))

VOID __MakeFunctions(__reg("a6") void *, __reg("a0") void * target, __reg("a1") const void * functionArray, __reg("a2") const void * funcDispBase)="\tjsr\t-90(a6)";
#define MakeFunctions(target, functionArray, funcDispBase) __MakeFunctions(SysBase, (target), (functionArray), (funcDispBase))

struct Resident * __FindResident(__reg("a6") void *, __reg("a1") const STRPTR name)="\tjsr\t-96(a6)";
#define FindResident(name) __FindResident(SysBase, (name))

void * __InitResident(__reg("a6") void *, __reg("a1") const struct Resident * resident, __reg("d1") ULONG segList)="\tjsr\t-102(a6)";
#define InitResident(resident, segList) __InitResident(SysBase, (resident), (segList))

VOID __Alert(__reg("a6") void *, __reg("d7") ULONG alertNum)="\tjsr\t-108(a6)";
#define Alert(alertNum) __Alert(SysBase, (alertNum))

VOID __Debug(__reg("a6") void *, __reg("d0") ULONG flags)="\tjsr\t-114(a6)";
#define Debug(flags) __Debug(SysBase, (flags))

VOID __Disable(__reg("a6") void *)="\tjsr\t-120(a6)";
#define Disable() __Disable(SysBase)

VOID __Enable(__reg("a6") void *)="\tjsr\t-126(a6)";
#define Enable() __Enable(SysBase)

VOID __Forbid(__reg("a6") void *)="\tjsr\t-132(a6)";
#define Forbid() __Forbid(SysBase)

VOID __Permit(__reg("a6") void *)="\tjsr\t-138(a6)";
#define Permit() __Permit(SysBase)

ULONG __SetSR(__reg("a6") void *, __reg("d0") ULONG newSR, __reg("d1") ULONG mask)="\tjsr\t-144(a6)";
#define SetSR(newSR, mask) __SetSR(SysBase, (newSR), (mask))

void * __SuperState(__reg("a6") void *)="\tjsr\t-150(a6)";
#define SuperState() __SuperState(SysBase)

VOID __UserState(__reg("a6") void *, __reg("d0") void * sysStack)="\tjsr\t-156(a6)";
#define UserState(sysStack) __UserState(SysBase, (sysStack))

struct Interrupt * __SetIntVector(__reg("a6") void *, __reg("d0") LONG intNumber, __reg("a1") const struct Interrupt * interrupt)="\tjsr\t-162(a6)";
#define SetIntVector(intNumber, interrupt) __SetIntVector(SysBase, (intNumber), (interrupt))

VOID __AddIntServer(__reg("a6") void *, __reg("d0") LONG intNumber, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-168(a6)";
#define AddIntServer(intNumber, interrupt) __AddIntServer(SysBase, (intNumber), (interrupt))

VOID __RemIntServer(__reg("a6") void *, __reg("d0") LONG intNumber, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-174(a6)";
#define RemIntServer(intNumber, interrupt) __RemIntServer(SysBase, (intNumber), (interrupt))

VOID __Cause(__reg("a6") void *, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-180(a6)";
#define Cause(interrupt) __Cause(SysBase, (interrupt))

void * __Allocate(__reg("a6") void *, __reg("a0") struct MemHeader * freeList, __reg("d0") ULONG byteSize)="\tjsr\t-186(a6)";
#define Allocate(freeList, byteSize) __Allocate(SysBase, (freeList), (byteSize))

VOID __Deallocate(__reg("a6") void *, __reg("a0") struct MemHeader * freeList, __reg("a1") void * memoryBlock, __reg("d0") ULONG byteSize)="\tjsr\t-192(a6)";
#define Deallocate(freeList, memoryBlock, byteSize) __Deallocate(SysBase, (freeList), (memoryBlock), (byteSize))

void * __AllocMem(__reg("a6") void *, __reg("d0") ULONG byteSize, __reg("d1") ULONG requirements)="\tjsr\t-198(a6)";
#define AllocMem(byteSize, requirements) __AllocMem(SysBase, (byteSize), (requirements))

void * __AllocAbs(__reg("a6") void *, __reg("d0") ULONG byteSize, __reg("a1") void * location)="\tjsr\t-204(a6)";
#define AllocAbs(byteSize, location) __AllocAbs(SysBase, (byteSize), (location))

VOID __FreeMem(__reg("a6") void *, __reg("a1") void * memoryBlock, __reg("d0") ULONG byteSize)="\tjsr\t-210(a6)";
#define FreeMem(memoryBlock, byteSize) __FreeMem(SysBase, (memoryBlock), (byteSize))

ULONG __AvailMem(__reg("a6") void *, __reg("d1") ULONG requirements)="\tjsr\t-216(a6)";
#define AvailMem(requirements) __AvailMem(SysBase, (requirements))

struct MemList * __AllocEntry(__reg("a6") void *, __reg("a0") struct MemList * entry)="\tjsr\t-222(a6)";
#define AllocEntry(entry) __AllocEntry(SysBase, (entry))

VOID __FreeEntry(__reg("a6") void *, __reg("a0") struct MemList * entry)="\tjsr\t-228(a6)";
#define FreeEntry(entry) __FreeEntry(SysBase, (entry))

VOID __Insert(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node, __reg("a2") struct Node * pred)="\tjsr\t-234(a6)";
#define Insert(list, node, pred) __Insert(SysBase, (list), (node), (pred))

VOID __AddHead(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-240(a6)";
#define AddHead(list, node) __AddHead(SysBase, (list), (node))

VOID __AddTail(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-246(a6)";
#define AddTail(list, node) __AddTail(SysBase, (list), (node))

VOID __Remove(__reg("a6") void *, __reg("a1") struct Node * node)="\tjsr\t-252(a6)";
#define Remove(node) __Remove(SysBase, (node))

struct Node * __RemHead(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-258(a6)";
#define RemHead(list) __RemHead(SysBase, (list))

struct Node * __RemTail(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-264(a6)";
#define RemTail(list) __RemTail(SysBase, (list))

VOID __Enqueue(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-270(a6)";
#define Enqueue(list, node) __Enqueue(SysBase, (list), (node))

struct Node * __FindName(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") const STRPTR name)="\tjsr\t-276(a6)";
#define FindName(list, name) __FindName(SysBase, (list), (name))

void * __AddTask(__reg("a6") void *, __reg("a1") struct Task * task, __reg("a2") const void * initPC, __reg("a3") const void * finalPC)="\tjsr\t-282(a6)";
#define AddTask(task, initPC, finalPC) __AddTask(SysBase, (task), (initPC), (finalPC))

VOID __RemTask(__reg("a6") void *, __reg("a1") struct Task * task)="\tjsr\t-288(a6)";
#define RemTask(task) __RemTask(SysBase, (task))

struct Task * __FindTask(__reg("a6") void *, __reg("a1") const STRPTR name)="\tjsr\t-294(a6)";
#define FindTask(name) __FindTask(SysBase, (name))

BYTE __SetTaskPri(__reg("a6") void *, __reg("a1") struct Task * task, __reg("d0") LONG priority)="\tjsr\t-300(a6)";
#define SetTaskPri(task, priority) __SetTaskPri(SysBase, (task), (priority))

ULONG __SetSignal(__reg("a6") void *, __reg("d0") ULONG newSignals, __reg("d1") ULONG signalSet)="\tjsr\t-306(a6)";
#define SetSignal(newSignals, signalSet) __SetSignal(SysBase, (newSignals), (signalSet))

ULONG __SetExcept(__reg("a6") void *, __reg("d0") ULONG newSignals, __reg("d1") ULONG signalSet)="\tjsr\t-312(a6)";
#define SetExcept(newSignals, signalSet) __SetExcept(SysBase, (newSignals), (signalSet))

ULONG __Wait(__reg("a6") void *, __reg("d0") ULONG signalSet)="\tjsr\t-318(a6)";
#define Wait(signalSet) __Wait(SysBase, (signalSet))

VOID __Signal(__reg("a6") void *, __reg("a1") struct Task * task, __reg("d0") ULONG signalSet)="\tjsr\t-324(a6)";
#define Signal(task, signalSet) __Signal(SysBase, (task), (signalSet))

BYTE __AllocSignal(__reg("a6") void *, __reg("d0") LONG signalNum)="\tjsr\t-330(a6)";
#define AllocSignal(signalNum) __AllocSignal(SysBase, (signalNum))

VOID __FreeSignal(__reg("a6") void *, __reg("d0") LONG signalNum)="\tjsr\t-336(a6)";
#define FreeSignal(signalNum) __FreeSignal(SysBase, (signalNum))

LONG __AllocTrap(__reg("a6") void *, __reg("d0") LONG trapNum)="\tjsr\t-342(a6)";
#define AllocTrap(trapNum) __AllocTrap(SysBase, (trapNum))

VOID __FreeTrap(__reg("a6") void *, __reg("d0") LONG trapNum)="\tjsr\t-348(a6)";
#define FreeTrap(trapNum) __FreeTrap(SysBase, (trapNum))

VOID __AddPort(__reg("a6") void *, __reg("a1") struct MsgPort * port)="\tjsr\t-354(a6)";
#define AddPort(port) __AddPort(SysBase, (port))

VOID __RemPort(__reg("a6") void *, __reg("a1") struct MsgPort * port)="\tjsr\t-360(a6)";
#define RemPort(port) __RemPort(SysBase, (port))

VOID __PutMsg(__reg("a6") void *, __reg("a0") struct MsgPort * port, __reg("a1") struct Message * message)="\tjsr\t-366(a6)";
#define PutMsg(port, message) __PutMsg(SysBase, (port), (message))

struct Message * __GetMsg(__reg("a6") void *, __reg("a0") struct MsgPort * port)="\tjsr\t-372(a6)";
#define GetMsg(port) __GetMsg(SysBase, (port))

VOID __ReplyMsg(__reg("a6") void *, __reg("a1") struct Message * message)="\tjsr\t-378(a6)";
#define ReplyMsg(message) __ReplyMsg(SysBase, (message))

struct Message * __WaitPort(__reg("a6") void *, __reg("a0") struct MsgPort * port)="\tjsr\t-384(a6)";
#define WaitPort(port) __WaitPort(SysBase, (port))

struct MsgPort * __FindPort(__reg("a6") void *, __reg("a1") const STRPTR name)="\tjsr\t-390(a6)";
#define FindPort(name) __FindPort(SysBase, (name))

VOID __AddLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-396(a6)";
#define AddLibrary(library) __AddLibrary(SysBase, (library))

VOID __RemLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-402(a6)";
#define RemLibrary(library) __RemLibrary(SysBase, (library))

struct Library * __OldOpenLibrary(__reg("a6") void *, __reg("a1") const STRPTR libName)="\tjsr\t-408(a6)";
#define OldOpenLibrary(libName) __OldOpenLibrary(SysBase, (libName))

VOID __CloseLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-414(a6)";
#define CloseLibrary(library) __CloseLibrary(SysBase, (library))

void * __SetFunction(__reg("a6") void *, __reg("a1") struct Library * library, __reg("a0") void * funcOffset, __reg("d0") ULONG (*newFunction)())="\tjsr\t-420(a6)";
#define SetFunction(library, funcOffset, newFunction) __SetFunction(SysBase, (library), (void *)(funcOffset), (newFunction))

VOID __SumLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-426(a6)";
#define SumLibrary(library) __SumLibrary(SysBase, (library))

VOID __AddDevice(__reg("a6") void *, __reg("a1") struct Device * device)="\tjsr\t-432(a6)";
#define AddDevice(device) __AddDevice(SysBase, (device))

VOID __RemDevice(__reg("a6") void *, __reg("a1") struct Device * device)="\tjsr\t-438(a6)";
#define RemDevice(device) __RemDevice(SysBase, (device))

BYTE __OpenDevice(__reg("a6") void *, __reg("a0") const STRPTR devName, __reg("d0") ULONG unit, __reg("a1") struct IORequest * ioRequest, __reg("d1") ULONG flags)="\tjsr\t-444(a6)";
#define OpenDevice(devName, unit, ioRequest, flags) __OpenDevice(SysBase, (devName), (unit), (ioRequest), (flags))

VOID __CloseDevice(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-450(a6)";
#define CloseDevice(ioRequest) __CloseDevice(SysBase, (ioRequest))

BYTE __DoIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-456(a6)";
#define DoIO(ioRequest) __DoIO(SysBase, (ioRequest))

VOID __SendIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-462(a6)";
#define SendIO(ioRequest) __SendIO(SysBase, (ioRequest))

BOOL __CheckIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-468(a6)";
#define CheckIO(ioRequest) __CheckIO(SysBase, (ioRequest))

BYTE __WaitIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-474(a6)";
#define WaitIO(ioRequest) __WaitIO(SysBase, (ioRequest))

VOID __AbortIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-480(a6)";
#define AbortIO(ioRequest) __AbortIO(SysBase, (ioRequest))

VOID __AddResource(__reg("a6") void *, __reg("a1") void * resource)="\tjsr\t-486(a6)";
#define AddResource(resource) __AddResource(SysBase, (resource))

VOID __RemResource(__reg("a6") void *, __reg("a1") void * resource)="\tjsr\t-492(a6)";
#define RemResource(resource) __RemResource(SysBase, (resource))

void * __OpenResource(__reg("a6") void *, __reg("a1") const STRPTR resName)="\tjsr\t-498(a6)";
#define OpenResource(resName) __OpenResource(SysBase, (resName))

void * __RawDoFmt(__reg("a6") void *, __reg("a0") const STRPTR formatString, __reg("a1") const void * dataStream, __reg("a2") VOID (*putChProc)(), __reg("a3") void * putChData)="\tjsr\t-522(a6)";
#define RawDoFmt(formatString, dataStream, putChProc, putChData) __RawDoFmt(SysBase, (formatString), (dataStream), (putChProc), (putChData))

ULONG __GetCC(__reg("a6") void *)="\tjsr\t-528(a6)";
#define GetCC() __GetCC(SysBase)

ULONG __TypeOfMem(__reg("a6") void *, __reg("a1") const void * address)="\tjsr\t-534(a6)";
#define TypeOfMem(address) __TypeOfMem(SysBase, (address))

ULONG __Procure(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem, __reg("a1") struct SemaphoreMessage * bidMsg)="\tjsr\t-540(a6)";
#define Procure(sigSem, bidMsg) __Procure(SysBase, (sigSem), (bidMsg))

VOID __Vacate(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem, __reg("a1") struct SemaphoreMessage * bidMsg)="\tjsr\t-546(a6)";
#define Vacate(sigSem, bidMsg) __Vacate(SysBase, (sigSem), (bidMsg))

struct Library * __OpenLibrary(__reg("a6") void *, __reg("a1") const STRPTR libName, __reg("d0") ULONG version)="\tjsr\t-552(a6)";
#define OpenLibrary(libName, version) __OpenLibrary(SysBase, (libName), (version))

VOID __InitSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-558(a6)";
#define InitSemaphore(sigSem) __InitSemaphore(SysBase, (sigSem))

VOID __ObtainSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-564(a6)";
#define ObtainSemaphore(sigSem) __ObtainSemaphore(SysBase, (sigSem))

VOID __ReleaseSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-570(a6)";
#define ReleaseSemaphore(sigSem) __ReleaseSemaphore(SysBase, (sigSem))

ULONG __AttemptSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-576(a6)";
#define AttemptSemaphore(sigSem) __AttemptSemaphore(SysBase, (sigSem))

VOID __ObtainSemaphoreList(__reg("a6") void *, __reg("a0") struct List * sigSem)="\tjsr\t-582(a6)";
#define ObtainSemaphoreList(sigSem) __ObtainSemaphoreList(SysBase, (sigSem))

VOID __ReleaseSemaphoreList(__reg("a6") void *, __reg("a0") struct List * sigSem)="\tjsr\t-588(a6)";
#define ReleaseSemaphoreList(sigSem) __ReleaseSemaphoreList(SysBase, (sigSem))

struct SignalSemaphore * __FindSemaphore(__reg("a6") void *, __reg("a1") STRPTR name)="\tjsr\t-594(a6)";
#define FindSemaphore(name) __FindSemaphore(SysBase, (name))

VOID __AddSemaphore(__reg("a6") void *, __reg("a1") struct SignalSemaphore * sigSem)="\tjsr\t-600(a6)";
#define AddSemaphore(sigSem) __AddSemaphore(SysBase, (sigSem))

VOID __RemSemaphore(__reg("a6") void *, __reg("a1") struct SignalSemaphore * sigSem)="\tjsr\t-606(a6)";
#define RemSemaphore(sigSem) __RemSemaphore(SysBase, (sigSem))

ULONG __SumKickData(__reg("a6") void *)="\tjsr\t-612(a6)";
#define SumKickData() __SumKickData(SysBase)

VOID __AddMemList(__reg("a6") void *, __reg("d0") ULONG size, __reg("d1") ULONG attributes, __reg("d2") LONG pri, __reg("a0") void * base, __reg("a1") const STRPTR name)="\tjsr\t-618(a6)";
#define AddMemList(size, attributes, pri, base, name) __AddMemList(SysBase, (size), (attributes), (pri), (base), (name))

VOID __CopyMem(__reg("a6") void *, __reg("a0") const void * source, __reg("a1") void * dest, __reg("d0") ULONG size)="\tjsr\t-624(a6)";
#define CopyMem(source, dest, size) __CopyMem(SysBase, (source), (dest), (size))

VOID __CopyMemQuick(__reg("a6") void *, __reg("a0") const void * source, __reg("a1") void * dest, __reg("d0") ULONG size)="\tjsr\t-630(a6)";
#define CopyMemQuick(source, dest, size) __CopyMemQuick(SysBase, (source), (dest), (size))

#endif /*  _VBCCINLINE_EXEC_H  */
