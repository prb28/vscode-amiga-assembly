#ifndef _PROTO_POPCYCLE_H
#define _PROTO_POPCYCLE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_POPCYCLE_PROTOS_H) && !defined(__GNUC__)
#include <clib/popcycle_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PopCycleBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/popcycle.h>
#else
#include <inline/popcycle.h>
#endif
#elif defined(__VBCC__)
#include <inline/popcycle_protos.h>
#else
#include <pragma/popcycle_lib.h>
#endif

#endif	/*  _PROTO_POPCYCLE_H  */
