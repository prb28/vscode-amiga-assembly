#ifndef _PROTO_MATHTRANS_H
#define _PROTO_MATHTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_MATHTRANS_PROTOS_H) && !defined(__GNUC__)
#include <clib/mathtrans_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *MathTransBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/mathtrans.h>
#else
#include <inline/mathtrans.h>
#endif
#elif defined(__VBCC__)
#include <inline/mathtrans_protos.h>
#else
#include <pragma/mathtrans_lib.h>
#endif

#endif	/*  _PROTO_MATHTRANS_H  */
