#ifndef _PROTO_DTCLASS_H
#define _PROTO_DTCLASS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_DTCLASS_PROTOS_H) && !defined(__GNUC__)
#include <clib/dtclass_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *DTClassBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/dtclass.h>
#else
#include <inline/dtclass.h>
#endif
#elif defined(__VBCC__)
#include <inline/dtclass_protos.h>
#else
#include <pragma/dtclass_lib.h>
#endif

#endif	/*  _PROTO_DTCLASS_H  */
