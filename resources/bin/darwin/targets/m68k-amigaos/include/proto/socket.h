#ifndef _PROTO_SOCKET_H
#define _PROTO_SOCKET_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_SOCKET_PROTOS_H) && !defined(__GNUC__)
#include <clib/socket_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *SocketBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/socket.h>
#else
#include <inline/socket.h>
#endif
#elif defined(__VBCC__)
#include <inline/socket_protos.h>
#else
#include <pragma/socket_lib.h>
#endif

#endif	/*  _PROTO_SOCKET_H  */
