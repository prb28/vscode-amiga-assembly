#ifndef _PROTO_EXPANSION_H
#define _PROTO_EXPANSION_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_EXPANSION_PROTOS_H) && !defined(__GNUC__)
#include <clib/expansion_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct ExpansionBase *ExpansionBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/expansion.h>
#else
#include <inline/expansion.h>
#endif
#elif defined(__VBCC__)
#include <inline/expansion_protos.h>
#else
#include <pragma/expansion_lib.h>
#endif

#endif	/*  _PROTO_EXPANSION_H  */
