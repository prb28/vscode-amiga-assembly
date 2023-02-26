#ifndef _PROTO_BATTMEM_H
#define _PROTO_BATTMEM_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_BATTMEM_PROTOS_H) && !defined(__GNUC__)
#include <clib/battmem_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *BattMemBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/battmem.h>
#else
#include <inline/battmem.h>
#endif
#elif defined(__VBCC__)
#include <inline/battmem_protos.h>
#else
#include <pragma/battmem_lib.h>
#endif

#endif	/*  _PROTO_BATTMEM_H  */
