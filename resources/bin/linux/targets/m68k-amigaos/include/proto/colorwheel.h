#ifndef _PROTO_COLORWHEEL_H
#define _PROTO_COLORWHEEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_COLORWHEEL_PROTOS_H) && !defined(__GNUC__)
#include <clib/colorwheel_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *ColorWheelBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/colorwheel.h>
#else
#include <inline/colorwheel.h>
#endif
#elif defined(__VBCC__)
#include <inline/colorwheel_protos.h>
#else
#include <pragma/colorwheel_lib.h>
#endif

#endif	/*  _PROTO_COLORWHEEL_H  */
