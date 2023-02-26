/* struct DosLibrary */
#ifndef LIBRARIES_DOSEXTENS_H 
#include <libraries/dosextens.h>
#endif

/* BPTR, struct FileInfoBlock, struct InfoData */ 
#ifndef LIBRARIES_DOS_H
#include <libraries/dos.h>
#endif

/* struct MsgPort */
#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef LIBRARIES_DOSEXTENS_H
#include <libraries/dosextens.h>
#endif
extern struct DosLibrary *DOSBase;
BPTR Open(char *, long);
void Close(BPTR);
long Read(BPTR, char *, long);
long Write(BPTR, char *, long);
BPTR Input(void);
BPTR Output(void);
long Seek(BPTR, long, long);
long DeleteFile(char *);
long Rename(char *, char *);
BPTR Lock(char *, long);
void UnLock(BPTR);
BPTR DupLock(BPTR);
long Examine(BPTR, struct FileInfoBlock *);
long ExNext(BPTR, struct FileInfoBlock *);
long Info(BPTR, struct InfoData *);
BPTR CreateDir(char *);
BPTR CurrentDir(BPTR);
long IoErr(void);
struct MsgPort *CreateProc(char *, long, BPTR, long);
void Exit(long);
BPTR LoadSeg(char *);
void UnLoadSeg(BPTR);
struct MsgPort *DeviceProc(char *);
long SetComment(char *, char *);
long SetProtection(char *, long);
struct DateStamp *DateStamp(struct DateStamp *);
void Delay(long);
long WaitForChar(BPTR, long);
BPTR ParentDir(BPTR);
long IsInteractive(BPTR);
long Execute(char *, BPTR, BPTR);
