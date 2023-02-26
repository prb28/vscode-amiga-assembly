#ifndef _PROTO_AML_H
#define _PROTO_AML_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_AML_PROTOS_H) && !defined(__GNUC__)
#include <clib/aml_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *AmlBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/aml.h>
#else
#include <inline/aml.h>
#endif
#elif defined(__VBCC__)
#include <inline/aml_protos.h>
#else
#include <pragma/aml_lib.h>
#endif

#endif	/*  _PROTO_AML_H  */
