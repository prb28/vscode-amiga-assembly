#ifndef _PROTO_BULLET_H
#define _PROTO_BULLET_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_BULLET_PROTOS_H) && !defined(__GNUC__)
#include <clib/bullet_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *BulletBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/bullet.h>
#else
#include <inline/bullet.h>
#endif
#elif defined(__VBCC__)
#include <inline/bullet_protos.h>
#else
#include <pragma/bullet_lib.h>
#endif

#endif	/*  _PROTO_BULLET_H  */
