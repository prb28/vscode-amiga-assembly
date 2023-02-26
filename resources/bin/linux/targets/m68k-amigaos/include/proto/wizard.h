#ifndef _PROTO_WIZARD_H
#define _PROTO_WIZARD_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_WIZARD_PROTOS_H) && !defined(__GNUC__)
#include <clib/wizard_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct Library *WizardBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/wizard.h>
#else
#include <inline/wizard.h>
#endif
#elif defined(__VBCC__)
#include <inline/wizard_protos.h>
#else
#include <pragma/wizard_lib.h>
#endif

#endif	/*  _PROTO_WIZARD_H  */
