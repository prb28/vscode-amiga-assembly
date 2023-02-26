#ifndef CLIB_MATHIEEEDOUBTRANS_PROTOS_H
#define CLIB_MATHIEEEDOUBTRANS_PROTOS_H


/*
**	$VER: mathieeedoubtrans_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

DOUBLE IEEEDPAtan(DOUBLE parm);
DOUBLE IEEEDPSin(DOUBLE parm);
DOUBLE IEEEDPCos(DOUBLE parm);
DOUBLE IEEEDPTan(DOUBLE parm);
DOUBLE IEEEDPSincos(DOUBLE * pf2, DOUBLE parm);
DOUBLE IEEEDPSinh(DOUBLE parm);
DOUBLE IEEEDPCosh(DOUBLE parm);
DOUBLE IEEEDPTanh(DOUBLE parm);
DOUBLE IEEEDPExp(DOUBLE parm);
DOUBLE IEEEDPLog(DOUBLE parm);
DOUBLE IEEEDPPow(DOUBLE exp, DOUBLE arg);
DOUBLE IEEEDPSqrt(DOUBLE parm);
FLOAT IEEEDPTieee(DOUBLE parm);
DOUBLE IEEEDPFieee(FLOAT single);
DOUBLE IEEEDPAsin(DOUBLE parm);
DOUBLE IEEEDPAcos(DOUBLE parm);
DOUBLE IEEEDPLog10(DOUBLE parm);

#endif	/*  CLIB_MATHIEEEDOUBTRANS_PROTOS_H  */
