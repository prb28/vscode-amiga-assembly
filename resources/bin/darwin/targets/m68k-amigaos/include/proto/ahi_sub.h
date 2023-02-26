#ifndef _PROTO_AHI_SUB_H
#define _PROTO_AHI_SUB_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_AHI_SUB_PROTOS_H) && !defined(__GNUC__)
#include <clib/ahi_sub_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *AHIsubBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/ahi_sub.h>
#else
#include <inline/ahi_sub.h>
#endif
#elif defined(__VBCC__)
#include <inline/ahi_sub_protos.h>
#else
#include <pragma/ahi_sub_lib.h>
#endif

#endif	/*  _PROTO_AHI_SUB_H  */
