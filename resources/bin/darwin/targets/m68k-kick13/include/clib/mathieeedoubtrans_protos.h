/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *MathIeeeDoubTransBase;
double IEEEDPAtan(double);
double IEEEDPSin(double);
double IEEEDPCos(double);
double IEEEDPTan(double);
double IEEEDPSincos(double, double*);
double IEEEDPSinh(double);
double IEEEDPCosh(double);
double IEEEDPTanh(double);
double IEEEDPExp(double);
double IEEEDPLog(double);
double IEEEDPPow(double, double);
double IEEEDPSqrt(double);
double IEEEDPTieee(double);
double IEEEDPFieee(long);
/*------------------------------------------------*/
/*                                                */
/*      New functions added for Release 1.1       */
/*                                                */
/*------------------------------------------------*/
double IEEEDPAsin(double);
double IEEEDPAcos(double);
double IEEEDPLog10(double);
