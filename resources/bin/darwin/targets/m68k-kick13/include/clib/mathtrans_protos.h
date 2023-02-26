/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *MathTransBase;
float SPAtan(float);
float SPSin(float);
float SPCos(float);
float SPTan(float);
float SPSincos(float, float*);
float SPSinh(float);
float SPCosh(float);
float SPTanh(float);
float SPExp(float);
float SPLog(float);
float SPPow(float, float);
float SPSqrt(float);
float SPTieee(float);
float SPFieee(long);
/*------------------------------------------------*/
/*                                                */
/*      New functions added for Release 1.1       */
/*                                                */
/*------------------------------------------------*/
float SPAsin(float);
float SPAcos(float);
float SPLog10(float);
