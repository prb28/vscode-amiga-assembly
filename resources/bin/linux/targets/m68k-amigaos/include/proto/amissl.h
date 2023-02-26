#ifndef PROTO_AMISSL_H
#define PROTO_AMISSL_H

/***************************************************************************

 AmiSSL - OpenSSL wrapper for AmigaOS-based systems
 Copyright (C) 1999-2006 Andrija Antonijevic, Stefan Burstroem
 Copyright (C) 2006-2017 AmiSSL Open Source Team

 This library is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 3 of the License, or (at your option) any later version.

 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 AmiSSL Official Support Site:  https://github.com/jens-maus/amissl

***************************************************************************/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif
#ifndef AMISSL_AMISSL_H
#include <amissl/amissl.h>
#endif

/****************************************************************************/

#ifndef __NOLIBBASE__
 extern struct Library * AmiSSLBase;
#endif /* __NOLIBBASE__ */

/****************************************************************************/

#ifdef __amigaos4__
 #include <interfaces/amissl.h>
 #ifdef __USE_INLINE__
  #include <inline4/amissl.h>
 #endif /* __USE_INLINE__ */
 #ifndef CLIB_AMISSL_PROTOS_H
  #define CLIB_AMISSL_PROTOS_H 1
 #endif /* CLIB_AMISSL_PROTOS_H */
 #ifndef __NOGLOBALIFACE__
  extern struct AmiSSLIFace *IAmiSSL;
 #endif /* __NOGLOBALIFACE__ */
#else /* __amigaos4__ */
 #ifndef CLIB_AMISSL_PROTOS_H
  #include <clib/amissl_protos.h>
 #endif /* CLIB_AMISSL_PROTOS_H */
 #if defined(__GNUC__)
  #ifdef __AROS__
   #include <defines/amissl.h>
  #else
   #ifndef __PPC__
    #include <inline/amissl.h>
   #else /* __PPC__ */
    #include <ppcinline/amissl.h>
   #endif /* __PPC__ */
  #endif /* __AROS__ */
 #elif defined(__VBCC__)
  #ifndef __PPC__
   #include <inline/amissl_protos.h>
  #endif /* __PPC__ */
 #else /* __GNUC__ */
  #include <pragmas/amissl_pragmas.h>
 #endif /* __GNUC__ */
#endif /* __amigaos4__ */

/****************************************************************************/

#ifndef AMISSL_INLINE_H
#include <amissl/inline.h>
#endif

#endif /* PROTO_AMISSL_H */
