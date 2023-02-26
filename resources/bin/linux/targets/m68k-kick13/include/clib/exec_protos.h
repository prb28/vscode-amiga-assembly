#ifndef CLIB_EXEC_PROTOS_H
#define CLIB_EXEC_PROTOS_H


/*
**	$VER: exec_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  EXEC_TASKS_H
#include <exec/tasks.h>
#endif
#ifndef  EXEC_MEMORY_H
#include <exec/memory.h>
#endif
#ifndef  EXEC_PORTS_H
#include <exec/ports.h>
#endif
#ifndef  EXEC_DEVICES_H
#include <exec/devices.h>
#endif
#ifndef  EXEC_IO_H
#include <exec/io.h>
#endif
#ifndef  EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif

ULONG Supervisor(ULONG (*userFunction)());
VOID InitCode(ULONG startClass, ULONG version);
VOID InitStruct(const void * initTable, void * memory, ULONG size);
struct Library * MakeLibrary(const void * funcInit, const void * structInit,
	ULONG (*libInit)(), ULONG dataSize, ULONG segList);
VOID MakeFunctions(void * target, const void * functionArray, const void * funcDispBase);
struct Resident * FindResident(const STRPTR name);
void * InitResident(const struct Resident * resident, ULONG segList);
VOID Alert(ULONG alertNum);
VOID Debug(ULONG flags);
VOID Disable(void);
VOID Enable(void);
VOID Forbid(void);
VOID Permit(void);
ULONG SetSR(ULONG newSR, ULONG mask);
void * SuperState(void);
VOID UserState(void * sysStack);
struct Interrupt * SetIntVector(LONG intNumber, const struct Interrupt * interrupt);
VOID AddIntServer(LONG intNumber, struct Interrupt * interrupt);
VOID RemIntServer(LONG intNumber, struct Interrupt * interrupt);
VOID Cause(struct Interrupt * interrupt);
void * Allocate(struct MemHeader * freeList, ULONG byteSize);
VOID Deallocate(struct MemHeader * freeList, void * memoryBlock, ULONG byteSize);
void * AllocMem(ULONG byteSize, ULONG requirements);
void * AllocAbs(ULONG byteSize, void * location);
VOID FreeMem(void * memoryBlock, ULONG byteSize);
ULONG AvailMem(ULONG requirements);
struct MemList * AllocEntry(struct MemList * entry);
VOID FreeEntry(struct MemList * entry);
VOID Insert(struct List * list, struct Node * node, struct Node * pred);
VOID AddHead(struct List * list, struct Node * node);
VOID AddTail(struct List * list, struct Node * node);
VOID Remove(struct Node * node);
struct Node * RemHead(struct List * list);
struct Node * RemTail(struct List * list);
VOID Enqueue(struct List * list, struct Node * node);
struct Node * FindName(struct List * list, const STRPTR name);
void * AddTask(struct Task * task, const void * initPC, const void * finalPC);
VOID RemTask(struct Task * task);
struct Task * FindTask(const STRPTR name);
BYTE SetTaskPri(struct Task * task, LONG priority);
ULONG SetSignal(ULONG newSignals, ULONG signalSet);
ULONG SetExcept(ULONG newSignals, ULONG signalSet);
ULONG Wait(ULONG signalSet);
VOID Signal(struct Task * task, ULONG signalSet);
BYTE AllocSignal(LONG signalNum);
VOID FreeSignal(LONG signalNum);
LONG AllocTrap(LONG trapNum);
VOID FreeTrap(LONG trapNum);
VOID AddPort(struct MsgPort * port);
VOID RemPort(struct MsgPort * port);
VOID PutMsg(struct MsgPort * port, struct Message * message);
struct Message * GetMsg(struct MsgPort * port);
VOID ReplyMsg(struct Message * message);
struct Message * WaitPort(struct MsgPort * port);
struct MsgPort * FindPort(const STRPTR name);
VOID AddLibrary(struct Library * library);
VOID RemLibrary(struct Library * library);
struct Library * OldOpenLibrary(const STRPTR libName);
VOID CloseLibrary(struct Library * library);
void * SetFunction(struct Library * library, LONG funcOffset, ULONG (*newFunction)());
VOID SumLibrary(struct Library * library);
VOID AddDevice(struct Device * device);
VOID RemDevice(struct Device * device);
BYTE OpenDevice(const STRPTR devName, ULONG unit, struct IORequest * ioRequest,
	ULONG flags);
VOID CloseDevice(struct IORequest * ioRequest);
BYTE DoIO(struct IORequest * ioRequest);
VOID SendIO(struct IORequest * ioRequest);
BOOL CheckIO(struct IORequest * ioRequest);
BYTE WaitIO(struct IORequest * ioRequest);
VOID AbortIO(struct IORequest * ioRequest);
VOID AddResource(void * resource);
VOID RemResource(void * resource);
void * OpenResource(const STRPTR resName);
void * RawDoFmt(const STRPTR formatString, const void * dataStream,
	VOID (*putChProc)(), void * putChData);
ULONG GetCC(void);
ULONG TypeOfMem(const void * address);
ULONG Procure(struct SignalSemaphore * sigSem, struct SemaphoreMessage * bidMsg);
VOID Vacate(struct SignalSemaphore * sigSem, struct SemaphoreMessage * bidMsg);
struct Library * OpenLibrary(const STRPTR libName, ULONG version);
VOID InitSemaphore(struct SignalSemaphore * sigSem);
VOID ObtainSemaphore(struct SignalSemaphore * sigSem);
VOID ReleaseSemaphore(struct SignalSemaphore * sigSem);
ULONG AttemptSemaphore(struct SignalSemaphore * sigSem);
VOID ObtainSemaphoreList(struct List * sigSem);
VOID ReleaseSemaphoreList(struct List * sigSem);
struct SignalSemaphore * FindSemaphore(STRPTR name);
VOID AddSemaphore(struct SignalSemaphore * sigSem);
VOID RemSemaphore(struct SignalSemaphore * sigSem);
ULONG SumKickData(void);
VOID AddMemList(ULONG size, ULONG attributes, LONG pri, void * base, const STRPTR name);
VOID CopyMem(const void * source, void * dest, ULONG size);
VOID CopyMemQuick(const void * source, void * dest, ULONG size);

#endif	/*  CLIB_EXEC_PROTOS_H  */
