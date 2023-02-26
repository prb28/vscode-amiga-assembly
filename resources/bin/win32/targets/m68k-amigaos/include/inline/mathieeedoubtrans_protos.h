#ifndef _VBCCINLINE_MATHIEEEDOUBTRANS_H
#define _VBCCINLINE_MATHIEEEDOUBTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

DOUBLE __IEEEDPAtan(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-30(a6)";
#define IEEEDPAtan(parm) __IEEEDPAtan(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPSin(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-36(a6)";
#define IEEEDPSin(parm) __IEEEDPSin(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPCos(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-42(a6)";
#define IEEEDPCos(parm) __IEEEDPCos(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPTan(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-48(a6)";
#define IEEEDPTan(parm) __IEEEDPTan(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPSincos(__reg("a6") void *, __reg("a0") DOUBLE * pf2, __reg("d0/d1") DOUBLE parm)="\tjsr\t-54(a6)";
#define IEEEDPSincos(pf2, parm) __IEEEDPSincos(MathIeeeDoubTransBase, (pf2), (parm))

DOUBLE __IEEEDPSinh(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-60(a6)";
#define IEEEDPSinh(parm) __IEEEDPSinh(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPCosh(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-66(a6)";
#define IEEEDPCosh(parm) __IEEEDPCosh(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPTanh(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-72(a6)";
#define IEEEDPTanh(parm) __IEEEDPTanh(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPExp(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-78(a6)";
#define IEEEDPExp(parm) __IEEEDPExp(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPLog(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-84(a6)";
#define IEEEDPLog(parm) __IEEEDPLog(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPPow(__reg("a6") void *, __reg("d2/d3") DOUBLE exp, __reg("d0/d1") DOUBLE arg)="\tjsr\t-90(a6)";
#define IEEEDPPow(exp, arg) __IEEEDPPow(MathIeeeDoubTransBase, (exp), (arg))

DOUBLE __IEEEDPSqrt(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-96(a6)";
#define IEEEDPSqrt(parm) __IEEEDPSqrt(MathIeeeDoubTransBase, (parm))

FLOAT __IEEEDPTieee(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-102(a6)";
#define IEEEDPTieee(parm) __IEEEDPTieee(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPFieee(__reg("a6") void *, __reg("d0") FLOAT single)="\tjsr\t-108(a6)";
#define IEEEDPFieee(single) __IEEEDPFieee(MathIeeeDoubTransBase, (single))

DOUBLE __IEEEDPAsin(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-114(a6)";
#define IEEEDPAsin(parm) __IEEEDPAsin(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPAcos(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-120(a6)";
#define IEEEDPAcos(parm) __IEEEDPAcos(MathIeeeDoubTransBase, (parm))

DOUBLE __IEEEDPLog10(__reg("a6") void *, __reg("d0/d1") DOUBLE parm)="\tjsr\t-126(a6)";
#define IEEEDPLog10(parm) __IEEEDPLog10(MathIeeeDoubTransBase, (parm))

#endif /*  _VBCCINLINE_MATHIEEEDOUBTRANS_H  */
