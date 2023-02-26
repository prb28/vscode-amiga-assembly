#ifndef PROTO_AMISSLMASTER_H
#define PROTO_AMISSLMASTER_H

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

/****************************************************************************/

#ifndef __NOLIBBASE__
 #ifndef __USE_BASETYPE__
  extern struct Library * AmiSSLMasterBase;
 #else
  extern struct Library * AmiSSLMasterBase;
 #endif /* __USE_BASETYPE__ */
#endif /* __NOLIBBASE__ */

/****************************************************************************/

#ifdef __amigaos4__
 #include <interfaces/amisslmaster.h>
 #ifdef __USE_INLINE__
  #include <inline4/amisslmaster.h>
 #endif /* __USE_INLINE__ */
 #ifndef CLIB_AMISSLMASTER_PROTOS_H
  #define CLIB_AMISSLMASTER_PROTOS_H 1
 #endif /* CLIB_AMISSLMASTER_PROTOS_H */
 #ifndef __NOGLOBALIFACE__
  extern struct AmiSSLMasterIFace *IAmiSSLMaster;
 #endif /* __NOGLOBALIFACE__ */
#else /* __amigaos4__ */
 #ifndef CLIB_AMISSLMASTER_PROTOS_H
  #include <clib/amisslmaster_protos.h>
 #endif /* CLIB_AMISSLMASTER_PROTOS_H */
 #if defined(__GNUC__)
  #ifdef __AROS__
   #include <defines/amisslmaster.h>
  #else
   #ifndef __PPC__
    #include <inline/amisslmaster.h>
   #else /* __PPC__ */
    #include <ppcinline/amisslmaster.h>
   #endif /* __PPC__ */
  #endif /* __AROS__ */
 #elif defined(__VBCC__)
  #ifndef __PPC__
   #include <inline/amisslmaster_protos.h>
  #endif /* __PPC__ */
 #else /* __GNUC__ */
  #include <pragmas/amisslmaster_pragmas.h>
 #endif /* __GNUC__ */
#endif /* __amigaos4__ */

/****************************************************************************/

#endif /* PROTO_AMISSLMASTER_H */
