#ifndef _VBCCINLINE_DOS_H
#define _VBCCINLINE_DOS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BPTR __Open(__reg("a6") void *, __reg("d1") char * name, __reg("d2") long accessMode)="\tjsr\t-30(a6)";
#define Open(name, accessMode) __Open(DOSBase, (name), (accessMode))

void __Close(__reg("a6") void *, __reg("d1") BPTR file)="\tjsr\t-36(a6)";
#define Close(file) __Close(DOSBase, (file))

long __Read(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") char * buffer, __reg("d3") long length)="\tjsr\t-42(a6)";
#define Read(file, buffer, length) __Read(DOSBase, (file), (buffer), (length))

long __Write(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") char * buffer, __reg("d3") long length)="\tjsr\t-48(a6)";
#define Write(file, buffer, length) __Write(DOSBase, (file), (buffer), (length))

BPTR __Input(__reg("a6") void *)="\tjsr\t-54(a6)";
#define Input() __Input(DOSBase)

BPTR __Output(__reg("a6") void *)="\tjsr\t-60(a6)";
#define Output() __Output(DOSBase)

long __Seek(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") long position, __reg("d3") long offset)="\tjsr\t-66(a6)";
#define Seek(file, position, offset) __Seek(DOSBase, (file), (position), (offset))

long __DeleteFile(__reg("a6") void *, __reg("d1") char * name)="\tjsr\t-72(a6)";
#define DeleteFile(name) __DeleteFile(DOSBase, (name))

long __Rename(__reg("a6") void *, __reg("d1") char * oldName, __reg("d2") char * newName)="\tjsr\t-78(a6)";
#define Rename(oldName, newName) __Rename(DOSBase, (oldName), (newName))

BPTR __Lock(__reg("a6") void *, __reg("d1") char * name, __reg("d2") long type)="\tjsr\t-84(a6)";
#define Lock(name, type) __Lock(DOSBase, (name), (type))

void __UnLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-90(a6)";
#define UnLock(lock) __UnLock(DOSBase, (lock))

BPTR __DupLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-96(a6)";
#define DupLock(lock) __DupLock(DOSBase, (lock))

long __Examine(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct FileInfoBlock * fileInfoBlock)="\tjsr\t-102(a6)";
#define Examine(lock, fileInfoBlock) __Examine(DOSBase, (lock), (fileInfoBlock))

long __ExNext(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct FileInfoBlock * fileInfoBlock)="\tjsr\t-108(a6)";
#define ExNext(lock, fileInfoBlock) __ExNext(DOSBase, (lock), (fileInfoBlock))

long __Info(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct InfoData * parameterBlock)="\tjsr\t-114(a6)";
#define Info(lock, parameterBlock) __Info(DOSBase, (lock), (parameterBlock))

BPTR __CreateDir(__reg("a6") void *, __reg("d1") char * name)="\tjsr\t-120(a6)";
#define CreateDir(name) __CreateDir(DOSBase, (name))

BPTR __CurrentDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-126(a6)";
#define CurrentDir(lock) __CurrentDir(DOSBase, (lock))

long __IoErr(__reg("a6") void *)="\tjsr\t-132(a6)";
#define IoErr() __IoErr(DOSBase)

struct MsgPort * __CreateProc(__reg("a6") void *, __reg("d1") char * name, __reg("d2") long pri, __reg("d3") BPTR segList, __reg("d4") long stackSize)="\tjsr\t-138(a6)";
#define CreateProc(name, pri, segList, stackSize) __CreateProc(DOSBase, (name), (pri), (segList), (stackSize))

void __Exit(__reg("a6") void *, __reg("d1") long returnCode)="\tjsr\t-144(a6)";
#define Exit(returnCode) __Exit(DOSBase, (returnCode))

BPTR __LoadSeg(__reg("a6") void *, __reg("d1") char * fileName)="\tjsr\t-150(a6)";
#define LoadSeg(fileName) __LoadSeg(DOSBase, (fileName))

void __UnLoadSeg(__reg("a6") void *, __reg("d1") BPTR segment)="\tjsr\t-156(a6)";
#define UnLoadSeg(segment) __UnLoadSeg(DOSBase, (segment))

struct MsgPort * __DeviceProc(__reg("a6") void *, __reg("d1") char * name)="\tjsr\t-174(a6)";
#define DeviceProc(name) __DeviceProc(DOSBase, (name))

long __SetComment(__reg("a6") void *, __reg("d1") char * name, __reg("d2") char * comment)="\tjsr\t-180(a6)";
#define SetComment(name, comment) __SetComment(DOSBase, (name), (comment))

long __SetProtection(__reg("a6") void *, __reg("d1") char * name, __reg("d2") long mask)="\tjsr\t-186(a6)";
#define SetProtection(name, mask) __SetProtection(DOSBase, (name), (mask))

struct DateStamp * __DateStamp(__reg("a6") void *, __reg("d1") struct DateStamp * date)="\tjsr\t-192(a6)";
#define DateStamp(date) __DateStamp(DOSBase, (date))

void __Delay(__reg("a6") void *, __reg("d1") long timeout)="\tjsr\t-198(a6)";
#define Delay(timeout) __Delay(DOSBase, (timeout))

long __WaitForChar(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") long timeout)="\tjsr\t-204(a6)";
#define WaitForChar(file, timeout) __WaitForChar(DOSBase, (file), (timeout))

BPTR __ParentDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-210(a6)";
#define ParentDir(lock) __ParentDir(DOSBase, (lock))

long __IsInteractive(__reg("a6") void *, __reg("d1") BPTR file)="\tjsr\t-216(a6)";
#define IsInteractive(file) __IsInteractive(DOSBase, (file))

long __Execute(__reg("a6") void *, __reg("d1") char * string, __reg("d2") BPTR file, __reg("d3") BPTR d3arg)="\tjsr\t-222(a6)";
#define Execute(string, file, d3arg) __Execute(DOSBase, (string), (file), (d3arg))

#endif /*  _VBCCINLINE_DOS_H  */
