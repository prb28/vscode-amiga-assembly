#ifndef _VBCCINLINE_MATHIEEESINGBAS_H
#define _VBCCINLINE_MATHIEEESINGBAS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __IEEESPFix(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-30(a6)";
#define IEEESPFix(parm) __IEEESPFix(MathIeeeSingBasBase, (parm))

FLOAT __IEEESPFlt(__reg("a6") void *, __reg("d0") LONG integer)="\tjsr\t-36(a6)";
#define IEEESPFlt(integer) __IEEESPFlt(MathIeeeSingBasBase, (integer))

LONG __IEEESPCmp(__reg("a6") void *, __reg("d0") FLOAT leftParm, __reg("d1") FLOAT rightParm)="\tjsr\t-42(a6)";
#define IEEESPCmp(leftParm, rightParm) __IEEESPCmp(MathIeeeSingBasBase, (leftParm), (rightParm))

LONG __IEEESPTst(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-48(a6)";
#define IEEESPTst(parm) __IEEESPTst(MathIeeeSingBasBase, (parm))

FLOAT __IEEESPAbs(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-54(a6)";
#define IEEESPAbs(parm) __IEEESPAbs(MathIeeeSingBasBase, (parm))

FLOAT __IEEESPNeg(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-60(a6)";
#define IEEESPNeg(parm) __IEEESPNeg(MathIeeeSingBasBase, (parm))

FLOAT __IEEESPAdd(__reg("a6") void *, __reg("d0") FLOAT leftParm, __reg("d1") FLOAT rightParm)="\tjsr\t-66(a6)";
#define IEEESPAdd(leftParm, rightParm) __IEEESPAdd(MathIeeeSingBasBase, (leftParm), (rightParm))

FLOAT __IEEESPSub(__reg("a6") void *, __reg("d0") FLOAT leftParm, __reg("d1") FLOAT rightParm)="\tjsr\t-72(a6)";
#define IEEESPSub(leftParm, rightParm) __IEEESPSub(MathIeeeSingBasBase, (leftParm), (rightParm))

FLOAT __IEEESPMul(__reg("a6") void *, __reg("d0") FLOAT leftParm, __reg("d1") FLOAT rightParm)="\tjsr\t-78(a6)";
#define IEEESPMul(leftParm, rightParm) __IEEESPMul(MathIeeeSingBasBase, (leftParm), (rightParm))

FLOAT __IEEESPDiv(__reg("a6") void *, __reg("d0") FLOAT dividend, __reg("d1") FLOAT divisor)="\tjsr\t-84(a6)";
#define IEEESPDiv(dividend, divisor) __IEEESPDiv(MathIeeeSingBasBase, (dividend), (divisor))

FLOAT __IEEESPFloor(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-90(a6)";
#define IEEESPFloor(parm) __IEEESPFloor(MathIeeeSingBasBase, (parm))

FLOAT __IEEESPCeil(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-96(a6)";
#define IEEESPCeil(parm) __IEEESPCeil(MathIeeeSingBasBase, (parm))

#endif /*  _VBCCINLINE_MATHIEEESINGBAS_H  */
