#ifndef _VBCCINLINE_ARP_H
#define _VBCCINLINE_ARP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __PrintfA__(__reg("a6") void *, __reg("a0") const STRPTR string, __reg("a1") void * stream)="\tjsr\t-228(a6)";
#define PrintfA__(string, stream) __PrintfA__(ArpBase, (string), (stream))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __Printf(__reg("a6") void *, __reg("a0") const STRPTR string, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-228(a6)\n\tmovea.l\t(a7)+,a1";
#define Printf(...) __Printf(ArpBase, __VA_ARGS__)
#endif

LONG __FPrintfA__(__reg("a6") void *, __reg("d0") BPTR file, __reg("a0") const STRPTR string, __reg("a1") void * stream)="\tjsr\t-234(a6)";
#define FPrintfA__(file, string, stream) __FPrintfA__(ArpBase, (file), (string), (stream))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __FPrintf(__reg("a6") void *, __reg("d0") BPTR file, __reg("a0") const STRPTR string, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-234(a6)\n\tmovea.l\t(a7)+,a1";
#define FPrintf(file, ...) __FPrintf(ArpBase, (file), __VA_ARGS__)
#endif

LONG __Puts(__reg("a6") void *, __reg("a1") const STRPTR string)="\tjsr\t-240(a6)";
#define Puts(string) __Puts(ArpBase, (string))

LONG __ReadLine(__reg("a6") void *, __reg("a0") STRPTR buffer)="\tjsr\t-246(a6)";
#define ReadLine(buffer) __ReadLine(ArpBase, (buffer))

LONG __GADS(__reg("a6") void *, __reg("a0") const STRPTR line, __reg("d0") LONG len, __reg("a1") const STRPTR help, __reg("a2") const STRPTR * args, __reg("a3") const STRPTR tmplate)="\tjsr\t-252(a6)";
#define GADS(line, len, help, args, tmplate) __GADS(ArpBase, (line), (len), (help), (args), (tmplate))

LONG __Atol(__reg("a6") void *, __reg("a0") const STRPTR string)="\tjsr\t-258(a6)";
#define Atol(string) __Atol(ArpBase, (string))

ULONG __EscapeString(__reg("a6") void *, __reg("a0") const STRPTR string)="\tjsr\t-264(a6)";
#define EscapeString(string) __EscapeString(ArpBase, (string))

LONG __CheckAbort(__reg("a6") void *, __reg("a1") VOID (*func)())="\tjsr\t-270(a6)";
#define CheckAbort(func) __CheckAbort(ArpBase, (func))

LONG __CheckBreak(__reg("a6") void *, __reg("d1") LONG masks, __reg("a1") VOID (*func)())="\tjsr\t-276(a6)";
#define CheckBreak(masks, func) __CheckBreak(ArpBase, (masks), (func))

BYTE * __Getenv(__reg("a6") void *, __reg("a0") const STRPTR string, __reg("a1") STRPTR buffer, __reg("d0") LONG size)="\tjsr\t-282(a6)";
#define Getenv(string, buffer, size) __Getenv(ArpBase, (string), (buffer), (size))

BOOL __Setenv(__reg("a6") void *, __reg("a0") const STRPTR varname, __reg("a1") const STRPTR value)="\tjsr\t-288(a6)";
#define Setenv(varname, value) __Setenv(ArpBase, (varname), (value))

BYTE * __FileRequest(__reg("a6") void *, __reg("a0") struct FileRequester * filerequester)="\tjsr\t-294(a6)";
#define FileRequest(filerequester) __FileRequest(ArpBase, (filerequester))

