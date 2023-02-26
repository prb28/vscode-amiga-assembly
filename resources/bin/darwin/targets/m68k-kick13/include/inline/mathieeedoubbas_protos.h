#ifndef _VBCCINLINE_MATHIEEEDOUBBAS_H
#define _VBCCINLINE_MATHIEEEDOUBBAS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __IEEEDPFix(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-30(a6)";
#define IEEEDPFix(d0arg) __IEEEDPFix(MathIeeeDoubBasBase, (d0arg))

double __IEEEDPFlt(__reg("a6") void *, __reg("d0") long integer)="\tjsr\t-36(a6)";
#define IEEEDPFlt(integer) __IEEEDPFlt(MathIeeeDoubBasBase, (integer))

long __IEEEDPCmp(__reg("a6") void *, __reg("d0/d1") double d0arg, __reg("d2/d3") double d1arg)="\tjsr\t-42(a6)";
#define IEEEDPCmp(d0arg, d1arg) __IEEEDPCmp(MathIeeeDoubBasBase, (d0arg), (d1arg))

long __IEEEDPTst(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-48(a6)";
#define IEEEDPTst(d0arg) __IEEEDPTst(MathIeeeDoubBasBase, (d0arg))

double __IEEEDPAbs(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-54(a6)";
#define IEEEDPAbs(d0arg) __IEEEDPAbs(MathIeeeDoubBasBase, (d0arg))

double __IEEEDPNeg(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-60(a6)";
#define IEEEDPNeg(d0arg) __IEEEDPNeg(MathIeeeDoubBasBase, (d0arg))

double __IEEEDPAdd(__reg("a6") void *, __reg("d0/d1") double d0arg, __reg("d2/d3") double d1arg)="\tjsr\t-66(a6)";
#define IEEEDPAdd(d0arg, d1arg) __IEEEDPAdd(MathIeeeDoubBasBase, (d0arg), (d1arg))

double __IEEEDPSub(__reg("a6") void *, __reg("d0/d1") double d0arg, __reg("d2/d3") double d1arg)="\tjsr\t-72(a6)";
#define IEEEDPSub(d0arg, d1arg) __IEEEDPSub(MathIeeeDoubBasBase, (d0arg), (d1arg))

double __IEEEDPMul(__reg("a6") void *, __reg("d0/d1") double d0arg, __reg("d2/d3") double d1arg)="\tjsr\t-78(a6)";
#define IEEEDPMul(d0arg, d1arg) __IEEEDPMul(MathIeeeDoubBasBase, (d0arg), (d1arg))

double __IEEEDPDiv(__reg("a6") void *, __reg("d0/d1") double d0arg, __reg("d2/d3") double d1arg)="\tjsr\t-84(a6)";
#define IEEEDPDiv(d0arg, d1arg) __IEEEDPDiv(MathIeeeDoubBasBase, (d0arg), (d1arg))

double __IEEEDPFloor(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-90(a6)";
#define IEEEDPFloor(d0arg) __IEEEDPFloor(MathIeeeDoubBasBase, (d0arg))

double __IEEEDPCeil(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-96(a6)";
#define IEEEDPCeil(d0arg) __IEEEDPCeil(MathIeeeDoubBasBase, (d0arg))

#endif /*  _VBCCINLINE_MATHIEEEDOUBBAS_H  */
