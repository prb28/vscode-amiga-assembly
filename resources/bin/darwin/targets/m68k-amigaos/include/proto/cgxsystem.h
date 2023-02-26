#ifndef _PROTO_CGXSYSTEM_H
#define _PROTO_CGXSYSTEM_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_CGXSYSTEM_PROTOS_H) && !defined(__GNUC__)
#include <clib/cgxsystem_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *CGXSystemBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/cgxsystem.h>
#else
#include <inline/cgxsystem.h>
#endif
#elif defined(__VBCC__)
#include <inline/cgxsystem_protos.h>
#else
#include <pragma/cgxsystem_lib.h>
#endif

#endif	/*  _PROTO_CGXSYSTEM_H  */
