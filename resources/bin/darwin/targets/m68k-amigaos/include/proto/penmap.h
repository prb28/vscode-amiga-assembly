#ifndef _PROTO_PENMAP_H
#define _PROTO_PENMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_PENMAP_PROTOS_H) && !defined(__GNUC__)
#include <clib/penmap_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PenMapBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/penmap.h>
#else
#include <inline/penmap.h>
#endif
#elif defined(__VBCC__)
#include <inline/penmap_protos.h>
#else
#include <pragma/penmap_lib.h>
#endif

#endif	/*  _PROTO_PENMAP_H  */
