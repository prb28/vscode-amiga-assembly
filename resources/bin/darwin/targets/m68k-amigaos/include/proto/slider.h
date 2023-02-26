#ifndef _PROTO_SLIDER_H
#define _PROTO_SLIDER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_SLIDER_PROTOS_H) && !defined(__GNUC__)
#include <clib/slider_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *SliderBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/slider.h>
#else
#include <inline/slider.h>
#endif
#elif defined(__VBCC__)
#include <inline/slider_protos.h>
#else
#include <pragma/slider_lib.h>
#endif

#endif	/*  _PROTO_SLIDER_H  */
