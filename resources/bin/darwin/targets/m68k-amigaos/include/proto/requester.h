#ifndef _PROTO_REQUESTER_H
#define _PROTO_REQUESTER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_REQUESTER_PROTOS_H) && !defined(__GNUC__)
#include <clib/requester_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *RequesterBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/requester.h>
#else
#include <inline/requester.h>
#endif
#elif defined(__VBCC__)
#include <inline/requester_protos.h>
#else
#include <pragma/requester_lib.h>
#endif

#endif	/*  _PROTO_REQUESTER_H  */
