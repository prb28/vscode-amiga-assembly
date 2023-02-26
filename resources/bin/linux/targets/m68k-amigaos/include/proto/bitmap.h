#ifndef _PROTO_BITMAP_H
#define _PROTO_BITMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_BITMAP_PROTOS_H) && !defined(__GNUC__)
#include <clib/bitmap_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *BitMapBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/bitmap.h>
#else
#include <inline/bitmap.h>
#endif
#elif defined(__VBCC__)
#include <inline/bitmap_protos.h>
#else
#include <pragma/bitmap_lib.h>
#endif

#endif	/*  _PROTO_BITMAP_H  */
