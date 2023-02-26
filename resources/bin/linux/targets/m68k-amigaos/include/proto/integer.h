#ifndef _PROTO_INTEGER_H
#define _PROTO_INTEGER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_INTEGER_PROTOS_H) && !defined(__GNUC__)
#include <clib/integer_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *IntegerBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/integer.h>
#else
#include <inline/integer.h>
#endif
#elif defined(__VBCC__)
#include <inline/integer_protos.h>
#else
#include <pragma/integer_lib.h>
#endif

#endif	/*  _PROTO_INTEGER_H  */
