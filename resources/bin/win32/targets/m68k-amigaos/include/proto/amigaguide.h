#ifndef _PROTO_AMIGAGUIDE_H
#define _PROTO_AMIGAGUIDE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_AMIGAGUIDE_PROTOS_H) && !defined(__GNUC__)
#include <clib/amigaguide_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *AmigaGuideBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/amigaguide.h>
#else
#include <inline/amigaguide.h>
#endif
#elif defined(__VBCC__)
#include <inline/amigaguide_protos.h>
#else
#include <pragma/amigaguide_lib.h>
#endif

#endif	/*  _PROTO_AMIGAGUIDE_H  */
