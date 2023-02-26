#ifndef _PROTO_IFFPARSE_H
#define _PROTO_IFFPARSE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_IFFPARSE_PROTOS_H) && !defined(__GNUC__)
#include <clib/iffparse_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *IFFParseBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/iffparse.h>
#else
#include <inline/iffparse.h>
#endif
#elif defined(__VBCC__)
#include <inline/iffparse_protos.h>
#else
#include <pragma/iffparse_lib.h>
#endif

#endif	/*  _PROTO_IFFPARSE_H  */
