#ifndef _VBCCINLINE_MATHIEEESINGTRANS_H
#define _VBCCINLINE_MATHIEEESINGTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

FLOAT __IEEESPAtan(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-30(a6)";
#define IEEESPAtan(parm) __IEEESPAtan(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPSin(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-36(a6)";
#define IEEESPSin(parm) __IEEESPSin(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPCos(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-42(a6)";
#define IEEESPCos(parm) __IEEESPCos(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPTan(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-48(a6)";
#define IEEESPTan(parm) __IEEESPTan(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPSincos(__reg("a6") void *, __reg("a0") FLOAT * cosptr, __reg("d0") FLOAT parm)="\tjsr\t-54(a6)";
#define IEEESPSincos(cosptr, parm) __IEEESPSincos(MathIeeeSingTransBase, (cosptr), (parm))

FLOAT __IEEESPSinh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-60(a6)";
#define IEEESPSinh(parm) __IEEESPSinh(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPCosh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-66(a6)";
#define IEEESPCosh(parm) __IEEESPCosh(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPTanh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-72(a6)";
#define IEEESPTanh(parm) __IEEESPTanh(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPExp(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-78(a6)";
#define IEEESPExp(parm) __IEEESPExp(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPLog(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-84(a6)";
#define IEEESPLog(parm) __IEEESPLog(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPPow(__reg("a6") void *, __reg("d1") FLOAT exp, __reg("d0") FLOAT arg)="\tjsr\t-90(a6)";
#define IEEESPPow(exp, arg) __IEEESPPow(MathIeeeSingTransBase, (exp), (arg))

FLOAT __IEEESPSqrt(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-96(a6)";
#define IEEESPSqrt(parm) __IEEESPSqrt(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPTieee(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-102(a6)";
#define IEEESPTieee(parm) __IEEESPTieee(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPFieee(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-108(a6)";
#define IEEESPFieee(parm) __IEEESPFieee(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPAsin(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-114(a6)";
#define IEEESPAsin(parm) __IEEESPAsin(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPAcos(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-120(a6)";
#define IEEESPAcos(parm) __IEEESPAcos(MathIeeeSingTransBase, (parm))

FLOAT __IEEESPLog10(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-126(a6)";
#define IEEESPLog10(parm) __IEEESPLog10(MathIeeeSingTransBase, (parm))

#endif /*  _VBCCINLINE_MATHIEEESINGTRANS_H  */
