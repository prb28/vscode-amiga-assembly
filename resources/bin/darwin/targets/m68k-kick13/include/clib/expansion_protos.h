/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* CPTR */
#ifndef #ifndef EXEC_TYPES_H 
#include <exec/types.h>
#endif

/* struct DeviceNode */
#ifndef LIBRARIES_FILEHANDLER_H
#include <libraries/filehandler.h>
#endif

/* struct ConfigDev */
#ifndef LIBRARIES_CONFIGVARS_H
#include <libraries/configvars..h>
#endif

#ifndef LIBRARIES_EXPANSION_H
#include <libraries/expansion.h>
#endif

#ifndef LIBRARIES_EXPANSIONBASE_H
#include <libraries/expansionbase.h>
#endif

void AddConfigDev(long);
void AllocBoardMem(long);
struct ConfigDev *AllocConfigDev(void);
CPTR AllocExpansionMem(long, long, long);
void ConfigBoard(long, long);
void ConfigChain(long);
struct ConfigDev *FindConfigDev(long, long, long);
void FreeBoardMem(long, long);
void FreeConfigDev(long);
void FreeExpansionMem(long, long);
void ReadExpansionByte(long, long);
void ReadExpansionRom(long, long);
void RemConfigDev(long);
void WriteExpansionByte(long, long, long);
void ObtainConfigBinding(void);
void ReleaseConfigBinding(void);
void SetCurrentBinding(long, long);
void GetCurrentBinding(long, long);
struct DeviceNode *MakeDosNode(long *);
void AddDosNode(long, long, struct DeviceNode *);

