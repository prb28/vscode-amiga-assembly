/* ERROR: The struct Resource doesn't exist in the includes,
          in the autodocs is only an APTR */
/* APTR */
#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct Resident */
#ifndef EXEC_RESIDENT_H 
#include <exec/resident.h>
#endif

/* struct MsgPort, struct Message */
#ifndef EXEC_PORTS_H 
#include <exec/ports.h>
#endif

/* struct Interrupt */
#ifndef EXEC_INTERRUPTS_H 
#include <exec/interrupts.h>
#endif

/* struct List */
#ifndef EXEC_LISTS_H 
#include <exec/lists.h>
#endif

/* struct Node */
#ifndef EXEC_NODES_H 
#include <exec/nodes.h>
#endif

/* struct Task */
#ifndef EXEC_TASKS_H 
#include <exec/tasks.h>
#endif

/* struct Device */
#ifndef EXEC_DEVICES_H
#include <exec/devices.h>
#endif

/* struct IORequest, struct IOStdReq */
#ifndef EXEC_IO_H 
#include <exec/io.h>
#endif

/* struct Semaphore, struct SignalSemaphore */
#ifndef EXEC_SEMAPHORES_H 
#include <exec/semaphores.h>
#endif

/* struct MemHeader, struct MemList */
#ifndef EXEC_MEMORY_H 
#include <exec/memory.h>
#endif

typedef void (*__fptr)();

/*------ special functions ---------------------------------------------*/
void InitCode(long, long);
void InitStruct(char *, char *, long);
struct Library *MakeLibrary(long**, char *, __fptr, long, char *);
void MakeFunctions(char *, long**, long);
struct Resident *FindResident(char *);
void InitResident(struct Resident *, char *);
void Alert(long, APTR);
void Debug(long);
/*------ interrupts ----------------------------------------------------*/
void Disable(void);
void Enable(void);
void Forbid(void);
void Permit(void);
long SetSR(long, long);
long SuperState(void);
void UserState(char *);
struct Interrupt *SetIntVector(long, struct Interrupt *);
void AddIntServer(long, struct Interrupt *);
void RemIntServer(long, struct Interrupt *);
void Cause(struct Interrupt *);
/*------ memory allocation: ---------------------------------------------*/
void * Allocate(struct MemHeader *, long);
void Deallocate(struct MemHeader *, void *, long);
void* AllocMem(long, long);
void AllocAbs(long, void*);
void FreeMem(void *, long);
long AvailMem(long);
struct MemList * AllocEntry(struct MemList *);
void FreeEntry(struct MemList *);
/*------ lists: ---------------------------------------------------------*/
void Insert(struct List *, struct Node *, struct Node *);
void AddHead(struct List *, struct Node *);
void AddTail(struct List *, struct Node *);
void Remove(struct Node *);
struct Node *RemHead(struct List *);
struct Node *RemTail(struct List *);
void Enqueue(struct List *, struct Node *);
struct Node *FindName(struct List *, char *);
/*------ tasks: ---------------------------------------------------------*/
void AddTask(struct Task *, char *, char *);
void RemTask(struct Task *);
struct Task *FindTask(char *);
long SetTaskPri(struct Task *, long);
long SetSignal(long, long);
long SetExcept(long, long);
long Wait(long);
void Signal(struct Task *, long);
long AllocSignal(long);
void FreeSignal(long);
long AllocTrap(long);
void FreeTrap(long);
/*------ messages: ------------------------------------------------------*/
void AddPort(struct MsgPort *);
void RemPort(struct MsgPort *);
void PutMsg(struct MsgPort *, struct Message *);
struct Message *GetMsg(struct MsgPort *);
void ReplyMsg(struct Message *);
struct Message *WaitPort(struct MsgPort *);
struct MsgPort *FindPort(char *);
/*------ libraries: -----------------------------------------------------*/
void AddLibrary(struct Library *);
long RemLibrary(struct Library *);
struct Library *OldOpenLibrary(char *);
void CloseLibrary(struct Library *);
__fptr SetFunction(struct Library *, long, __fptr);
void SumLibrary(struct Library *);
/*------ devices: -------------------------------------------------------*/
void AddDevice(struct Device *);
long RemDevice(struct Device *);
long OpenDevice(char *, long, struct IORequest *, long);
void CloseDevice(struct IORequest *);
long DoIO(struct IORequest *);
void SendIO(struct IORequest *);
long CheckIO(struct IORequest *);
long WaitIO(struct IORequest *);
void AbortIO(struct IORequest *);
/*------ resources: ----------------------------------------------------*/
/* ERROR:
void AddResource(struct Resource *);
void RemResource(struct Resource *);
struct Resource *OpenResource(char *, long); */
/* Prototypes that appears in the Autodocs */
void AddResource(APTR); 
APTR OpenResource(char *); /* Only one argument in autodocs */
void RemResource(APTR);

/*------ new functions:*/
long GetCC(void);
void TypeOfMem(char *);
long Procure(struct Semaphore *, struct Message *);
void Vacate(struct Semaphore *);
struct Library *OpenLibrary(char *, long);
/*------ 1.2 new semaphore support*/
void InitSemaphore(struct SignalSemaphore *);
void ObtainSemaphore(struct SignalSemaphore *);
void ReleaseSemaphore(struct SignalSemaphore *);
long AttemptSemaphore(struct SignalSemaphore *);
void ObtainSemaphoreList(struct List *);
void ReleaseSemaphoreList(struct List *);
struct SignalSemaphore *FindSemaphore(char *);
void AddSemaphore(struct SignalSemaphore *);
void RemSemaphore(struct SignalSemaphore *);
/*------ 1.2 rom "kickstart" support + memory support*/
void SumKickData(void);
long AddMemList(long, long, long, char *, char *);
void CopyMem(char *, char *, long);
void CopyMemQuick(char *, char *, long);
/*------ Common support library functions ---------*/
void BeginIO(struct IORequest *);
struct IORequest *CreateExtIO(struct MsgPort *, long);
struct MsgPort *CreatePort(char *, long);
struct IOStdReq *CreateStdIO(struct MsgPort *);
struct Task *CreateTask(char *, long, char *, unsigned long);
void DeleteExtIO(struct IORequest *);
void DeletePort(struct MsgPort *);
void DeleteStdIO(struct IOStdReq *);
void DeleteTask(struct Task *);
void NewList(struct List *);