VOID __CloseWindowSafely(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") void * furtherwindows)="\tjsr\t-300(a6)";
#define CloseWindowSafely(window, furtherwindows) __CloseWindowSafely(ArpBase, (window), (void *)(furtherwindows))

struct MsgPort * __CreatePort(__reg("a6") void *, __reg("a0") const STRPTR name, __reg("d0") LONG pri)="\tjsr\t-306(a6)";
#define CreatePort(name, pri) __CreatePort(ArpBase, (name), (pri))

VOID __DeletePort(__reg("a6") void *, __reg("a1") struct MsgPort * port)="\tjsr\t-312(a6)";
#define DeletePort(port) __DeletePort(ArpBase, (port))

LONG __SendPacket(__reg("a6") void *, __reg("d0") LONG action, __reg("a0") LONG * args, __reg("a1") struct MsgPort * handler)="\tjsr\t-318(a6)";
#define SendPacket(action, args, handler) __SendPacket(ArpBase, (action), (args), (handler))

VOID __InitStdPacket(__reg("a6") void *, __reg("d0") LONG action, __reg("a0") LONG * args, __reg("a1") struct DosPacket * packet, __reg("a2") struct MsgPort * replyport)="\tjsr\t-324(a6)";
#define InitStdPacket(action, args, packet, replyport) __InitStdPacket(ArpBase, (action), (args), (packet), (replyport))

ULONG __PathName(__reg("a6") void *, __reg("d0") BPTR lock, __reg("a0") STRPTR buffer, __reg("d1") LONG componentcount)="\tjsr\t-330(a6)";
#define PathName(lock, buffer, componentcount) __PathName(ArpBase, (lock), (buffer), (componentcount))

ULONG __Assign(__reg("a6") void *, __reg("a0") const STRPTR logical, __reg("a1") const STRPTR physical)="\tjsr\t-336(a6)";
#define Assign(logical, physical) __Assign(ArpBase, (logical), (physical))

VOID * __DosAllocMem(__reg("a6") void *, __reg("d0") LONG size)="\tjsr\t-342(a6)";
#define DosAllocMem(size) __DosAllocMem(ArpBase, (size))

VOID __DosFreeMem(__reg("a6") void *, __reg("a1") VOID * dosblock)="\tjsr\t-348(a6)";
#define DosFreeMem(dosblock) __DosFreeMem(ArpBase, (dosblock))

ULONG __BtoCStr(__reg("a6") void *, __reg("a0") STRPTR cstr, __reg("d0") BSTR bstr, __reg("d1") LONG maxlength)="\tjsr\t-354(a6)";
#define BtoCStr(cstr, bstr, maxlength) __BtoCStr(ArpBase, (cstr), (bstr), (maxlength))

ULONG __CtoBStr(__reg("a6") void *, __reg("a0") const STRPTR cstr, __reg("d0") BSTR bstr, __reg("d1") LONG maxlength)="\tjsr\t-360(a6)";
#define CtoBStr(cstr, bstr, maxlength) __CtoBStr(ArpBase, (cstr), (bstr), (maxlength))

struct DeviceList * __GetDevInfo(__reg("a6") void *, __reg("a2") struct DeviceList * devnode)="\tjsr\t-366(a6)";
#define GetDevInfo(devnode) __GetDevInfo(ArpBase, (devnode))

BOOL __FreeTaskResList(__reg("a6") void *)="\tjsr\t-372(a6)";
#define FreeTaskResList() __FreeTaskResList(ArpBase)

VOID __ArpExit(__reg("a6") void *, __reg("d0") LONG rc, __reg("d2") LONG result2)="\tjsr\t-378(a6)";
#define ArpExit(rc, result2) __ArpExit(ArpBase, (rc), (result2))

VOID * __ArpAlloc(__reg("a6") void *, __reg("d0") LONG size)="\tjsr\t-384(a6)";
#define ArpAlloc(size) __ArpAlloc(ArpBase, (size))

VOID * __ArpAllocMem(__reg("a6") void *, __reg("d0") LONG size, __reg("d1") LONG requirements)="\tjsr\t-390(a6)";
#define ArpAllocMem(size, requirements) __ArpAllocMem(ArpBase, (size), (requirements))

BPTR __ArpOpen(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG mode)="\tjsr\t-396(a6)";
#define ArpOpen(name, mode) __ArpOpen(ArpBase, (name), (mode))

BPTR __ArpDupLock(__reg("a6") void *, __reg("d1") BPTR lock)="\tjsr\t-402(a6)";
#define ArpDupLock(lock) __ArpDupLock(ArpBase, (lock))

BPTR __ArpLock(__reg("a6") void *, __reg("d1") const STRPTR name, __reg("d2") LONG mode)="\tjsr\t-408(a6)";
#define ArpLock(name, mode) __ArpLock(ArpBase, (name), (mode))

VOID __RListAlloc(__reg("a6") void *, __reg("a0") struct ResList * reslist, __reg("d0") LONG size)="\tjsr\t-414(a6)";
#define RListAlloc(reslist, size) __RListAlloc(ArpBase, (reslist), (size))

struct Process * __FindCLI(__reg("a6") void *, __reg("d0") LONG clinum)="\tjsr\t-420(a6)";
#define FindCLI(clinum) __FindCLI(ArpBase, (clinum))

BOOL __QSort(__reg("a6") void *, __reg("a0") VOID * base, __reg("d0") LONG rsize, __reg("d1") LONG bsize, __reg("a1") int (*comp)())="\tjsr\t-426(a6)";
#define QSort(base, rsize, bsize, comp) __QSort(ArpBase, (base), (rsize), (bsize), (comp))

BOOL __PatternMatch(__reg("a6") void *, __reg("a0") const STRPTR pattern, __reg("a1") const STRPTR string)="\tjsr\t-432(a6)";
#define PatternMatch(pattern, string) __PatternMatch(ArpBase, (pattern), (string))

LONG __FindFirst(__reg("a6") void *, __reg("d0") const STRPTR pattern, __reg("a0") struct AnchorPath * anchorpath)="\tjsr\t-438(a6)";
#define FindFirst(pattern, anchorpath) __FindFirst(ArpBase, (pattern), (anchorpath))

LONG __FindNext(__reg("a6") void *, __reg("a0") struct AnchorPath * anchorpath)="\tjsr\t-444(a6)";
#define FindNext(anchorpath) __FindNext(ArpBase, (anchorpath))

VOID __FreeAnchorChain(__reg("a6") void *, __reg("a0") struct AnchorPath * anchorpath)="\tjsr\t-450(a6)";
#define FreeAnchorChain(anchorpath) __FreeAnchorChain(ArpBase, (anchorpath))

ULONG __CompareLock(__reg("a6") void *, __reg("d0") BPTR lock1, __reg("d1") BPTR lock2)="\tjsr\t-456(a6)";
#define CompareLock(lock1, lock2) __CompareLock(ArpBase, (lock1), (lock2))

struct ResList * __FindTaskResList(__reg("a6") void *)="\tjsr\t-462(a6)";
#define FindTaskResList() __FindTaskResList(ArpBase)

struct ResList * __CreateTaskResList(__reg("a6") void *)="\tjsr\t-468(a6)";
#define CreateTaskResList() __CreateTaskResList(ArpBase)

VOID __FreeResList(__reg("a6") void *, __reg("a1") struct ResList * freelist)="\tjsr\t-474(a6)";
#define FreeResList(freelist) __FreeResList(ArpBase, (freelist))

VOID __FreeTrackedItem(__reg("a6") void *, __reg("a1") struct DefaultTracker * item)="\tjsr\t-480(a6)";
#define FreeTrackedItem(item) __FreeTrackedItem(ArpBase, (item))

VOID * __GetAccess(__reg("a6") void *, __reg("a1") struct DefaultTracker * tracker)="\tjsr\t-492(a6)";
#define GetAccess(tracker) __GetAccess(ArpBase, (tracker))

VOID __FreeAccess(__reg("a6") void *, __reg("a1") struct DefaultTracker * tracker)="\tjsr\t-498(a6)";
#define FreeAccess(tracker) __FreeAccess(ArpBase, (tracker))

VOID __FreeDAList(__reg("a6") void *, __reg("a1") struct DirectoryEntry * danode)="\tjsr\t-504(a6)";
#define FreeDAList(danode) __FreeDAList(ArpBase, (danode))

struct DirectoryEntry * __AddDANode(__reg("a6") void *, __reg("a0") const STRPTR data, __reg("a1") struct DirectoryEntry ** dalist, __reg("d0") LONG length, __reg("d1") LONG id)="\tjsr\t-510(a6)";
#define AddDANode(data, dalist, length, id) __AddDANode(ArpBase, (data), (dalist), (length), (id))

ULONG __AddDADevs(__reg("a6") void *, __reg("a0") struct DirectoryEntry ** dalist, __reg("d0") LONG select)="\tjsr\t-516(a6)";
#define AddDADevs(dalist, select) __AddDADevs(ArpBase, (dalist), (select))

LONG __Strcmp(__reg("a6") void *, __reg("a0") const STRPTR s1, __reg("a1") const STRPTR s2)="\tjsr\t-522(a6)";
#define Strcmp(s1, s2) __Strcmp(ArpBase, (s1), (s2))

LONG __Strncmp(__reg("a6") void *, __reg("a0") const STRPTR s1, __reg("a1") const STRPTR s2, __reg("d0") LONG count)="\tjsr\t-528(a6)";
#define Strncmp(s1, s2, count) __Strncmp(ArpBase, (s1), (s2), (count))

LONG __SyncRun(__reg("a6") void *, __reg("a0") const  STRPTR name, __reg("a1") const STRPTR command, __reg("d0") BPTR input, __reg("d1") BPTR output)="\tjsr\t-540(a6)";
#define SyncRun(name, command, input, output) __SyncRun(ArpBase, (name), (command), (input), (output))

LONG __ASyncRun(__reg("a6") void *, __reg("a0") const STRPTR name, __reg("a1") const STRPTR command, __reg("a2") struct ProcessControlBlock * pcb)="\tjsr\t-546(a6)";
#define ASyncRun(name, command, pcb) __ASyncRun(ArpBase, (name), (command), (pcb))

#define SpawnShell(name, command, pcb) __ASyncRun(ArpBase, (name), (command), (pcb))

BPTR __LoadPrg(__reg("a6") void *, __reg("d1") const STRPTR name)="\tjsr\t-552(a6)";
#define LoadPrg(name) __LoadPrg(ArpBase, (name))

BOOL __PreParse(__reg("a6") void *, __reg("a0") const STRPTR source, __reg("a1") STRPTR dest)="\tjsr\t-558(a6)";
#define PreParse(source, dest) __PreParse(ArpBase, (source), (dest))

BOOL __StamptoStr(__reg("a6") void *, __reg("a0") struct DateTime * datetime)="\tjsr\t-564(a6)";
#define StamptoStr(datetime) __StamptoStr(ArpBase, (datetime))

BOOL __StrtoStamp(__reg("a6") void *, __reg("a0") struct DateTime * datetime)="\tjsr\t-570(a6)";
#define StrtoStamp(datetime) __StrtoStamp(ArpBase, (datetime))

struct ResidentProgramNode * __ObtainResidentPrg(__reg("a6") void *, __reg("a0") const STRPTR name)="\tjsr\t-576(a6)";
#define ObtainResidentPrg(name) __ObtainResidentPrg(ArpBase, (name))

struct ResidentProgramNode * __AddResidentPrg(__reg("a6") void *, __reg("d1") BPTR segment, __reg("a0") const STRPTR name)="\tjsr\t-582(a6)";
#define AddResidentPrg(segment, name) __AddResidentPrg(ArpBase, (segment), (name))

LONG __RemResidentPrg(__reg("a6") void *, __reg("a0") const STRPTR name)="\tjsr\t-588(a6)";
#define RemResidentPrg(name) __RemResidentPrg(ArpBase, (name))

VOID __UnLoadPrg(__reg("a6") void *, __reg("d1") BPTR segment)="\tjsr\t-594(a6)";
#define UnLoadPrg(segment) __UnLoadPrg(ArpBase, (segment))

LONG __LMult(__reg("a6") void *, __reg("d0") LONG a, __reg("d1") LONG b)="\tjsr\t-600(a6)";
#define LMult(a, b) __LMult(ArpBase, (a), (b))

LONG __LDiv(__reg("a6") void *, __reg("d0") LONG a, __reg("d1") LONG b)="\tjsr\t-606(a6)";
#define LDiv(a, b) __LDiv(ArpBase, (a), (b))

LONG __LMod(__reg("a6") void *, __reg("d0") LONG a, __reg("d1") LONG b)="\tjsr\t-612(a6)";
#define LMod(a, b) __LMod(ArpBase, (a), (b))

ULONG __CheckSumPrg(__reg("a6") void *, __reg("d0") struct ResidentProgramNode * residentnode)="\tjsr\t-618(a6)";
#define CheckSumPrg(residentnode) __CheckSumPrg(ArpBase, (residentnode))

VOID __TackOn(__reg("a6") void *, __reg("a0") const STRPTR pathname, __reg("a1") const STRPTR filename)="\tjsr\t-624(a6)";
#define TackOn(pathname, filename) __TackOn(ArpBase, (pathname), (filename))

BYTE * __BaseName(__reg("a6") void *, __reg("a0") const STRPTR name)="\tjsr\t-630(a6)";
#define BaseName(name) __BaseName(ArpBase, (name))

struct ResidentProgramNode * __ReleaseResidentPrg(__reg("a6") void *, __reg("d1") BPTR segment)="\tjsr\t-636(a6)";
#define ReleaseResidentPrg(segment) __ReleaseResidentPrg(ArpBase, (segment))

LONG __SPrintfA__(__reg("a6") void *, __reg("d0") const STRPTR file, __reg("a0") const STRPTR string, __reg("a1") void * stream)="\tjsr\t-642(a6)";
#define SPrintfA__(file, string, stream) __SPrintfA__(ArpBase, (file), (string), (stream))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __SPrintf(__reg("a6") void *, __reg("d0") const STRPTR file, __reg("a0") const STRPTR string, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-642(a6)\n\tmovea.l\t(a7)+,a1";
#define SPrintf(file, ...) __SPrintf(ArpBase, (file), __VA_ARGS__)
#endif

LONG __GetKeywordIndex(__reg("a6") void *, __reg("a0") const STRPTR keyword, __reg("a1") const STRPTR tmplate)="\tjsr\t-648(a6)";
#define GetKeywordIndex(keyword, tmplate) __GetKeywordIndex(ArpBase, (keyword), (tmplate))

struct Library * __ArpOpenLibrary(__reg("a6") void *, __reg("a1") const STRPTR name, __reg("d0") LONG vers)="\tjsr\t-654(a6)";
#define ArpOpenLibrary(name, vers) __ArpOpenLibrary(ArpBase, (name), (vers))

struct FileRequester * __ArpAllocFreq(__reg("a6") void *)="\tjsr\t-660(a6)";
#define ArpAllocFreq() __ArpAllocFreq(ArpBase)

#endif /*  _VBCCINLINE_ARP_H  */
