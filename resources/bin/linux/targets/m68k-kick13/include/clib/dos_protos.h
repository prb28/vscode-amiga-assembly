#ifndef CLIB_DOS_PROTOS_H
#define CLIB_DOS_PROTOS_H


/*
**	$VER: dos_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  LIBRARIES_DOS_H
#include <libraries/dos.h>
#endif
#ifndef  LIBRARIES_DOSEXTENS_H
#include <libraries/dosextens.h>
#endif

BPTR Open(const STRPTR name, LONG accessMode);
LONG Close(BPTR file);
LONG Read(BPTR file, void * buffer, LONG length);
LONG Write(BPTR file, const void * buffer, LONG length);
BPTR Input(void);
BPTR Output(void);
LONG Seek(BPTR file, LONG position, LONG offset);
LONG DeleteFile(const STRPTR name);
LONG Rename(const STRPTR oldName, const STRPTR newName);
BPTR Lock(const STRPTR name, LONG type);
VOID UnLock(BPTR lock);
BPTR DupLock(BPTR lock);
LONG Examine(BPTR lock, struct FileInfoBlock * fileInfoBlock);
LONG ExNext(BPTR lock, struct FileInfoBlock * fileInfoBlock);
LONG Info(BPTR lock, struct InfoData * parameterBlock);
BPTR CreateDir(const STRPTR name);
BPTR CurrentDir(BPTR lock);
LONG IoErr(void);
struct MsgPort * CreateProc(const STRPTR name, LONG pri, BPTR segList, LONG stackSize);
VOID Exit(LONG returnCode);
BPTR LoadSeg(const STRPTR name);
VOID UnLoadSeg(BPTR seglist);
struct MsgPort * DeviceProc(const STRPTR name);
LONG SetComment(const STRPTR name, const STRPTR comment);
LONG SetProtection(const STRPTR name, LONG protect);
struct DateStamp * DateStamp(struct DateStamp * date);
VOID Delay(LONG timeout);
LONG WaitForChar(BPTR file, LONG timeout);
BPTR ParentDir(BPTR lock);
LONG IsInteractive(BPTR file);
LONG Execute(const STRPTR string, BPTR file, BPTR file2);

#endif	/*  CLIB_DOS_PROTOS_H  */
