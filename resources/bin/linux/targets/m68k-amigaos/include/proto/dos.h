#ifndef _PROTO_DOS_H
#define _PROTO_DOS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_DOS_PROTOS_H) && !defined(__GNUC__)
#include <clib/dos_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct DosLibrary *DOSBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/dos.h>
#else
#include <inline/dos.h>
#endif
#elif defined(__VBCC__)
#include <inline/dos_protos.h>
#else
#include <pragma/dos_lib.h>
#endif

#endif	/*  _PROTO_DOS_H  */
