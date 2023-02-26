#ifndef _VBCCINLINE_MATHTRANS_H
#define _VBCCINLINE_MATHTRANS_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

float __SPAtan(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-30(a6)";
#define SPAtan(d0arg) __SPAtan(MathTransBase, (d0arg))

float __SPSin(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-36(a6)";
#define SPSin(d0arg) __SPSin(MathTransBase, (d0arg))

float __SPCos(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-42(a6)";
#define SPCos(d0arg) __SPCos(MathTransBase, (d0arg))

float __SPTan(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-48(a6)";
#define SPTan(d0arg) __SPTan(MathTransBase, (d0arg))

float __SPSincos(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float* rightFloat)="\tjsr\t-54(a6)";
#define SPSincos(leftFloat, rightFloat) __SPSincos(MathTransBase, (leftFloat), (rightFloat))

float __SPSinh(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-60(a6)";
#define SPSinh(d0arg) __SPSinh(MathTransBase, (d0arg))

float __SPCosh(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-66(a6)";
#define SPCosh(d0arg) __SPCosh(MathTransBase, (d0arg))

float __SPTanh(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-72(a6)";
#define SPTanh(d0arg) __SPTanh(MathTransBase, (d0arg))

float __SPExp(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-78(a6)";
#define SPExp(d0arg) __SPExp(MathTransBase, (d0arg))

float __SPLog(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-84(a6)";
#define SPLog(d0arg) __SPLog(MathTransBase, (d0arg))

float __SPPow(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-90(a6)";
#define SPPow(leftFloat, rightFloat) __SPPow(MathTransBase, (leftFloat), (rightFloat))

float __SPSqrt(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-96(a6)";
#define SPSqrt(d0arg) __SPSqrt(MathTransBase, (d0arg))

float __SPTieee(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-102(a6)";
#define SPTieee(d0arg) __SPTieee(MathTransBase, (d0arg))

float __SPFieee(__reg("a6") void *, __reg("d0") long integer)="\tjsr\t-108(a6)";
#define SPFieee(integer) __SPFieee(MathTransBase, (integer))

float __SPAsin(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-114(a6)";
#define SPAsin(d0arg) __SPAsin(MathTransBase, (d0arg))

float __SPAcos(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-120(a6)";
#define SPAcos(d0arg) __SPAcos(MathTransBase, (d0arg))

float __SPLog10(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-126(a6)";
#define SPLog10(d0arg) __SPLog10(MathTransBase, (d0arg))

#endif /*  _VBCCINLINE_MATHTRANS_H  */
