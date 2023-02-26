#ifndef _PROTO_DATEBROWSER_H
#define _PROTO_DATEBROWSER_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_DATEBROWSER_PROTOS_H) && !defined(__GNUC__)
#include <clib/datebrowser_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *DateBrowserBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/datebrowser.h>
#else
#include <inline/datebrowser.h>
#endif
#elif defined(__VBCC__)
#include <inline/datebrowser_protos.h>
#else
#include <pragma/datebrowser_lib.h>
#endif

#endif	/*  _PROTO_DATEBROWSER_H  */
