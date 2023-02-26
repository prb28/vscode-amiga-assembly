#ifndef CLIB_MATHTRANS_PROTOS_H
#define CLIB_MATHTRANS_PROTOS_H


/*
**	$VER: mathtrans_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

FLOAT SPAtan(FLOAT parm);
FLOAT SPSin(FLOAT parm);
FLOAT SPCos(FLOAT parm);
FLOAT SPTan(FLOAT parm);
FLOAT SPSincos(FLOAT * cosResult, FLOAT parm);
FLOAT SPSinh(FLOAT parm);
FLOAT SPCosh(FLOAT parm);
FLOAT SPTanh(FLOAT parm);
FLOAT SPExp(FLOAT parm);
FLOAT SPLog(FLOAT parm);
FLOAT SPPow(FLOAT power, FLOAT arg);
FLOAT SPSqrt(FLOAT parm);
FLOAT SPTieee(FLOAT parm);
FLOAT SPFieee(FLOAT parm);
FLOAT SPAsin(FLOAT parm);
FLOAT SPAcos(FLOAT parm);
FLOAT SPLog10(FLOAT parm);

#endif	/*  CLIB_MATHTRANS_PROTOS_H  */
