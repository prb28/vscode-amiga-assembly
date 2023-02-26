#ifndef _PROTO_STRING_H
#define _PROTO_STRING_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_STRING_PROTOS_H) && !defined(__GNUC__)
#include <clib/string_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *StringBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/string.h>
#else
#include <inline/string.h>
#endif
#elif defined(__VBCC__)
#include <inline/string_protos.h>
#else
#include <pragma/string_lib.h>
#endif

#endif	/*  _PROTO_STRING_H  */
