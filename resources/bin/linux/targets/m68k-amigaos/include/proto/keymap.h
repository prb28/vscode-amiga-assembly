#ifndef _PROTO_KEYMAP_H
#define _PROTO_KEYMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_KEYMAP_PROTOS_H) && !defined(__GNUC__)
#include <clib/keymap_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *KeymapBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/keymap.h>
#else
#include <inline/keymap.h>
#endif
#elif defined(__VBCC__)
#include <inline/keymap_protos.h>
#else
#include <pragma/keymap_lib.h>
#endif

#endif	/*  _PROTO_KEYMAP_H  */
