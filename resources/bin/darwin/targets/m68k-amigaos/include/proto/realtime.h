#ifndef _PROTO_REALTIME_H
#define _PROTO_REALTIME_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_REALTIME_PROTOS_H) && !defined(__GNUC__)
#include <clib/realtime_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct RealTimeBase *RealTimeBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/realtime.h>
#else
#include <inline/realtime.h>
#endif
#elif defined(__VBCC__)
#include <inline/realtime_protos.h>
#else
#include <pragma/realtime_lib.h>
#endif

#endif	/*  _PROTO_REALTIME_H  */
