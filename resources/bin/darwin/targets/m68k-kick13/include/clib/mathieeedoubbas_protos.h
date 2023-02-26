/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *MathIeeeDoubBasBase;
long   IEEEDPFix(double);
double IEEEDPFlt(long);
long   IEEEDPCmp(double, double);
long   IEEEDPTst(double);
double IEEEDPAbs(double);
double IEEEDPNeg(double);
double IEEEDPAdd(double, double);
double IEEEDPSub(double, double);
double IEEEDPMul(double, double);
double IEEEDPDiv(double, double);
/*--------------------------------------------------------------------*/
/*                                                                    */
/*             New functions added for release 1.2                    */
/*                                                                    */
/*--------------------------------------------------------------------*/
double IEEEDPFloor(double);
double IEEEDPCeil(double);
