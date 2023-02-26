#ifndef _PROTO_LOCALE_H
#define _PROTO_LOCALE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_LOCALE_PROTOS_H) && !defined(__GNUC__)
#include <clib/locale_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct LocaleBase *LocaleBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/locale.h>
#else
#include <inline/locale.h>
#endif
#elif defined(__VBCC__)
#include <inline/locale_protos.h>
#else
#include <pragma/locale_lib.h>
#endif

#endif	/*  _PROTO_LOCALE_H  */
