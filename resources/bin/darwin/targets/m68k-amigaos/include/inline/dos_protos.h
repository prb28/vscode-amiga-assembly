#ifndef _VBCCINLINE_DOS_H
#define _VBCCINLINE_DOS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

BPTR __Open(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG accessMode)="\tjsr\t-30(a6)";
#define Open(name, accessMode) __Open(DOSBase, (name), (accessMode))

LONG __Close(__reg("a6") void *, __reg("d1") BPTR file)="\tjsr\t-36(a6)";
#define Close(file) __Close(DOSBase, (file))

LONG __Read(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") APTR buffer, __reg("d3") LONG length)="\tjsr\t-42(a6)";
#define Read(file, buffer, length) __Read(DOSBase, (file), (buffer), (length))

LONG __Write(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") CONST APTR buffer, __reg("d3") LONG length)="\tjsr\t-48(a6)";
#define Write(file, buffer, length) __Write(DOSBase, (file), (buffer), (length))

BPTR __Input(__reg("a6") void *)="\tjsr\t-54(a6)";
#define Input() __Input(DOSBase)

BPTR __Output(__reg("a6") void *)="\tjsr\t-60(a6)";
#define Output() __Output(DOSBase)

LONG __Seek(__reg("a6") void *, __reg("d1") BPTR file, __reg("d2") LONG position, __reg("d3") LONG offset)="\tjsr\t-66(a6)";
#define Seek(file, position, offset) __Seek(DOSBase, (file), (position), (offset))

LONG __DeleteFile(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-72(a6)";
#define DeleteFile(name) __DeleteFile(DOSBase, (name))

LONG __Rename(__reg("a6") void *, __reg("d1") CONST_STRPTR oldName, __reg("d2") CONST_STRPTR newName)="\tjsr\t-78(a6)";
#define Rename(oldName, newName) __Rename(DOSBase, (oldName), (newName))

BPTR __Lock(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG type)="\tjsr\t-84(a6)";
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

BPTR __CreateDir(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-120(a6)";
#define CreateDir(name) __CreateDir(DOSBase, (name))

BPTR __CurrentDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-126(a6)";
#define CurrentDir(lock) __CurrentDir(DOSBase, (lock))

LONG __IoErr(__reg("a6") void *)="\tjsr\t-132(a6)";
#define IoErr() __IoErr(DOSBase)

struct MsgPort * __CreateProc(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG pri, __reg("d3") BPTR segList, __reg("d4") LONG stackSize)="\tjsr\t-138(a6)";
#define CreateProc(name, pri, segList, stackSize) __CreateProc(DOSBase, (name), (pri), (segList), (stackSize))

VOID __Exit(__reg("a6") void *, __reg("d1") LONG returnCode)="\tjsr\t-144(a6)";
#define Exit(returnCode) __Exit(DOSBase, (returnCode))

BPTR __LoadSeg(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-150(a6)";
#define LoadSeg(name) __LoadSeg(DOSBase, (name))

VOID __UnLoadSeg(__reg("a6") void *, __reg("d1") BPTR seglist)="\tjsr\t-156(a6)";
#define UnLoadSeg(seglist) __UnLoadSeg(DOSBase, (seglist))

struct MsgPort * __DeviceProc(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-174(a6)";
#define DeviceProc(name) __DeviceProc(DOSBase, (name))

LONG __SetComment(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST_STRPTR comment)="\tjsr\t-180(a6)";
#define SetComment(name, comment) __SetComment(DOSBase, (name), (comment))

LONG __SetProtection(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG protect)="\tjsr\t-186(a6)";
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

LONG __Execute(__reg("a6") void *, __reg("d1") CONST_STRPTR string, __reg("d2") BPTR file, __reg("d3") BPTR file2)="\tjsr\t-222(a6)";
#define Execute(string, file, file2) __Execute(DOSBase, (string), (file), (file2))

APTR __AllocDosObject(__reg("a6") void *, __reg("d1") ULONG type, __reg("d2") CONST struct TagItem * tags)="\tjsr\t-228(a6)";
#define AllocDosObject(type, tags) __AllocDosObject(DOSBase, (type), (tags))

#define AllocDosObjectTagList(type, tags) __AllocDosObject(DOSBase, (type), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __AllocDosObjectTags(__reg("a6") void *, __reg("d1") ULONG type, ULONG tags, ...)="\tmove.l\td2,-(a7)\n\tmove.l\ta7,d2\n\taddq.l\t#4,d2\n\tjsr\t-228(a6)\n\tmove.l\t(a7)+,d2";
#define AllocDosObjectTags(type, ...) __AllocDosObjectTags(DOSBase, (type), __VA_ARGS__)
#endif

VOID __FreeDosObject(__reg("a6") void *, __reg("d1") ULONG type, __reg("d2") APTR ptr)="\tjsr\t-234(a6)";
#define FreeDosObject(type, ptr) __FreeDosObject(DOSBase, (type), (ptr))

LONG __DoPkt(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action, __reg("d3") LONG arg1, __reg("d4") LONG arg2, __reg("d5") LONG arg3, __reg("d6") LONG arg4, __reg("d7") LONG arg5)="\tjsr\t-240(a6)";
#define DoPkt(port, action, arg1, arg2, arg3, arg4, arg5) __DoPkt(DOSBase, (port), (action), (arg1), (arg2), (arg3), (arg4), (arg5))

LONG __DoPkt0(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action)="\tjsr\t-240(a6)";
#define DoPkt0(port, action) __DoPkt0(DOSBase, (port), (action))

LONG __DoPkt1(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action, __reg("d3") LONG arg1)="\tjsr\t-240(a6)";
#define DoPkt1(port, action, arg1) __DoPkt1(DOSBase, (port), (action), (arg1))

LONG __DoPkt2(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action, __reg("d3") LONG arg1, __reg("d4") LONG arg2)="\tjsr\t-240(a6)";
#define DoPkt2(port, action, arg1, arg2) __DoPkt2(DOSBase, (port), (action), (arg1), (arg2))

LONG __DoPkt3(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action, __reg("d3") LONG arg1, __reg("d4") LONG arg2, __reg("d5") LONG arg3)="\tjsr\t-240(a6)";
#define DoPkt3(port, action, arg1, arg2, arg3) __DoPkt3(DOSBase, (port), (action), (arg1), (arg2), (arg3))

LONG __DoPkt4(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") LONG action, __reg("d3") LONG arg1, __reg("d4") LONG arg2, __reg("d5") LONG arg3, __reg("d6") LONG arg4)="\tjsr\t-240(a6)";
#define DoPkt4(port, action, arg1, arg2, arg3, arg4) __DoPkt4(DOSBase, (port), (action), (arg1), (arg2), (arg3), (arg4))

VOID __SendPkt(__reg("a6") void *, __reg("d1") struct DosPacket * dp, __reg("d2") struct MsgPort * port, __reg("d3") struct MsgPort * replyport)="\tjsr\t-246(a6)";
#define SendPkt(dp, port, replyport) __SendPkt(DOSBase, (dp), (port), (replyport))

struct DosPacket * __WaitPkt(__reg("a6") void *)="\tjsr\t-252(a6)";
#define WaitPkt() __WaitPkt(DOSBase)

VOID __ReplyPkt(__reg("a6") void *, __reg("d1") struct DosPacket * dp, __reg("d2") LONG res1, __reg("d3") LONG res2)="\tjsr\t-258(a6)";
#define ReplyPkt(dp, res1, res2) __ReplyPkt(DOSBase, (dp), (res1), (res2))

VOID __AbortPkt(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") struct DosPacket * pkt)="\tjsr\t-264(a6)";
#define AbortPkt(port, pkt) __AbortPkt(DOSBase, (port), (pkt))

BOOL __LockRecord(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") ULONG offset, __reg("d3") ULONG length, __reg("d4") ULONG mode, __reg("d5") ULONG timeout)="\tjsr\t-270(a6)";
#define LockRecord(fh, offset, length, mode, timeout) __LockRecord(DOSBase, (fh), (offset), (length), (mode), (timeout))

BOOL __LockRecords(__reg("a6") void *, __reg("d1") struct RecordLock * recArray, __reg("d2") ULONG timeout)="\tjsr\t-276(a6)";
#define LockRecords(recArray, timeout) __LockRecords(DOSBase, (recArray), (timeout))

BOOL __UnLockRecord(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") ULONG offset, __reg("d3") ULONG length)="\tjsr\t-282(a6)";
#define UnLockRecord(fh, offset, length) __UnLockRecord(DOSBase, (fh), (offset), (length))

BOOL __UnLockRecords(__reg("a6") void *, __reg("d1") struct RecordLock * recArray)="\tjsr\t-288(a6)";
#define UnLockRecords(recArray) __UnLockRecords(DOSBase, (recArray))

BPTR __SelectInput(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-294(a6)";
#define SelectInput(fh) __SelectInput(DOSBase, (fh))

BPTR __SelectOutput(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-300(a6)";
#define SelectOutput(fh) __SelectOutput(DOSBase, (fh))

LONG __FGetC(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-306(a6)";
#define FGetC(fh) __FGetC(DOSBase, (fh))

LONG __FPutC(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") LONG ch)="\tjsr\t-312(a6)";
#define FPutC(fh, ch) __FPutC(DOSBase, (fh), (ch))

LONG __UnGetC(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") LONG character)="\tjsr\t-318(a6)";
#define UnGetC(fh, character) __UnGetC(DOSBase, (fh), (character))

LONG __FRead(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") APTR block, __reg("d3") ULONG blocklen, __reg("d4") ULONG number)="\tjsr\t-324(a6)";
#define FRead(fh, block, blocklen, number) __FRead(DOSBase, (fh), (block), (blocklen), (number))

LONG __FWrite(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST APTR block, __reg("d3") ULONG blocklen, __reg("d4") ULONG number)="\tjsr\t-330(a6)";
#define FWrite(fh, block, blocklen, number) __FWrite(DOSBase, (fh), (block), (blocklen), (number))

STRPTR __FGets(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") STRPTR buf, __reg("d3") ULONG buflen)="\tjsr\t-336(a6)";
#define FGets(fh, buf, buflen) __FGets(DOSBase, (fh), (buf), (buflen))

LONG __FPuts(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST_STRPTR str)="\tjsr\t-342(a6)";
#define FPuts(fh, str) __FPuts(DOSBase, (fh), (str))

VOID __VFWritef(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST_STRPTR format, __reg("d3") CONST LONG * argarray)="\tjsr\t-348(a6)";
#define VFWritef(fh, format, argarray) __VFWritef(DOSBase, (fh), (format), (argarray))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __FWritef(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST_STRPTR format, ...)="\tmove.l\td3,-(a7)\n\tmove.l\ta7,d3\n\taddq.l\t#4,d3\n\tjsr\t-348(a6)\n\tmove.l\t(a7)+,d3";
#define FWritef(fh, ...) __FWritef(DOSBase, (fh), __VA_ARGS__)
#endif

LONG __VFPrintf(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST_STRPTR format, __reg("d3") CONST APTR argarray)="\tjsr\t-354(a6)";
#define VFPrintf(fh, format, argarray) __VFPrintf(DOSBase, (fh), (format), (argarray))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __FPrintf(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") CONST_STRPTR format, ...)="\tmove.l\td3,-(a7)\n\tmove.l\ta7,d3\n\taddq.l\t#4,d3\n\tjsr\t-354(a6)\n\tmove.l\t(a7)+,d3";
#define FPrintf(fh, ...) __FPrintf(DOSBase, (fh), __VA_ARGS__)
#endif

LONG __Flush(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-360(a6)";
#define Flush(fh) __Flush(DOSBase, (fh))

LONG __SetVBuf(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") STRPTR buff, __reg("d3") LONG type, __reg("d4") LONG size)="\tjsr\t-366(a6)";
#define SetVBuf(fh, buff, type, size) __SetVBuf(DOSBase, (fh), (buff), (type), (size))

BPTR __DupLockFromFH(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-372(a6)";
#define DupLockFromFH(fh) __DupLockFromFH(DOSBase, (fh))

BPTR __OpenFromLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-378(a6)";
#define OpenFromLock(lock) __OpenFromLock(DOSBase, (lock))

BPTR __ParentOfFH(__reg("a6") void *, __reg("d1") BPTR fh)="\tjsr\t-384(a6)";
#define ParentOfFH(fh) __ParentOfFH(DOSBase, (fh))

BOOL __ExamineFH(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") struct FileInfoBlock * fib)="\tjsr\t-390(a6)";
#define ExamineFH(fh, fib) __ExamineFH(DOSBase, (fh), (fib))

LONG __SetFileDate(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST struct DateStamp * date)="\tjsr\t-396(a6)";
#define SetFileDate(name, date) __SetFileDate(DOSBase, (name), (date))

LONG __NameFromLock(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") STRPTR buffer, __reg("d3") LONG len)="\tjsr\t-402(a6)";
#define NameFromLock(lock, buffer, len) __NameFromLock(DOSBase, (lock), (buffer), (len))

LONG __NameFromFH(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") STRPTR buffer, __reg("d3") LONG len)="\tjsr\t-408(a6)";
#define NameFromFH(fh, buffer, len) __NameFromFH(DOSBase, (fh), (buffer), (len))

WORD __SplitName(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") ULONG separator, __reg("d3") STRPTR buf, __reg("d4") LONG oldpos, __reg("d5") LONG size)="\tjsr\t-414(a6)";
#define SplitName(name, separator, buf, oldpos, size) __SplitName(DOSBase, (name), (separator), (buf), (oldpos), (size))

LONG __SameLock(__reg("a6") void *, __reg("d1") BPTR lock1, __reg("d2") BPTR lock2)="\tjsr\t-420(a6)";
#define SameLock(lock1, lock2) __SameLock(DOSBase, (lock1), (lock2))

LONG __SetMode(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") LONG mode)="\tjsr\t-426(a6)";
#define SetMode(fh, mode) __SetMode(DOSBase, (fh), (mode))

LONG __ExAll(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct ExAllData * buffer, __reg("d3") LONG size, __reg("d4") LONG data, __reg("d5") struct ExAllControl * control)="\tjsr\t-432(a6)";
#define ExAll(lock, buffer, size, data, control) __ExAll(DOSBase, (lock), (buffer), (size), (data), (control))

LONG __ReadLink(__reg("a6") void *, __reg("d1") struct MsgPort * port, __reg("d2") BPTR lock, __reg("d3") CONST_STRPTR path, __reg("d4") STRPTR buffer, __reg("d5") ULONG size)="\tjsr\t-438(a6)";
#define ReadLink(port, lock, path, buffer, size) __ReadLink(DOSBase, (port), (lock), (path), (buffer), (size))

LONG __MakeLink(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG dest, __reg("d3") LONG soft)="\tjsr\t-444(a6)";
#define MakeLink(name, dest, soft) __MakeLink(DOSBase, (name), (dest), (soft))

LONG __ChangeMode(__reg("a6") void *, __reg("d1") LONG type, __reg("d2") BPTR fh, __reg("d3") LONG newmode)="\tjsr\t-450(a6)";
#define ChangeMode(type, fh, newmode) __ChangeMode(DOSBase, (type), (fh), (newmode))

LONG __SetFileSize(__reg("a6") void *, __reg("d1") BPTR fh, __reg("d2") LONG pos, __reg("d3") LONG mode)="\tjsr\t-456(a6)";
#define SetFileSize(fh, pos, mode) __SetFileSize(DOSBase, (fh), (pos), (mode))

LONG __SetIoErr(__reg("a6") void *, __reg("d1") LONG result)="\tjsr\t-462(a6)";
#define SetIoErr(result) __SetIoErr(DOSBase, (result))

BOOL __Fault(__reg("a6") void *, __reg("d1") LONG code, __reg("d2") STRPTR header, __reg("d3") STRPTR buffer, __reg("d4") LONG len)="\tjsr\t-468(a6)";
#define Fault(code, header, buffer, len) __Fault(DOSBase, (code), (header), (buffer), (len))

BOOL __PrintFault(__reg("a6") void *, __reg("d1") LONG code, __reg("d2") CONST_STRPTR header)="\tjsr\t-474(a6)";
#define PrintFault(code, header) __PrintFault(DOSBase, (code), (header))

LONG __ErrorReport(__reg("a6") void *, __reg("d1") LONG code, __reg("d2") LONG type, __reg("d3") ULONG arg1, __reg("d4") struct MsgPort * device)="\tjsr\t-480(a6)";
#define ErrorReport(code, type, arg1, device) __ErrorReport(DOSBase, (code), (type), (arg1), (device))

struct CommandLineInterface * __Cli(__reg("a6") void *)="\tjsr\t-492(a6)";
#define Cli() __Cli(DOSBase)

struct Process * __CreateNewProc(__reg("a6") void *, __reg("d1") CONST struct TagItem * tags)="\tjsr\t-498(a6)";
#define CreateNewProc(tags) __CreateNewProc(DOSBase, (tags))

#define CreateNewProcTagList(tags) __CreateNewProc(DOSBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Process * __CreateNewProcTags(__reg("a6") void *, ULONG tags, ...)="\tmove.l\td1,-(a7)\n\tmove.l\ta7,d1\n\taddq.l\t#4,d1\n\tjsr\t-498(a6)\n\tmove.l\t(a7)+,d1";
#define CreateNewProcTags(...) __CreateNewProcTags(DOSBase, __VA_ARGS__)
#endif

LONG __RunCommand(__reg("a6") void *, __reg("d1") BPTR seg, __reg("d2") LONG stack, __reg("d3") CONST_STRPTR paramptr, __reg("d4") LONG paramlen)="\tjsr\t-504(a6)";
#define RunCommand(seg, stack, paramptr, paramlen) __RunCommand(DOSBase, (seg), (stack), (paramptr), (paramlen))

struct MsgPort * __GetConsoleTask(__reg("a6") void *)="\tjsr\t-510(a6)";
#define GetConsoleTask() __GetConsoleTask(DOSBase)

struct MsgPort * __SetConsoleTask(__reg("a6") void *, __reg("d1") CONST struct MsgPort * task)="\tjsr\t-516(a6)";
#define SetConsoleTask(task) __SetConsoleTask(DOSBase, (task))

struct MsgPort * __GetFileSysTask(__reg("a6") void *)="\tjsr\t-522(a6)";
#define GetFileSysTask() __GetFileSysTask(DOSBase)

struct MsgPort * __SetFileSysTask(__reg("a6") void *, __reg("d1") CONST struct MsgPort * task)="\tjsr\t-528(a6)";
#define SetFileSysTask(task) __SetFileSysTask(DOSBase, (task))

STRPTR __GetArgStr(__reg("a6") void *)="\tjsr\t-534(a6)";
#define GetArgStr() __GetArgStr(DOSBase)

BOOL __SetArgStr(__reg("a6") void *, __reg("d1") CONST_STRPTR string)="\tjsr\t-540(a6)";
#define SetArgStr(string) __SetArgStr(DOSBase, (string))

struct Process * __FindCliProc(__reg("a6") void *, __reg("d1") ULONG num)="\tjsr\t-546(a6)";
#define FindCliProc(num) __FindCliProc(DOSBase, (num))

ULONG __MaxCli(__reg("a6") void *)="\tjsr\t-552(a6)";
#define MaxCli() __MaxCli(DOSBase)

BOOL __SetCurrentDirName(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-558(a6)";
#define SetCurrentDirName(name) __SetCurrentDirName(DOSBase, (name))

BOOL __GetCurrentDirName(__reg("a6") void *, __reg("d1") STRPTR buf, __reg("d2") LONG len)="\tjsr\t-564(a6)";
#define GetCurrentDirName(buf, len) __GetCurrentDirName(DOSBase, (buf), (len))

BOOL __SetProgramName(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-570(a6)";
#define SetProgramName(name) __SetProgramName(DOSBase, (name))

BOOL __GetProgramName(__reg("a6") void *, __reg("d1") STRPTR buf, __reg("d2") LONG len)="\tjsr\t-576(a6)";
#define GetProgramName(buf, len) __GetProgramName(DOSBase, (buf), (len))

BOOL __SetPrompt(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-582(a6)";
#define SetPrompt(name) __SetPrompt(DOSBase, (name))

BOOL __GetPrompt(__reg("a6") void *, __reg("d1") STRPTR buf, __reg("d2") LONG len)="\tjsr\t-588(a6)";
#define GetPrompt(buf, len) __GetPrompt(DOSBase, (buf), (len))

BPTR __SetProgramDir(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-594(a6)";
#define SetProgramDir(lock) __SetProgramDir(DOSBase, (lock))

BPTR __GetProgramDir(__reg("a6") void *)="\tjsr\t-600(a6)";
#define GetProgramDir() __GetProgramDir(DOSBase)

LONG __SystemTagList(__reg("a6") void *, __reg("d1") CONST_STRPTR command, __reg("d2") CONST struct TagItem * tags)="\tjsr\t-606(a6)";
#define SystemTagList(command, tags) __SystemTagList(DOSBase, (command), (tags))

#define System(command, tags) __SystemTagList(DOSBase, (command), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __SystemTags(__reg("a6") void *, __reg("d1") CONST_STRPTR command, ULONG tags, ...)="\tmove.l\td2,-(a7)\n\tmove.l\ta7,d2\n\taddq.l\t#4,d2\n\tjsr\t-606(a6)\n\tmove.l\t(a7)+,d2";
#define SystemTags(command, ...) __SystemTags(DOSBase, (command), __VA_ARGS__)
#endif

LONG __AssignLock(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") BPTR lock)="\tjsr\t-612(a6)";
#define AssignLock(name, lock) __AssignLock(DOSBase, (name), (lock))

BOOL __AssignLate(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST_STRPTR path)="\tjsr\t-618(a6)";
#define AssignLate(name, path) __AssignLate(DOSBase, (name), (path))

BOOL __AssignPath(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST_STRPTR path)="\tjsr\t-624(a6)";
#define AssignPath(name, path) __AssignPath(DOSBase, (name), (path))

BOOL __AssignAdd(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") BPTR lock)="\tjsr\t-630(a6)";
#define AssignAdd(name, lock) __AssignAdd(DOSBase, (name), (lock))

LONG __RemAssignList(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") BPTR lock)="\tjsr\t-636(a6)";
#define RemAssignList(name, lock) __RemAssignList(DOSBase, (name), (lock))

struct DevProc * __GetDeviceProc(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") struct DevProc * dp)="\tjsr\t-642(a6)";
#define GetDeviceProc(name, dp) __GetDeviceProc(DOSBase, (name), (dp))

VOID __FreeDeviceProc(__reg("a6") void *, __reg("d1") struct DevProc * dp)="\tjsr\t-648(a6)";
#define FreeDeviceProc(dp) __FreeDeviceProc(DOSBase, (dp))

struct DosList * __LockDosList(__reg("a6") void *, __reg("d1") ULONG flags)="\tjsr\t-654(a6)";
#define LockDosList(flags) __LockDosList(DOSBase, (flags))

VOID __UnLockDosList(__reg("a6") void *, __reg("d1") ULONG flags)="\tjsr\t-660(a6)";
#define UnLockDosList(flags) __UnLockDosList(DOSBase, (flags))

struct DosList * __AttemptLockDosList(__reg("a6") void *, __reg("d1") ULONG flags)="\tjsr\t-666(a6)";
#define AttemptLockDosList(flags) __AttemptLockDosList(DOSBase, (flags))

BOOL __RemDosEntry(__reg("a6") void *, __reg("d1") struct DosList * dlist)="\tjsr\t-672(a6)";
#define RemDosEntry(dlist) __RemDosEntry(DOSBase, (dlist))

LONG __AddDosEntry(__reg("a6") void *, __reg("d1") struct DosList * dlist)="\tjsr\t-678(a6)";
#define AddDosEntry(dlist) __AddDosEntry(DOSBase, (dlist))

struct DosList * __FindDosEntry(__reg("a6") void *, __reg("d1") CONST struct DosList * dlist, __reg("d2") CONST_STRPTR name, __reg("d3") ULONG flags)="\tjsr\t-684(a6)";
#define FindDosEntry(dlist, name, flags) __FindDosEntry(DOSBase, (dlist), (name), (flags))

struct DosList * __NextDosEntry(__reg("a6") void *, __reg("d1") CONST struct DosList * dlist, __reg("d2") ULONG flags)="\tjsr\t-690(a6)";
#define NextDosEntry(dlist, flags) __NextDosEntry(DOSBase, (dlist), (flags))

struct DosList * __MakeDosEntry(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG type)="\tjsr\t-696(a6)";
#define MakeDosEntry(name, type) __MakeDosEntry(DOSBase, (name), (type))

VOID __FreeDosEntry(__reg("a6") void *, __reg("d1") struct DosList * dlist)="\tjsr\t-702(a6)";
#define FreeDosEntry(dlist) __FreeDosEntry(DOSBase, (dlist))

BOOL __IsFileSystem(__reg("a6") void *, __reg("d1") CONST_STRPTR name)="\tjsr\t-708(a6)";
#define IsFileSystem(name) __IsFileSystem(DOSBase, (name))

BOOL __Format(__reg("a6") void *, __reg("d1") CONST_STRPTR filesystem, __reg("d2") CONST_STRPTR volumename, __reg("d3") ULONG dostype)="\tjsr\t-714(a6)";
#define Format(filesystem, volumename, dostype) __Format(DOSBase, (filesystem), (volumename), (dostype))

LONG __Relabel(__reg("a6") void *, __reg("d1") CONST_STRPTR drive, __reg("d2") CONST_STRPTR newname)="\tjsr\t-720(a6)";
#define Relabel(drive, newname) __Relabel(DOSBase, (drive), (newname))

LONG __Inhibit(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG onoff)="\tjsr\t-726(a6)";
#define Inhibit(name, onoff) __Inhibit(DOSBase, (name), (onoff))

LONG __AddBuffers(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG number)="\tjsr\t-732(a6)";
#define AddBuffers(name, number) __AddBuffers(DOSBase, (name), (number))

LONG __CompareDates(__reg("a6") void *, __reg("d1") CONST struct DateStamp * date1, __reg("d2") CONST struct DateStamp * date2)="\tjsr\t-738(a6)";
#define CompareDates(date1, date2) __CompareDates(DOSBase, (date1), (date2))

LONG __DateToStr(__reg("a6") void *, __reg("d1") struct DateTime * datetime)="\tjsr\t-744(a6)";
#define DateToStr(datetime) __DateToStr(DOSBase, (datetime))

LONG __StrToDate(__reg("a6") void *, __reg("d1") struct DateTime * datetime)="\tjsr\t-750(a6)";
#define StrToDate(datetime) __StrToDate(DOSBase, (datetime))

BPTR __InternalLoadSeg(__reg("a6") void *, __reg("d0") BPTR fh, __reg("a0") void * table, __reg("a1") CONST LONG * funcarray, __reg("a2") LONG * stack)="\tjsr\t-756(a6)";
#define InternalLoadSeg(fh, table, funcarray, stack) __InternalLoadSeg(DOSBase, (fh), (void *)(table), (funcarray), (stack))

BOOL __InternalUnLoadSeg(__reg("a6") void *, __reg("d1") BPTR seglist, __reg("a1") VOID (*freefunc)())="\tjsr\t-762(a6)";
#define InternalUnLoadSeg(seglist, freefunc) __InternalUnLoadSeg(DOSBase, (seglist), (freefunc))

BPTR __NewLoadSeg(__reg("a6") void *, __reg("d1") CONST_STRPTR file, __reg("d2") CONST struct TagItem * tags)="\tjsr\t-768(a6)";
#define NewLoadSeg(file, tags) __NewLoadSeg(DOSBase, (file), (tags))

#define NewLoadSegTagList(file, tags) __NewLoadSeg(DOSBase, (file), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BPTR __NewLoadSegTags(__reg("a6") void *, __reg("d1") CONST_STRPTR file, ULONG tags, ...)="\tmove.l\td2,-(a7)\n\tmove.l\ta7,d2\n\taddq.l\t#4,d2\n\tjsr\t-768(a6)\n\tmove.l\t(a7)+,d2";
#define NewLoadSegTags(file, ...) __NewLoadSegTags(DOSBase, (file), __VA_ARGS__)
#endif

LONG __AddSegment(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") BPTR seg, __reg("d3") LONG system)="\tjsr\t-774(a6)";
#define AddSegment(name, seg, system) __AddSegment(DOSBase, (name), (seg), (system))

struct Segment * __FindSegment(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST struct Segment * seg, __reg("d3") LONG system)="\tjsr\t-780(a6)";
#define FindSegment(name, seg, system) __FindSegment(DOSBase, (name), (seg), (system))

LONG __RemSegment(__reg("a6") void *, __reg("d1") struct Segment * seg)="\tjsr\t-786(a6)";
#define RemSegment(seg) __RemSegment(DOSBase, (seg))

LONG __CheckSignal(__reg("a6") void *, __reg("d1") LONG mask)="\tjsr\t-792(a6)";
#define CheckSignal(mask) __CheckSignal(DOSBase, (mask))

struct RDArgs * __ReadArgs(__reg("a6") void *, __reg("d1") CONST_STRPTR arg_template, __reg("d2") LONG * array, __reg("d3") struct RDArgs * args)="\tjsr\t-798(a6)";
#define ReadArgs(arg_template, array, args) __ReadArgs(DOSBase, (arg_template), (array), (args))

LONG __FindArg(__reg("a6") void *, __reg("d1") CONST_STRPTR keyword, __reg("d2") CONST_STRPTR arg_template)="\tjsr\t-804(a6)";
#define FindArg(keyword, arg_template) __FindArg(DOSBase, (keyword), (arg_template))

LONG __ReadItem(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG maxchars, __reg("d3") struct CSource * cSource)="\tjsr\t-810(a6)";
#define ReadItem(name, maxchars, cSource) __ReadItem(DOSBase, (name), (maxchars), (cSource))

LONG __StrToLong(__reg("a6") void *, __reg("d1") CONST_STRPTR string, __reg("d2") LONG * value)="\tjsr\t-816(a6)";
#define StrToLong(string, value) __StrToLong(DOSBase, (string), (value))

LONG __MatchFirst(__reg("a6") void *, __reg("d1") CONST_STRPTR pat, __reg("d2") struct AnchorPath * anchor)="\tjsr\t-822(a6)";
#define MatchFirst(pat, anchor) __MatchFirst(DOSBase, (pat), (anchor))

LONG __MatchNext(__reg("a6") void *, __reg("d1") struct AnchorPath * anchor)="\tjsr\t-828(a6)";
#define MatchNext(anchor) __MatchNext(DOSBase, (anchor))

VOID __MatchEnd(__reg("a6") void *, __reg("d1") struct AnchorPath * anchor)="\tjsr\t-834(a6)";
#define MatchEnd(anchor) __MatchEnd(DOSBase, (anchor))

LONG __ParsePattern(__reg("a6") void *, __reg("d1") CONST_STRPTR pat, __reg("d2") STRPTR buf, __reg("d3") LONG buflen)="\tjsr\t-840(a6)";
#define ParsePattern(pat, buf, buflen) __ParsePattern(DOSBase, (pat), (buf), (buflen))

BOOL __MatchPattern(__reg("a6") void *, __reg("d1") CONST_STRPTR pat, __reg("d2") STRPTR str)="\tjsr\t-846(a6)";
#define MatchPattern(pat, str) __MatchPattern(DOSBase, (pat), (str))

VOID __FreeArgs(__reg("a6") void *, __reg("d1") struct RDArgs * args)="\tjsr\t-858(a6)";
#define FreeArgs(args) __FreeArgs(DOSBase, (args))

STRPTR __FilePart(__reg("a6") void *, __reg("d1") CONST_STRPTR path)="\tjsr\t-870(a6)";
#define FilePart(path) __FilePart(DOSBase, (path))

STRPTR __PathPart(__reg("a6") void *, __reg("d1") CONST_STRPTR path)="\tjsr\t-876(a6)";
#define PathPart(path) __PathPart(DOSBase, (path))

BOOL __AddPart(__reg("a6") void *, __reg("d1") STRPTR dirname, __reg("d2") CONST_STRPTR filename, __reg("d3") ULONG size)="\tjsr\t-882(a6)";
#define AddPart(dirname, filename, size) __AddPart(DOSBase, (dirname), (filename), (size))

BOOL __StartNotify(__reg("a6") void *, __reg("d1") struct NotifyRequest * notify)="\tjsr\t-888(a6)";
#define StartNotify(notify) __StartNotify(DOSBase, (notify))

VOID __EndNotify(__reg("a6") void *, __reg("d1") struct NotifyRequest * notify)="\tjsr\t-894(a6)";
#define EndNotify(notify) __EndNotify(DOSBase, (notify))

BOOL __SetVar(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") CONST_STRPTR buffer, __reg("d3") LONG size, __reg("d4") LONG flags)="\tjsr\t-900(a6)";
#define SetVar(name, buffer, size, flags) __SetVar(DOSBase, (name), (buffer), (size), (flags))

LONG __GetVar(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") STRPTR buffer, __reg("d3") LONG size, __reg("d4") LONG flags)="\tjsr\t-906(a6)";
#define GetVar(name, buffer, size, flags) __GetVar(DOSBase, (name), (buffer), (size), (flags))

LONG __DeleteVar(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") ULONG flags)="\tjsr\t-912(a6)";
#define DeleteVar(name, flags) __DeleteVar(DOSBase, (name), (flags))

struct LocalVar * __FindVar(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") ULONG type)="\tjsr\t-918(a6)";
#define FindVar(name, type) __FindVar(DOSBase, (name), (type))

LONG __CliInitNewcli(__reg("a6") void *, __reg("a0") struct DosPacket * dp)="\tjsr\t-930(a6)";
#define CliInitNewcli(dp) __CliInitNewcli(DOSBase, (dp))

LONG __CliInitRun(__reg("a6") void *, __reg("a0") struct DosPacket * dp)="\tjsr\t-936(a6)";
#define CliInitRun(dp) __CliInitRun(DOSBase, (dp))

LONG __WriteChars(__reg("a6") void *, __reg("d1") CONST_STRPTR buf, __reg("d2") ULONG buflen)="\tjsr\t-942(a6)";
#define WriteChars(buf, buflen) __WriteChars(DOSBase, (buf), (buflen))

LONG __PutStr(__reg("a6") void *, __reg("d1") CONST_STRPTR str)="\tjsr\t-948(a6)";
#define PutStr(str) __PutStr(DOSBase, (str))

LONG __VPrintf(__reg("a6") void *, __reg("d1") CONST_STRPTR format, __reg("d2") CONST APTR argarray)="\tjsr\t-954(a6)";
#define VPrintf(format, argarray) __VPrintf(DOSBase, (format), (argarray))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __Printf(__reg("a6") void *, __reg("d1") CONST_STRPTR format, ...)="\tmove.l\td2,-(a7)\n\tmove.l\ta7,d2\n\taddq.l\t#4,d2\n\tjsr\t-954(a6)\n\tmove.l\t(a7)+,d2";
#define Printf(...) __Printf(DOSBase, __VA_ARGS__)
#endif

LONG __ParsePatternNoCase(__reg("a6") void *, __reg("d1") CONST_STRPTR pat, __reg("d2") UBYTE * buf, __reg("d3") LONG buflen)="\tjsr\t-966(a6)";
#define ParsePatternNoCase(pat, buf, buflen) __ParsePatternNoCase(DOSBase, (pat), (buf), (buflen))

BOOL __MatchPatternNoCase(__reg("a6") void *, __reg("d1") CONST_STRPTR pat, __reg("d2") STRPTR str)="\tjsr\t-972(a6)";
#define MatchPatternNoCase(pat, str) __MatchPatternNoCase(DOSBase, (pat), (str))

BOOL __SameDevice(__reg("a6") void *, __reg("d1") BPTR lock1, __reg("d2") BPTR lock2)="\tjsr\t-984(a6)";
#define SameDevice(lock1, lock2) __SameDevice(DOSBase, (lock1), (lock2))

VOID __ExAllEnd(__reg("a6") void *, __reg("d1") BPTR lock, __reg("d2") struct ExAllData * buffer, __reg("d3") LONG size, __reg("d4") LONG data, __reg("d5") struct ExAllControl * control)="\tjsr\t-990(a6)";
#define ExAllEnd(lock, buffer, size, data, control) __ExAllEnd(DOSBase, (lock), (buffer), (size), (data), (control))

BOOL __SetOwner(__reg("a6") void *, __reg("d1") CONST_STRPTR name, __reg("d2") LONG owner_info)="\tjsr\t-996(a6)";
#define SetOwner(name, owner_info) __SetOwner(DOSBase, (name), (owner_info))

#endif /*  _VBCCINLINE_DOS_H  */
