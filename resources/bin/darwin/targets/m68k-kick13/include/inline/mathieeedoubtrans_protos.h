#ifndef _VBCCINLINE_MATHIEEEDOUBTRANS_H
#define _VBCCINLINE_MATHIEEEDOUBTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

double __IEEEDPAtan(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-30(a6)";
#define IEEEDPAtan(d0arg) __IEEEDPAtan(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPSin(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-36(a6)";
#define IEEEDPSin(d0arg) __IEEEDPSin(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPCos(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-42(a6)";
#define IEEEDPCos(d0arg) __IEEEDPCos(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPTan(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-48(a6)";
#define IEEEDPTan(d0arg) __IEEEDPTan(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPSincos(__reg("a6") void *, __reg("a0") void * a0arg, __reg("d0/d1") double* pf2)="\tjsr\t-54(a6)";
#define IEEEDPSincos(a0arg, pf2) __IEEEDPSincos(MathIeeeDoubTransBase, (void *)(a0arg), (pf2))

double __IEEEDPSinh(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-60(a6)";
#define IEEEDPSinh(d0arg) __IEEEDPSinh(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPCosh(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-66(a6)";
#define IEEEDPCosh(d0arg) __IEEEDPCosh(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPTanh(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-72(a6)";
#define IEEEDPTanh(d0arg) __IEEEDPTanh(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPExp(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-78(a6)";
#define IEEEDPExp(d0arg) __IEEEDPExp(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPLog(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-84(a6)";
#define IEEEDPLog(d0arg) __IEEEDPLog(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPPow(__reg("a6") void *, __reg("d2/d3") double exp, __reg("d0/d1") double arg)="\tjsr\t-90(a6)";
#define IEEEDPPow(exp, arg) __IEEEDPPow(MathIeeeDoubTransBase, (exp), (arg))

double __IEEEDPSqrt(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-96(a6)";
#define IEEEDPSqrt(d0arg) __IEEEDPSqrt(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPTieee(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-102(a6)";
#define IEEEDPTieee(d0arg) __IEEEDPTieee(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPFieee(__reg("a6") void *, __reg("d0") long single)="\tjsr\t-108(a6)";
#define IEEEDPFieee(single) __IEEEDPFieee(MathIeeeDoubTransBase, (single))

double __IEEEDPAsin(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-114(a6)";
#define IEEEDPAsin(d0arg) __IEEEDPAsin(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPAcos(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-120(a6)";
#define IEEEDPAcos(d0arg) __IEEEDPAcos(MathIeeeDoubTransBase, (d0arg))

double __IEEEDPLog10(__reg("a6") void *, __reg("d0/d1") double d0arg)="\tjsr\t-126(a6)";
#define IEEEDPLog10(d0arg) __IEEEDPLog10(MathIeeeDoubTransBase, (d0arg))

#endif /*  _VBCCINLINE_MATHIEEEDOUBTRANS_H  */
