#ifndef _PROTO_GETFILE_H
#define _PROTO_GETFILE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_GETFILE_PROTOS_H) && !defined(__GNUC__)
#include <clib/getfile_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *GetFileBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/getfile.h>
#else
#include <inline/getfile.h>
#endif
#elif defined(__VBCC__)
#include <inline/getfile_protos.h>
#else
#include <pragma/getfile_lib.h>
#endif

#endif	/*  _PROTO_GETFILE_H  */
