#ifndef _PROTO_BATTCLOCK_H
#define _PROTO_BATTCLOCK_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_BATTCLOCK_PROTOS_H) && !defined(__GNUC__)
#include <clib/battclock_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *BattClockBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/battclock.h>
#else
#include <inline/battclock.h>
#endif
#elif defined(__VBCC__)
#include <inline/battclock_protos.h>
#else
#include <pragma/battclock_lib.h>
#endif

#endif	/*  _PROTO_BATTCLOCK_H  */
