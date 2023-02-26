#ifndef _PROTO_SPEEDBAR_H
#define _PROTO_SPEEDBAR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_SPEEDBAR_PROTOS_H) && !defined(__GNUC__)
#include <clib/speedbar_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *SpeedBarBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/speedbar.h>
#else
#include <inline/speedbar.h>
#endif
#elif defined(__VBCC__)
#include <inline/speedbar_protos.h>
#else
#include <pragma/speedbar_lib.h>
#endif

#endif	/*  _PROTO_SPEEDBAR_H  */
