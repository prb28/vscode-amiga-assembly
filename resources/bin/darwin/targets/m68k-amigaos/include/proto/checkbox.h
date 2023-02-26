#ifndef _PROTO_CHECKBOX_H
#define _PROTO_CHECKBOX_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_CHECKBOX_PROTOS_H) && !defined(__GNUC__)
#include <clib/checkbox_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *CheckBoxBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/checkbox.h>
#else
#include <inline/checkbox.h>
#endif
#elif defined(__VBCC__)
#include <inline/checkbox_protos.h>
#else
#include <pragma/checkbox_lib.h>
#endif

#endif	/*  _PROTO_CHECKBOX_H  */
