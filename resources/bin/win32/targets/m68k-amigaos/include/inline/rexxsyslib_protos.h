#ifndef _VBCCINLINE_REXXSYSLIB_H
#define _VBCCINLINE_REXXSYSLIB_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

UBYTE * __CreateArgstring(__reg("a6") void *, __reg("a0") CONST STRPTR string, __reg("d0") ULONG length)="\tjsr\t-126(a6)";
#define CreateArgstring(string, length) __CreateArgstring(RexxSysBase, (string), (length))

VOID __DeleteArgstring(__reg("a6") void *, __reg("a0") UBYTE * argstring)="\tjsr\t-132(a6)";
#define DeleteArgstring(argstring) __DeleteArgstring(RexxSysBase, (argstring))

ULONG __LengthArgstring(__reg("a6") void *, __reg("a0") CONST UBYTE * argstring)="\tjsr\t-138(a6)";
#define LengthArgstring(argstring) __LengthArgstring(RexxSysBase, (argstring))

struct RexxMsg * __CreateRexxMsg(__reg("a6") void *, __reg("a0") CONST struct MsgPort * port, __reg("a1") CONST_STRPTR extension, __reg("d0") CONST_STRPTR host)="\tjsr\t-144(a6)";
#define CreateRexxMsg(port, extension, host) __CreateRexxMsg(RexxSysBase, (port), (extension), (host))

VOID __DeleteRexxMsg(__reg("a6") void *, __reg("a0") struct RexxMsg * packet)="\tjsr\t-150(a6)";
#define DeleteRexxMsg(packet) __DeleteRexxMsg(RexxSysBase, (packet))

VOID __ClearRexxMsg(__reg("a6") void *, __reg("a0") struct RexxMsg * msgptr, __reg("d0") ULONG count)="\tjsr\t-156(a6)";
#define ClearRexxMsg(msgptr, count) __ClearRexxMsg(RexxSysBase, (msgptr), (count))

BOOL __FillRexxMsg(__reg("a6") void *, __reg("a0") struct RexxMsg * msgptr, __reg("d0") ULONG count, __reg("d1") ULONG mask)="\tjsr\t-162(a6)";
#define FillRexxMsg(msgptr, count, mask) __FillRexxMsg(RexxSysBase, (msgptr), (count), (mask))

BOOL __IsRexxMsg(__reg("a6") void *, __reg("a0") CONST struct RexxMsg * msgptr)="\tjsr\t-168(a6)";
#define IsRexxMsg(msgptr) __IsRexxMsg(RexxSysBase, (msgptr))

VOID __LockRexxBase(__reg("a6") void *, __reg("d0") ULONG resource)="\tjsr\t-450(a6)";
#define LockRexxBase(resource) __LockRexxBase(RexxSysBase, (resource))

VOID __UnlockRexxBase(__reg("a6") void *, __reg("d0") ULONG resource)="\tjsr\t-456(a6)";
#define UnlockRexxBase(resource) __UnlockRexxBase(RexxSysBase, (resource))

#endif /*  _VBCCINLINE_REXXSYSLIB_H  */
