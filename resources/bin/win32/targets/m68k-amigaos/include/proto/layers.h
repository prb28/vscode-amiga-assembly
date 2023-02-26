#ifndef _PROTO_LAYERS_H
#define _PROTO_LAYERS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_LAYERS_PROTOS_H) && !defined(__GNUC__)
#include <clib/layers_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *LayersBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/layers.h>
#else
#include <inline/layers.h>
#endif
#elif defined(__VBCC__)
#include <inline/layers_protos.h>
#else
#include <pragma/layers_lib.h>
#endif

#endif	/*  _PROTO_LAYERS_H  */
