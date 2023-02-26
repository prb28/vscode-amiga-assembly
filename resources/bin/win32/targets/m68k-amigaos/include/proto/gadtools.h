#ifndef _PROTO_GADTOOLS_H
#define _PROTO_GADTOOLS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_GADTOOLS_PROTOS_H) && !defined(__GNUC__)
#include <clib/gadtools_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *GadToolsBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/gadtools.h>
#else
#include <inline/gadtools.h>
#endif
#elif defined(__VBCC__)
#include <inline/gadtools_protos.h>
#else
#include <pragma/gadtools_lib.h>
#endif

#endif	/*  _PROTO_GADTOOLS_H  */
