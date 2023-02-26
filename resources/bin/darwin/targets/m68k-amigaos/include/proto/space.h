#ifndef _PROTO_SPACE_H
#define _PROTO_SPACE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_SPACE_PROTOS_H) && !defined(__GNUC__)
#include <clib/space_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *SpaceBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/space.h>
#else
#include <inline/space.h>
#endif
#elif defined(__VBCC__)
#include <inline/space_protos.h>
#else
#include <pragma/space_lib.h>
#endif

#endif	/*  _PROTO_SPACE_H  */
