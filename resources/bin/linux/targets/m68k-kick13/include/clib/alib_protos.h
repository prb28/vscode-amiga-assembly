#ifndef  CLIB_ALIB_PROTOS_H
#define  CLIB_ALIB_PROTOS_H

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef EXEC_IO_H 
#include <exec/io.h>
#endif
#ifndef  GRAPHICS_GRAPHINT_H
#include <graphics/graphint.h>
#endif

/*  Exec support functions */

void BeginIO(struct IORequest *);
struct IORequest *CreateExtIO(struct MsgPort *, long);
struct MsgPort *CreatePort(char *, long);
struct IOStdReq *CreateStdIO(struct MsgPort *);
struct Task *CreateTask(char *, long, void *, unsigned long);
void DeleteExtIO(struct IORequest *);
void DeletePort(struct MsgPort *);
void DeleteStdIO(struct IOStdReq *);
void DeleteTask(struct Task *);
void NewList(struct List *);

void *LibAllocPooled(void *, ULONG);
void *LibCreatePool(ULONG, ULONG, ULONG);
VOID LibDeletePool(void *);
VOID LibFreePooled(void *, void *, ULONG);

/* Assorted functions in amiga.lib */

ULONG FastRand(ULONG);
UWORD RangeRand(ULONG);

/* Graphics support functions in amiga.lib */

VOID AddTOF(struct Isrvstr *, LONG (*)(void *), void *);
VOID RemTOF(struct Isrvstr * );
VOID waitbeam(LONG);

#endif   /* CLIB_ALIB_PROTOS_H */
