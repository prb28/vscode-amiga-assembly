#ifndef _PROTO_POTGO_H
#define _PROTO_POTGO_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_POTGO_PROTOS_H) && !defined(__GNUC__)
#include <clib/potgo_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PotgoBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/potgo.h>
#else
#include <inline/potgo.h>
#endif
#elif defined(__VBCC__)
#include <inline/potgo_protos.h>
#else
#include <pragma/potgo_lib.h>
#endif

#endif	/*  _PROTO_POTGO_H  */
