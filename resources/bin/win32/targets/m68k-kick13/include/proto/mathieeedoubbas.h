#ifndef _PROTO_MATHIEEEDOUBBAS_H
#define _PROTO_MATHIEEEDOUBBAS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_MATHIEEEDOUBBAS_PROTOS_H) && !defined(__GNUC__)
#include <clib/mathieeedoubbas_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct MathIEEEBase *MathIeeeDoubBasBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/mathieeedoubbas.h>
#else
#include <inline/mathieeedoubbas.h>
#endif
#elif defined(__VBCC__)
#include <inline/mathieeedoubbas_protos.h>
#else
#include <pragma/mathieeedoubbas_lib.h>
#endif

#endif	/*  _PROTO_MATHIEEEDOUBBAS_H  */
