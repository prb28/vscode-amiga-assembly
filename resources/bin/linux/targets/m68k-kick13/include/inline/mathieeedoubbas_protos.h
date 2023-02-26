#ifndef _VBCCINLINE_MATHIEEEDOUBBAS_H
#define _VBCCINLINE_MATHIEEEDOUBBAS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __IEEEDPFix(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-30(a6)";
#define IEEEDPFix(parm) __IEEEDPFix(MathIeeeDoubBasBase, (parm))

DOUBLE __IEEEDPFlt(__reg("a6") void *, __reg("d0") LONG integer)="\tjsr\t-36(a6)";
#define IEEEDPFlt(integer) __IEEEDPFlt(MathIeeeDoubBasBase, (integer))

LONG __IEEEDPCmp(__reg("a6") void *, __reg("d0/d1") DOUBLE leftParm, __reg("d2/d3") DOUBLE rightParm)="\tjsr\t-42(a6)";
#define IEEEDPCmp(leftParm, rightParm) __IEEEDPCmp(MathIeeeDoubBasBase, (leftParm), (rightParm))

LONG __IEEEDPTst(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-48(a6)";
#define IEEEDPTst(parm) __IEEEDPTst(MathIeeeDoubBasBase, (parm))

DOUBLE __IEEEDPAbs(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-54(a6)";
#define IEEEDPAbs(parm) __IEEEDPAbs(MathIeeeDoubBasBase, (parm))

DOUBLE __IEEEDPNeg(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-60(a6)";
#define IEEEDPNeg(parm) __IEEEDPNeg(MathIeeeDoubBasBase, (parm))

DOUBLE __IEEEDPAdd(__reg("a6") void *, __reg("d0/d1") DOUBLE leftParm, __reg("d2/d3") DOUBLE rightParm)="\tjsr\t-66(a6)";
#define IEEEDPAdd(leftParm, rightParm) __IEEEDPAdd(MathIeeeDoubBasBase, (leftParm), (rightParm))

DOUBLE __IEEEDPSub(__reg("a6") void *, __reg("d0/d1") DOUBLE leftParm, __reg("d2/d3") DOUBLE rightParm)="\tjsr\t-72(a6)";
#define IEEEDPSub(leftParm, rightParm) __IEEEDPSub(MathIeeeDoubBasBase, (leftParm), (rightParm))

DOUBLE __IEEEDPMul(__reg("a6") void *, __reg("d0/d1") DOUBLE factor1, __reg("d2/d3") DOUBLE factor2)="\tjsr\t-78(a6)";
#define IEEEDPMul(factor1, factor2) __IEEEDPMul(MathIeeeDoubBasBase, (factor1), (factor2))

DOUBLE __IEEEDPDiv(__reg("a6") void *, __reg("d0/d1") DOUBLE dividend, __reg("d2/d3") DOUBLE divisor)="\tjsr\t-84(a6)";
#define IEEEDPDiv(dividend, divisor) __IEEEDPDiv(MathIeeeDoubBasBase, (dividend), (divisor))

DOUBLE __IEEEDPFloor(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-90(a6)";
#define IEEEDPFloor(parm) __IEEEDPFloor(MathIeeeDoubBasBase, (parm))

DOUBLE __IEEEDPCeil(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-96(a6)";
#define IEEEDPCeil(parm) __IEEEDPCeil(MathIeeeDoubBasBase, (parm))

#endif /*  _VBCCINLINE_MATHIEEEDOUBBAS_H  */
