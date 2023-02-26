#ifndef _PROTO_PALETTE_H
#define _PROTO_PALETTE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_PALETTE_PROTOS_H) && !defined(__GNUC__)
#include <clib/palette_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *PaletteBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/palette.h>
#else
#include <inline/palette.h>
#endif
#elif defined(__VBCC__)
#include <inline/palette_protos.h>
#else
#include <pragma/palette_lib.h>
#endif

#endif	/*  _PROTO_PALETTE_H  */
