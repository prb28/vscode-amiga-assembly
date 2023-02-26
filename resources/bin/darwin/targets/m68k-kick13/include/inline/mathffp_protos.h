#ifndef _VBCCINLINE_MATHFFP_H
#define _VBCCINLINE_MATHFFP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __SPFix(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-30(a6)";
#define SPFix(d0arg) __SPFix(MathBase, (d0arg))

float __SPFlt(__reg("a6") void *, __reg("d0") long integer)="\tjsr\t-36(a6)";
#define SPFlt(integer) __SPFlt(MathBase, (integer))

long __SPCmp(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-42(a6)";
#define SPCmp(leftFloat, rightFloat) __SPCmp(MathBase, (leftFloat), (rightFloat))

long __SPTst(__reg("a6") void *, __reg("d1") float d1arg)="\tjsr\t-48(a6)";
#define SPTst(d1arg) __SPTst(MathBase, (d1arg))

float __SPAbs(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-54(a6)";
#define SPAbs(d0arg) __SPAbs(MathBase, (d0arg))

float __SPNeg(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-60(a6)";
#define SPNeg(d0arg) __SPNeg(MathBase, (d0arg))

float __SPAdd(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-66(a6)";
#define SPAdd(leftFloat, rightFloat) __SPAdd(MathBase, (leftFloat), (rightFloat))

float __SPSub(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-72(a6)";
#define SPSub(leftFloat, rightFloat) __SPSub(MathBase, (leftFloat), (rightFloat))

float __SPMul(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-78(a6)";
#define SPMul(leftFloat, rightFloat) __SPMul(MathBase, (leftFloat), (rightFloat))

float __SPDiv(__reg("a6") void *, __reg("d1") float leftFloat, __reg("d0") float rightFloat)="\tjsr\t-84(a6)";
#define SPDiv(leftFloat, rightFloat) __SPDiv(MathBase, (leftFloat), (rightFloat))

float __SPFloor(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-90(a6)";
#define SPFloor(d0arg) __SPFloor(MathBase, (d0arg))

float __SPCeil(__reg("a6") void *, __reg("d0") float d0arg)="\tjsr\t-96(a6)";
#define SPCeil(d0arg) __SPCeil(MathBase, (d0arg))

#endif /*  _VBCCINLINE_MATHFFP_H  */
