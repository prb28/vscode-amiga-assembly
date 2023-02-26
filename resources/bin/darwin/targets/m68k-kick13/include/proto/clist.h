#ifndef _PROTO_CLIST_H
#define _PROTO_CLIST_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_CLIST_PROTOS_H) && !defined(__GNUC__)
#include <clib/clist_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *ClistBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/clist.h>
#else
#include <inline/clist.h>
#endif
#elif defined(__VBCC__)
#include <inline/clist_protos.h>
#else
#include <pragma/clist_lib.h>
#endif

#endif	/*  _PROTO_CLIST_H  */
