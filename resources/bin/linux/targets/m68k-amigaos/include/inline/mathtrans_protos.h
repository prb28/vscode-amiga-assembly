#ifndef _VBCCINLINE_MATHTRANS_H
#define _VBCCINLINE_MATHTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

FLOAT __SPAtan(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-30(a6)";
#define SPAtan(parm) __SPAtan(MathTransBase, (parm))

FLOAT __SPSin(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-36(a6)";
#define SPSin(parm) __SPSin(MathTransBase, (parm))

FLOAT __SPCos(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-42(a6)";
#define SPCos(parm) __SPCos(MathTransBase, (parm))

FLOAT __SPTan(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-48(a6)";
#define SPTan(parm) __SPTan(MathTransBase, (parm))

FLOAT __SPSincos(__reg("a6") void *, __reg("d1") FLOAT * cosResult, __reg("d0") FLOAT parm)="\tjsr\t-54(a6)";
#define SPSincos(cosResult, parm) __SPSincos(MathTransBase, (cosResult), (parm))

FLOAT __SPSinh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-60(a6)";
#define SPSinh(parm) __SPSinh(MathTransBase, (parm))

FLOAT __SPCosh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-66(a6)";
#define SPCosh(parm) __SPCosh(MathTransBase, (parm))

FLOAT __SPTanh(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-72(a6)";
#define SPTanh(parm) __SPTanh(MathTransBase, (parm))

FLOAT __SPExp(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-78(a6)";
#define SPExp(parm) __SPExp(MathTransBase, (parm))

FLOAT __SPLog(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-84(a6)";
#define SPLog(parm) __SPLog(MathTransBase, (parm))

FLOAT __SPPow(__reg("a6") void *, __reg("d1") FLOAT power, __reg("d0") FLOAT arg)="\tjsr\t-90(a6)";
#define SPPow(power, arg) __SPPow(MathTransBase, (power), (arg))

FLOAT __SPSqrt(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-96(a6)";
#define SPSqrt(parm) __SPSqrt(MathTransBase, (parm))

FLOAT __SPTieee(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-102(a6)";
#define SPTieee(parm) __SPTieee(MathTransBase, (parm))

FLOAT __SPFieee(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-108(a6)";
#define SPFieee(parm) __SPFieee(MathTransBase, (parm))

FLOAT __SPAsin(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-114(a6)";
#define SPAsin(parm) __SPAsin(MathTransBase, (parm))

FLOAT __SPAcos(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-120(a6)";
#define SPAcos(parm) __SPAcos(MathTransBase, (parm))

FLOAT __SPLog10(__reg("a6") void *, __reg("d0") FLOAT parm)="\tjsr\t-126(a6)";
#define SPLog10(parm) __SPLog10(MathTransBase, (parm))

#endif /*  _VBCCINLINE_MATHTRANS_H  */
