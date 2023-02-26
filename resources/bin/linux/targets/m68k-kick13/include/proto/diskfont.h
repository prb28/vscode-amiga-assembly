#ifndef _PROTO_DISKFONT_H
#define _PROTO_DISKFONT_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_DISKFONT_PROTOS_H) && !defined(__GNUC__)
#include <clib/diskfont_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *DiskfontBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/diskfont.h>
#else
#include <inline/diskfont.h>
#endif
#elif defined(__VBCC__)
#include <inline/diskfont_protos.h>
#else
#include <pragma/diskfont_lib.h>
#endif

#endif	/*  _PROTO_DISKFONT_H  */
