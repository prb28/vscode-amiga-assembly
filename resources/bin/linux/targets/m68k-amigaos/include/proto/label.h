#ifndef _PROTO_LABEL_H
#define _PROTO_LABEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_LABEL_PROTOS_H) && !defined(__GNUC__)
#include <clib/label_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *LabelBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/label.h>
#else
#include <inline/label.h>
#endif
#elif defined(__VBCC__)
#include <inline/label_protos.h>
#else
#include <pragma/label_lib.h>
#endif

#endif	/*  _PROTO_LABEL_H  */
