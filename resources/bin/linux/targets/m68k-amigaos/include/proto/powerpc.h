#ifndef _PROTO_POWERPC_H
#define _PROTO_POWERPC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_POWERPC_PROTOS_H) && !defined(__GNUC__)
#include <clib/powerpc_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct PPCBase *PowerPCBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/powerpc.h>
#else
#include <inline/powerpc.h>
#endif
#elif defined(__VBCC__)
#include <inline/powerpc_protos.h>
#else
#include <pragma/powerpc_lib.h>
#endif

#endif	/*  _PROTO_POWERPC_H  */
