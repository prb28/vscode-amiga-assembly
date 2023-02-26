#ifndef _VBCCINLINE_EXEC_H
#define _VBCCINLINE_EXEC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

void __InitCode(__reg("a6") void *, __reg("d0") long startClass, __reg("d1") long version)="\tjsr\t-72(a6)";
#define InitCode(startClass, version) __InitCode(SysBase, (startClass), (version))

void __InitStruct(__reg("a6") void *, __reg("a1") char * initTable, __reg("a2") char * memory, __reg("d0") long size)="\tjsr\t-78(a6)";
#define InitStruct(initTable, memory, size) __InitStruct(SysBase, (initTable), (memory), (size))

struct Library * __MakeLibrary(__reg("a6") void *, __reg("a0") long** funcInit, __reg("a1") char * structInit, __reg("a2") void * libInit, __reg("d0") long dataSize, __reg("d1") char * codeSize)="\tjsr\t-84(a6)";
#define MakeLibrary(funcInit, structInit, libInit, dataSize, codeSize) __MakeLibrary(SysBase, (funcInit), (structInit), (void *)(libInit), (dataSize), (codeSize))

void __MakeFunctions(__reg("a6") void *, __reg("a0") char * target, __reg("a1") long** functionArray, __reg("a2") void * funcDispBase)="\tjsr\t-90(a6)";
#define MakeFunctions(target, functionArray, funcDispBase) __MakeFunctions(SysBase, (target), (functionArray), (void *)(funcDispBase))

struct Resident * __FindResident(__reg("a6") void *, __reg("a1") char * name)="\tjsr\t-96(a6)";
#define FindResident(name) __FindResident(SysBase, (name))

void __InitResident(__reg("a6") void *, __reg("a1") struct Resident * resident, __reg("d1") char * segList)="\tjsr\t-102(a6)";
#define InitResident(resident, segList) __InitResident(SysBase, (resident), (segList))

void __Debug(__reg("a6") void *, __reg("d0") long flags)="\tjsr\t-114(a6)";
#define Debug(flags) __Debug(SysBase, (flags))

void __Disable(__reg("a6") void *)="\tjsr\t-120(a6)";
#define Disable() __Disable(SysBase)

void __Enable(__reg("a6") void *)="\tjsr\t-126(a6)";
#define Enable() __Enable(SysBase)

void __Forbid(__reg("a6") void *)="\tjsr\t-132(a6)";
#define Forbid() __Forbid(SysBase)

void __Permit(__reg("a6") void *)="\tjsr\t-138(a6)";
#define Permit() __Permit(SysBase)

long __SetSR(__reg("a6") void *, __reg("d0") long newSR, __reg("d1") long mask)="\tjsr\t-144(a6)";
#define SetSR(newSR, mask) __SetSR(SysBase, (newSR), (mask))

long __SuperState(__reg("a6") void *)="\tjsr\t-150(a6)";
#define SuperState() __SuperState(SysBase)

void __UserState(__reg("a6") void *, __reg("d0") char * sysStack)="\tjsr\t-156(a6)";
#define UserState(sysStack) __UserState(SysBase, (sysStack))

