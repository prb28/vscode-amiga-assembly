#ifndef CLIB_MATHIEEEDOUBBAS_PROTOS_H
#define CLIB_MATHIEEEDOUBBAS_PROTOS_H


/*
**	$VER: mathieeedoubbas_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG IEEEDPFix(DOUBLE parm);
DOUBLE IEEEDPFlt(LONG integer);
LONG IEEEDPCmp(DOUBLE leftParm, DOUBLE rightParm);
LONG IEEEDPTst(DOUBLE parm);
DOUBLE IEEEDPAbs(DOUBLE parm);
DOUBLE IEEEDPNeg(DOUBLE parm);
DOUBLE IEEEDPAdd(DOUBLE leftParm, DOUBLE rightParm);
DOUBLE IEEEDPSub(DOUBLE leftParm, DOUBLE rightParm);
DOUBLE IEEEDPMul(DOUBLE factor1, DOUBLE factor2);
DOUBLE IEEEDPDiv(DOUBLE dividend, DOUBLE divisor);
DOUBLE IEEEDPFloor(DOUBLE parm);
DOUBLE IEEEDPCeil(DOUBLE parm);

#endif	/*  CLIB_MATHIEEEDOUBBAS_PROTOS_H  */
