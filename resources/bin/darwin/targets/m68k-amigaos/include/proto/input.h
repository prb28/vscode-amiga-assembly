#ifndef _PROTO_INPUT_H
#define _PROTO_INPUT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_INPUT_PROTOS_H) && !defined(__GNUC__)
#include <clib/input_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *InputBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/input.h>
#else
#include <inline/input.h>
#endif
#elif defined(__VBCC__)
#include <inline/input_protos.h>
#else
#include <pragma/input_lib.h>
#endif

#endif	/*  _PROTO_INPUT_H  */
