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
struct Task *CreateTask(char *, long, char *, unsigned long);
void DeleteExtIO(struct IORequest *);
void DeletePort(struct MsgPort *);
void DeleteStdIO(struct IOStdReq *);
void DeleteTask(struct Task *);
void NewList(struct List *);

APTR LibAllocPooled( APTR poolHeader, ULONG memSize );
APTR LibCreatePool( ULONG memFlags, ULONG puddleSize, ULONG threshSize );
VOID LibDeletePool( APTR poolHeader );
VOID LibFreePooled( APTR poolHeader, APTR memory, ULONG memSize );

/* Assorted functions in amiga.lib */

ULONG FastRand( ULONG seed );
UWORD RangeRand( ULONG maxValue );

/* Graphics support functions in amiga.lib */

VOID AddTOF( struct Isrvstr *i, LONG (*p)(APTR args), APTR a );
VOID RemTOF( struct Isrvstr *i );
VOID waitbeam( LONG b );

#endif   /* CLIB_ALIB_PROTOS_H */
