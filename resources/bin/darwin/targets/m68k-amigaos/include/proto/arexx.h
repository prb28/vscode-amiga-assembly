#ifndef _PROTO_AREXX_H
#define _PROTO_AREXX_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_AREXX_PROTOS_H) && !defined(__GNUC__)
#include <clib/arexx_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *ARexxBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/arexx.h>
#else
#include <inline/arexx.h>
#endif
#elif defined(__VBCC__)
#include <inline/arexx_protos.h>
#else
#include <pragma/arexx_lib.h>
#endif

#endif	/*  _PROTO_AREXX_H  */
