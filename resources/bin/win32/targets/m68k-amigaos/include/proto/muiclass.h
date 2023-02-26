#ifndef _PROTO_MUICLASS_H
#define _PROTO_MUICLASS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_MUICLASS_PROTOS_H) && !defined(__GNUC__)
#include <clib/muiclass_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *MUIClassBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/muiclass.h>
#else
#include <inline/muiclass.h>
#endif
#elif defined(__VBCC__)
#include <inline/muiclass_protos.h>
#else
#include <pragma/muiclass_lib.h>
#endif

#endif	/*  _PROTO_MUICLASS_H  */