struct Interrupt * __SetIntVector(__reg("a6") void *, __reg("d0") long intNumber, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-162(a6)";
#define SetIntVector(intNumber, interrupt) __SetIntVector(SysBase, (intNumber), (interrupt))

void __AddIntServer(__reg("a6") void *, __reg("d0") long intNumber, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-168(a6)";
#define AddIntServer(intNumber, interrupt) __AddIntServer(SysBase, (intNumber), (interrupt))

void __RemIntServer(__reg("a6") void *, __reg("d0") long intNumber, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-174(a6)";
#define RemIntServer(intNumber, interrupt) __RemIntServer(SysBase, (intNumber), (interrupt))

void __Cause(__reg("a6") void *, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-180(a6)";
#define Cause(interrupt) __Cause(SysBase, (interrupt))

void * __Allocate(__reg("a6") void *, __reg("a0") struct MemHeader * freeList, __reg("d0") long byteSize)="\tjsr\t-186(a6)";
#define Allocate(freeList, byteSize) __Allocate(SysBase, (freeList), (byteSize))

void __Deallocate(__reg("a6") void *, __reg("a0") struct MemHeader * freeList, __reg("a1") void * memoryBlock, __reg("d0") long byteSize)="\tjsr\t-192(a6)";
#define Deallocate(freeList, memoryBlock, byteSize) __Deallocate(SysBase, (freeList), (memoryBlock), (byteSize))

void* __AllocMem(__reg("a6") void *, __reg("d0") long byteSize, __reg("d1") long requirements)="\tjsr\t-198(a6)";
#define AllocMem(byteSize, requirements) __AllocMem(SysBase, (byteSize), (requirements))

void __AllocAbs(__reg("a6") void *, __reg("d0") long byteSize, __reg("a1") void* location)="\tjsr\t-204(a6)";
#define AllocAbs(byteSize, location) __AllocAbs(SysBase, (byteSize), (location))

void __FreeMem(__reg("a6") void *, __reg("a1") void * memoryBlock, __reg("d0") long byteSize)="\tjsr\t-210(a6)";
#define FreeMem(memoryBlock, byteSize) __FreeMem(SysBase, (memoryBlock), (byteSize))

long __AvailMem(__reg("a6") void *, __reg("d1") long requirements)="\tjsr\t-216(a6)";
#define AvailMem(requirements) __AvailMem(SysBase, (requirements))

struct MemList * __AllocEntry(__reg("a6") void *, __reg("a0") struct MemList * entry)="\tjsr\t-222(a6)";
#define AllocEntry(entry) __AllocEntry(SysBase, (entry))

void __FreeEntry(__reg("a6") void *, __reg("a0") struct MemList * entry)="\tjsr\t-228(a6)";
#define FreeEntry(entry) __FreeEntry(SysBase, (entry))

void __Insert(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node, __reg("a2") struct Node * pred)="\tjsr\t-234(a6)";
#define Insert(list, node, pred) __Insert(SysBase, (list), (node), (pred))

void __AddHead(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-240(a6)";
#define AddHead(list, node) __AddHead(SysBase, (list), (node))

void __AddTail(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-246(a6)";
#define AddTail(list, node) __AddTail(SysBase, (list), (node))

void __Remove(__reg("a6") void *, __reg("a1") struct Node * node)="\tjsr\t-252(a6)";
#define Remove(node) __Remove(SysBase, (node))

struct Node * __RemHead(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-258(a6)";
#define RemHead(list) __RemHead(SysBase, (list))

struct Node * __RemTail(__reg("a6") void *, __reg("a0") struct List * list)="\tjsr\t-264(a6)";
#define RemTail(list) __RemTail(SysBase, (list))

void __Enqueue(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") struct Node * node)="\tjsr\t-270(a6)";
#define Enqueue(list, node) __Enqueue(SysBase, (list), (node))

struct Node * __FindName(__reg("a6") void *, __reg("a0") struct List * list, __reg("a1") char * name)="\tjsr\t-276(a6)";
#define FindName(list, name) __FindName(SysBase, (list), (name))

void __AddTask(__reg("a6") void *, __reg("a1") struct Task * task, __reg("a2") char * initPC, __reg("a3") char * finalPC)="\tjsr\t-282(a6)";
#define AddTask(task, initPC, finalPC) __AddTask(SysBase, (task), (initPC), (finalPC))

void __RemTask(__reg("a6") void *, __reg("a1") struct Task * task)="\tjsr\t-288(a6)";
#define RemTask(task) __RemTask(SysBase, (task))

struct Task * __FindTask(__reg("a6") void *, __reg("a1") char * name)="\tjsr\t-294(a6)";
#define FindTask(name) __FindTask(SysBase, (name))

long __SetTaskPri(__reg("a6") void *, __reg("a1") struct Task * task, __reg("d0") long priority)="\tjsr\t-300(a6)";
#define SetTaskPri(task, priority) __SetTaskPri(SysBase, (task), (priority))

long __SetSignal(__reg("a6") void *, __reg("d0") long newSignals, __reg("d1") long signalSet)="\tjsr\t-306(a6)";
#define SetSignal(newSignals, signalSet) __SetSignal(SysBase, (newSignals), (signalSet))

long __SetExcept(__reg("a6") void *, __reg("d0") long newSignals, __reg("d1") long signalSet)="\tjsr\t-312(a6)";
#define SetExcept(newSignals, signalSet) __SetExcept(SysBase, (newSignals), (signalSet))

long __Wait(__reg("a6") void *, __reg("d0") long signalSet)="\tjsr\t-318(a6)";
#define Wait(signalSet) __Wait(SysBase, (signalSet))

void __Signal(__reg("a6") void *, __reg("a1") struct Task * task, __reg("d0") long signalSet)="\tjsr\t-324(a6)";
#define Signal(task, signalSet) __Signal(SysBase, (task), (signalSet))

long __AllocSignal(__reg("a6") void *, __reg("d0") long signalNum)="\tjsr\t-330(a6)";
#define AllocSignal(signalNum) __AllocSignal(SysBase, (signalNum))

void __FreeSignal(__reg("a6") void *, __reg("d0") long signalNum)="\tjsr\t-336(a6)";
#define FreeSignal(signalNum) __FreeSignal(SysBase, (signalNum))

long __AllocTrap(__reg("a6") void *, __reg("d0") long trapNum)="\tjsr\t-342(a6)";
#define AllocTrap(trapNum) __AllocTrap(SysBase, (trapNum))

void __FreeTrap(__reg("a6") void *, __reg("d0") long trapNum)="\tjsr\t-348(a6)";
#define FreeTrap(trapNum) __FreeTrap(SysBase, (trapNum))

void __AddPort(__reg("a6") void *, __reg("a1") struct MsgPort * port)="\tjsr\t-354(a6)";
#define AddPort(port) __AddPort(SysBase, (port))

void __RemPort(__reg("a6") void *, __reg("a1") struct MsgPort * port)="\tjsr\t-360(a6)";
#define RemPort(port) __RemPort(SysBase, (port))

void __PutMsg(__reg("a6") void *, __reg("a0") struct MsgPort * port, __reg("a1") struct Message * message)="\tjsr\t-366(a6)";
#define PutMsg(port, message) __PutMsg(SysBase, (port), (message))

struct Message * __GetMsg(__reg("a6") void *, __reg("a0") struct MsgPort * port)="\tjsr\t-372(a6)";
#define GetMsg(port) __GetMsg(SysBase, (port))

void __ReplyMsg(__reg("a6") void *, __reg("a1") struct Message * message)="\tjsr\t-378(a6)";
#define ReplyMsg(message) __ReplyMsg(SysBase, (message))

struct Message * __WaitPort(__reg("a6") void *, __reg("a0") struct MsgPort * port)="\tjsr\t-384(a6)";
#define WaitPort(port) __WaitPort(SysBase, (port))

struct MsgPort * __FindPort(__reg("a6") void *, __reg("a1") char * name)="\tjsr\t-390(a6)";
#define FindPort(name) __FindPort(SysBase, (name))

void __AddLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-396(a6)";
#define AddLibrary(library) __AddLibrary(SysBase, (library))

long __RemLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-402(a6)";
#define RemLibrary(library) __RemLibrary(SysBase, (library))

struct Library * __OldOpenLibrary(__reg("a6") void *, __reg("a1") char * libName)="\tjsr\t-408(a6)";
#define OldOpenLibrary(libName) __OldOpenLibrary(SysBase, (libName))

void __CloseLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-414(a6)";
#define CloseLibrary(library) __CloseLibrary(SysBase, (library))

__fptr __SetFunction(__reg("a6") void *, __reg("a1") struct Library * library, __reg("a0") void * funcOffset, __reg("d0") __fptr funcEntry)="\tjsr\t-420(a6)";
#define SetFunction(library, funcOffset, funcEntry) __SetFunction(SysBase, (library), (void *)(funcOffset), (funcEntry))

void __SumLibrary(__reg("a6") void *, __reg("a1") struct Library * library)="\tjsr\t-426(a6)";
#define SumLibrary(library) __SumLibrary(SysBase, (library))

void __AddDevice(__reg("a6") void *, __reg("a1") struct Device * device)="\tjsr\t-432(a6)";
#define AddDevice(device) __AddDevice(SysBase, (device))

long __RemDevice(__reg("a6") void *, __reg("a1") struct Device * device)="\tjsr\t-438(a6)";
#define RemDevice(device) __RemDevice(SysBase, (device))

long __OpenDevice(__reg("a6") void *, __reg("a0") char * devName, __reg("d0") long unit, __reg("a1") struct IORequest * ioRequest, __reg("d1") long flags)="\tjsr\t-444(a6)";
#define OpenDevice(devName, unit, ioRequest, flags) __OpenDevice(SysBase, (devName), (unit), (ioRequest), (flags))

void __CloseDevice(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-450(a6)";
#define CloseDevice(ioRequest) __CloseDevice(SysBase, (ioRequest))

long __DoIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-456(a6)";
#define DoIO(ioRequest) __DoIO(SysBase, (ioRequest))

void __SendIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-462(a6)";
#define SendIO(ioRequest) __SendIO(SysBase, (ioRequest))

long __CheckIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-468(a6)";
#define CheckIO(ioRequest) __CheckIO(SysBase, (ioRequest))

long __WaitIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-474(a6)";
#define WaitIO(ioRequest) __WaitIO(SysBase, (ioRequest))

void __AbortIO(__reg("a6") void *, __reg("a1") struct IORequest * ioRequest)="\tjsr\t-480(a6)";
#define AbortIO(ioRequest) __AbortIO(SysBase, (ioRequest))

void __AddResource(__reg("a6") void *, __reg("a1") APTR resource)="\tjsr\t-486(a6)";
#define AddResource(resource) __AddResource(SysBase, (resource))

void __RemResource(__reg("a6") void *, __reg("a1") APTR resource)="\tjsr\t-492(a6)";
#define RemResource(resource) __RemResource(SysBase, (resource))

APTR __OpenResource(__reg("a6") void *, __reg("a1") char * resName)="\tjsr\t-498(a6)";
#define OpenResource(resName) __OpenResource(SysBase, (resName))

long __GetCC(__reg("a6") void *)="\tjsr\t-528(a6)";
#define GetCC() __GetCC(SysBase)

void __TypeOfMem(__reg("a6") void *, __reg("a1") char * address)="\tjsr\t-534(a6)";
#define TypeOfMem(address) __TypeOfMem(SysBase, (address))

long __Procure(__reg("a6") void *, __reg("a0") struct Semaphore * semaport, __reg("a1") struct Message * bidMsg)="\tjsr\t-540(a6)";
#define Procure(semaport, bidMsg) __Procure(SysBase, (semaport), (bidMsg))

void __Vacate(__reg("a6") void *, __reg("a0") struct Semaphore * semaport)="\tjsr\t-546(a6)";
#define Vacate(semaport) __Vacate(SysBase, (semaport))

struct Library * __OpenLibrary(__reg("a6") void *, __reg("a1") char * libName, __reg("d0") long version)="\tjsr\t-552(a6)";
#define OpenLibrary(libName, version) __OpenLibrary(SysBase, (libName), (version))

void __InitSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-558(a6)";
#define InitSemaphore(sigSem) __InitSemaphore(SysBase, (sigSem))

void __ObtainSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-564(a6)";
#define ObtainSemaphore(sigSem) __ObtainSemaphore(SysBase, (sigSem))

void __ReleaseSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-570(a6)";
#define ReleaseSemaphore(sigSem) __ReleaseSemaphore(SysBase, (sigSem))

long __AttemptSemaphore(__reg("a6") void *, __reg("a0") struct SignalSemaphore * sigSem)="\tjsr\t-576(a6)";
#define AttemptSemaphore(sigSem) __AttemptSemaphore(SysBase, (sigSem))

void __ObtainSemaphoreList(__reg("a6") void *, __reg("a0") struct List * sigSem)="\tjsr\t-582(a6)";
#define ObtainSemaphoreList(sigSem) __ObtainSemaphoreList(SysBase, (sigSem))

void __ReleaseSemaphoreList(__reg("a6") void *, __reg("a0") struct List * sigSem)="\tjsr\t-588(a6)";
#define ReleaseSemaphoreList(sigSem) __ReleaseSemaphoreList(SysBase, (sigSem))

struct SignalSemaphore * __FindSemaphore(__reg("a6") void *, __reg("a1") char * sigSem)="\tjsr\t-594(a6)";
#define FindSemaphore(sigSem) __FindSemaphore(SysBase, (sigSem))

void __AddSemaphore(__reg("a6") void *, __reg("a1") struct SignalSemaphore * sigSem)="\tjsr\t-600(a6)";
#define AddSemaphore(sigSem) __AddSemaphore(SysBase, (sigSem))

void __RemSemaphore(__reg("a6") void *, __reg("a1") struct SignalSemaphore * sigSem)="\tjsr\t-606(a6)";
#define RemSemaphore(sigSem) __RemSemaphore(SysBase, (sigSem))

void __SumKickData(__reg("a6") void *)="\tjsr\t-612(a6)";
#define SumKickData() __SumKickData(SysBase)

long __AddMemList(__reg("a6") void *, __reg("d0") long size, __reg("d1") long attributes, __reg("d2") long pri, __reg("a0") char * base, __reg("a1") char * name)="\tjsr\t-618(a6)";
#define AddMemList(size, attributes, pri, base, name) __AddMemList(SysBase, (size), (attributes), (pri), (base), (name))

void __CopyMem(__reg("a6") void *, __reg("a0") char * source, __reg("a1") char * dest, __reg("d0") long size)="\tjsr\t-624(a6)";
#define CopyMem(source, dest, size) __CopyMem(SysBase, (source), (dest), (size))

void __CopyMemQuick(__reg("a6") void *, __reg("a0") char * source, __reg("a1") char * dest, __reg("d0") long size)="\tjsr\t-630(a6)";
#define CopyMemQuick(source, dest, size) __CopyMemQuick(SysBase, (source), (dest), (size))

#endif /*  _VBCCINLINE_EXEC_H  */
