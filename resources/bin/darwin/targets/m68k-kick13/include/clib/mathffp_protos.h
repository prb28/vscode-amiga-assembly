/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *MathBase;
long  SPFix(float);
float SPFlt(long);
long  SPCmp(float, float);
long  SPTst(float);
float SPAbs(float);
float SPNeg(float);
float SPAdd(float, float);
float SPSub(float, float);
float SPMul(float, float);
float SPDiv(float, float);
/*----------------------------------------------------------*/
/*                                                          */
/*          New functions added for release 1.2             */
/*                                                          */
/*----------------------------------------------------------*/
float SPFloor(float);
float SPCeil(float);
