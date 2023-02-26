#ifndef _PROTO_PPC_H
#define _PROTO_PPC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_PPC_PROTOS_H) && !defined(__GNUC__)
#include <clib/ppc_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PPCLibBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/ppc.h>
#else
#include <inline/ppc.h>
#endif
#elif defined(__VBCC__)
#include <inline/ppc_protos.h>
#else
#include <pragma/ppc_lib.h>
#endif

#endif	/*  _PROTO_PPC_H  */
