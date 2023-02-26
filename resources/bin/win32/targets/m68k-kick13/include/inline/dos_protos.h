#ifndef _VBCCINLINE_DOS_H
#define _VBCCINLINE_DOS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BPTR __Open(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG accessMode)="\tjsr\t-30(a6)";
#define Open(name, accessMode) __Open(DOSBase, (name), (accessMode))

LONG __Close(__reg("a6") void *, __reg("d1") BPTR file)="\tjsr\t-36(a6)";
#define Close(file) __Close(DOSBase, (file))

LONG __Read(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") void * buffer, __reg("d3") LONG length)="\tjsr\t-42(a6)";
#define Read(file, buffer, length) __Read(DOSBase, (file), (buffer), (length))

LONG __Write(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") const void * buffer, __reg("d3") LONG length)="\tjsr\t-48(a6)";
#define Write(file, buffer, length) __Write(DOSBase, (file), (buffer), (length))

BPTR __Input(__reg("a6") void *)="\tjsr\t-54(a6)";
#define Input() __Input(DOSBase)

BPTR __Output(__reg("a6") void *)="\tjsr\t-60(a6)";
#define Output() __Output(DOSBase)

LONG __Seek(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") LONG position, __reg("d3") LONG offset)="\tjsr\t-66(a6)";
#define Seek(file, position, offset) __Seek(DOSBase, (file), (position), (offset))

LONG __DeleteFile(__reg("a6") void *, __reg("d1") const STRPTR name)="\tjsr\t-72(a6)";
#define DeleteFile(name) __DeleteFile(DOSBase, (name))

LONG __Rename(__reg("a6") void *, __reg("d1") const STRPTR oldName, __reg("d2") const STRPTR newName)="\tjsr\t-78(a6)";
#define Rename(oldName, newName) __Rename(DOSBase, (oldName), (newName))

BPTR __Lock(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG type)="\tjsr\t-84(a6)";
#define Lock(name, type) __Lock(DOSBase, (name), (type))

VOID __UnLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-90(a6)";
#define UnLock(lock) __UnLock(DOSBase, (lock))

BPTR __DupLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-96(a6)";
#define DupLock(lock) __DupLock(DOSBase, (lock))

LONG __Examine(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct FileInfoBlock * fileInfoBlock)="\tjsr\t-102(a6)";
#define Examine(lock, fileInfoBlock) __Examine(DOSBase, (lock), (fileInfoBlock))

LONG __ExNext(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct FileInfoBlock * fileInfoBlock)="\tjsr\t-108(a6)";
#define ExNext(lock, fileInfoBlock) __ExNext(DOSBase, (lock), (fileInfoBlock))

LONG __Info(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct InfoData * parameterBlock)="\tjsr\t-114(a6)";
#define Info(lock, parameterBlock) __Info(DOSBase, (lock), (parameterBlock))

BPTR __CreateDir(__reg("a6") void *, __reg("d1") const STRPTR name)="\tjsr\t-120(a6)";
#define CreateDir(name) __CreateDir(DOSBase, (name))

BPTR __CurrentDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-126(a6)";
#define CurrentDir(lock) __CurrentDir(DOSBase, (lock))

LONG __IoErr(__reg("a6") void *)="\tjsr\t-132(a6)";
#define IoErr() __IoErr(DOSBase)

struct MsgPort * __CreateProc(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG pri, __reg("d3") BPTR segList, __reg("d4") LONG stackSize)="\tjsr\t-138(a6)";
#define CreateProc(name, pri, segList, stackSize) __CreateProc(DOSBase, (name), (pri), (segList), (stackSize))

VOID __Exit(__reg("a6") void *, __reg("d1") LONG returnCode)="\tjsr\t-144(a6)";
#define Exit(returnCode) __Exit(DOSBase, (returnCode))

BPTR __LoadSeg(__reg("a6") void *, __reg("d1") const STRPTR name)="\tjsr\t-150(a6)";
#define LoadSeg(name) __LoadSeg(DOSBase, (name))

VOID __UnLoadSeg(__reg("a6") void *, __reg("d1") BPTR seglist)="\tjsr\t-156(a6)";
#define UnLoadSeg(seglist) __UnLoadSeg(DOSBase, (seglist))

struct MsgPort * __DeviceProc(__reg("a6") void *, __reg("d1") const STRPTR name)="\tjsr\t-174(a6)";
#define DeviceProc(name) __DeviceProc(DOSBase, (name))

LONG __SetComment(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") const STRPTR comment)="\tjsr\t-180(a6)";
#define SetComment(name, comment) __SetComment(DOSBase, (name), (comment))

LONG __SetProtection(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG protect)="\tjsr\t-186(a6)";
#define SetProtection(name, protect) __SetProtection(DOSBase, (name), (protect))

struct DateStamp * __DateStamp(__reg("a6") void *, __reg("d1") struct DateStamp * date)="\tjsr\t-192(a6)";
#define DateStamp(date) __DateStamp(DOSBase, (date))

VOID __Delay(__reg("a6") void *, __reg("d1") LONG timeout)="\tjsr\t-198(a6)";
#define Delay(timeout) __Delay(DOSBase, (timeout))

LONG __WaitForChar(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") LONG timeout)="\tjsr\t-204(a6)";
#define WaitForChar(file, timeout) __WaitForChar(DOSBase, (file), (timeout))

BPTR __ParentDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-210(a6)";
#define ParentDir(lock) __ParentDir(DOSBase, (lock))

LONG __IsInteractive(__reg("a6") void *, __reg("d1") BPTR file)="\tjsr\t-216(a6)";
#define IsInteractive(file) __IsInteractive(DOSBase, (file))

LONG __Execute(__reg("a6") void *, __reg("d1") const STRPTR string, __reg("d2") BPTR file, __reg("d3") BPTR file2)="\tjsr\t-222(a6)";
#define Execute(string, file, file2) __Execute(DOSBase, (string), (file), (file2))

#endif /*  _VBCCINLINE_DOS_H  */
