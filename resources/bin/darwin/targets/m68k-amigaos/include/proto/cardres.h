#ifndef _PROTO_CARDRES_H
#define _PROTO_CARDRES_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_CARDRES_PROTOS_H) && !defined(__GNUC__)
#include <clib/cardres_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *CardResource;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/cardres.h>
#else
#include <inline/cardres.h>
#endif
#elif defined(__VBCC__)
#include <inline/cardres_protos.h>
#else
#include <pragma/cardres_lib.h>
#endif

#endif	/*  _PROTO_CARDRES_H  */
