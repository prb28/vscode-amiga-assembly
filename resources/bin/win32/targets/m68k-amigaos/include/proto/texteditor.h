#ifndef _PROTO_TEXTEDITOR_H
#define _PROTO_TEXTEDITOR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_TEXTEDITOR_PROTOS_H) && !defined(__GNUC__)
#include <clib/texteditor_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *TextFieldBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/texteditor.h>
#else
#include <inline/texteditor.h>
#endif
#elif defined(__VBCC__)
#include <inline/texteditor_protos.h>
#else
#include <pragma/texteditor_lib.h>
#endif

#endif	/*  _PROTO_TEXTEDITOR_H  */
