#ifndef _PROTO_MISC_H
#define _PROTO_MISC_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_MISC_PROTOS_H) && !defined(__GNUC__)
#include <clib/misc_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *MiscBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/misc.h>
#else
#include <inline/misc.h>
#endif
#elif defined(__VBCC__)
#include <inline/misc_protos.h>
#else
#include <pragma/misc_lib.h>
#endif

#endif	/*  _PROTO_MISC_H  */
