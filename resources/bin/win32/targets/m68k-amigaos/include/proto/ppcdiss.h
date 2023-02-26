#ifndef _PROTO_PPCDISS_H
#define _PROTO_PPCDISS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_PPCDISS_PROTOS_H) && !defined(__GNUC__)
#include <clib/ppcdiss_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PPCDissBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/ppcdiss.h>
#else
#include <inline/ppcdiss.h>
#endif
#elif defined(__VBCC__)
#include <inline/ppcdiss_protos.h>
#else
#include <pragma/ppcdiss_lib.h>
#endif

#endif	/*  _PROTO_PPCDISS_H  */
