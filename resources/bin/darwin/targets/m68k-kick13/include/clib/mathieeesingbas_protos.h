/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *MathIeeeSingBasBase;
float IEEESPFix(float);
float IEEESPFlt(long);
long IEEESPCmp(float, float);
long IEEESPTst(float);
float IEEESPAbs(float);
float IEEESPNeg(float);
float IEEESPAdd(float, float);
float IEEESPSub(float, float);
float IEEESPMul(float, float);
float IEEESPDiv(float, float);
