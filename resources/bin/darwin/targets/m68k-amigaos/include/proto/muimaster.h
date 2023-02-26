#ifndef _PROTO_MUIMASTER_H
#define _PROTO_MUIMASTER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_MUIMASTER_PROTOS_H) && !defined(__GNUC__)
#include <clib/muimaster_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *MUIMasterBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/muimaster.h>
#else
#include <inline/muimaster.h>
#endif
#elif defined(__VBCC__)
#include <inline/muimaster_protos.h>
#else
#include <pragma/muimaster_lib.h>
#endif

#endif	/*  _PROTO_MUIMASTER_H  */
