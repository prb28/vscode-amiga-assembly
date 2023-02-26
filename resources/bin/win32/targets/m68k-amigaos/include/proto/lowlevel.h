#ifndef _PROTO_LOWLEVEL_H
#define _PROTO_LOWLEVEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_LOWLEVEL_PROTOS_H) && !defined(__GNUC__)
#include <clib/lowlevel_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *LowLevelBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/lowlevel.h>
#else
#include <inline/lowlevel.h>
#endif
#elif defined(__VBCC__)
#include <inline/lowlevel_protos.h>
#else
#include <pragma/lowlevel_lib.h>
#endif

#endif	/*  _PROTO_LOWLEVEL_H  */
