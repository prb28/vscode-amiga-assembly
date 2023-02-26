#ifndef CLIB_EXPANSION_PROTOS_H
#define CLIB_EXPANSION_PROTOS_H


/*
**	$VER: expansion_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  LIBRARIES_CONFIGVARS_H
#include <libraries/configvars.h>
#endif
#ifndef  LIBRARIES_FILEHANDLER_H
#include <libraries/filehandler.h>
#endif

VOID AddConfigDev(struct ConfigDev * configDev);
VOID AllocBoardMem(ULONG slotSpec);
struct ConfigDev * AllocConfigDev(void);
void * AllocExpansionMem(ULONG numSlots, ULONG slotAlign);
VOID ConfigBoard(void * board, struct ConfigDev * configDev);
VOID ConfigChain(void * baseAddr);
struct ConfigDev * FindConfigDev(const struct ConfigDev * oldConfigDev, LONG manufacturer,
	LONG product);
VOID FreeBoardMem(ULONG startSlot, ULONG slotSpec);
VOID FreeConfigDev(struct ConfigDev * configDev);
VOID FreeExpansionMem(ULONG startSlot, ULONG numSlots);
UBYTE ReadExpansionByte(const void * board, ULONG offset);
VOID ReadExpansionRom(const void * board, struct ConfigDev * configDev);
VOID RemConfigDev(struct ConfigDev * configDev);
VOID WriteExpansionByte(void * board, ULONG offset, ULONG byte);
VOID ObtainConfigBinding(void);
VOID ReleaseConfigBinding(void);
VOID SetCurrentBinding(struct CurrentBinding * currentBinding, ULONG bindingSize);
ULONG GetCurrentBinding(const struct CurrentBinding * currentBinding, ULONG bindingSize);
struct DeviceNode * MakeDosNode(const void * parmPacket);
BOOL AddDosNode(LONG bootPri, ULONG flags, struct DeviceNode * deviceNode);

#endif	/*  CLIB_EXPANSION_PROTOS_H  */
