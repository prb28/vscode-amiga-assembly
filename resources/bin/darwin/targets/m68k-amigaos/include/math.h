#ifndef __MATH_H
#define __MATH_H 1

#include <float.h>
#include <limits.h>

typedef float  float_t;
typedef double double_t;
#define FLT_EVAL_METHOD 2

/* constants */
#define	M_E        2.7182818284590452354  /* e */
#define	M_LOG2E    1.4426950408889634074  /* log 2e */
#define	M_LOG10E   0.43429448190325182765 /* log 10e */
#define	M_LN2      0.69314718055994530942 /* log e2 */
#define	M_LN10     2.30258509299404568402 /* log e10 */
#define	M_PI       3.14159265358979323846 /* pi */
#define	M_PI_2     1.57079632679489661923 /* pi/2 */
#define	M_PI_4     0.78539816339744830962 /* pi/4 */
#define	M_1_PI     0.31830988618379067154 /* 1/pi */
#define	M_2_PI     0.63661977236758134308 /* 2/pi */
#define	M_2_SQRTPI 1.12837916709551257390 /* 2/sqrt(pi) */
#define	M_SQRT2    1.41421356237309504880 /* sqrt(2) */
#define	M_SQRT1_2  0.70710678118654752440 /* 1/sqrt(2) */

#define MAXFLOAT FLT_MAX

extern const char __pInf_d[];
extern const char __pInf_s[];
extern const char __qNaN_s[];
#define INFINITY  (*(const float *)(const void *)__pInf_s)
#define NAN       (*(const float *)(const void *)__qNaN_s)
#define HUGE_VAL  (*(const double *)(const void *)__pInf_d)
#define HUGE_VALF INFINITY
#define HUGE_VALL (long double)HUGE_VAL

/* return values for fpclassify() */
#define FP_NORMAL    0
#define FP_NAN       1
#define FP_INFINITE  2
#define FP_ZERO      4
#define FP_SUBNORMAL 8

/* errors for ilogb(), ilogbf() and ilogbl() */
#define FP_ILOGB0   LONG_MIN
#define FP_ILOGBNAN LONG_MIN

/* general error handling method */
#define MATH_ERRNO     1
#define MATH_ERREXCEPT 2
#define math_errhandling 0 /* C99 requires but currently unsupported */

/* begin function declarations */
double      acos(double);
double      acosh(double);
double      asin(double);
double      asinh(double);
double      atan(double);
double      atanh(double);
double      atan2(double, double);
double      ceil(double);
double      copysign(double, double);
double      cos(double);
double      cosh(double);
double      exp(double);
double      exp2(double);
double      exp10(double);
double      expm1(double);
double      fabs(double);
double      fdim(double, double);
double      floor(double);
double      fma(double, double, double);
double      fmax(double, double);
double      fmin(double, double);
double      fmod(double, double);
double      frexp(double, int *);
double      hypot(double, double);
double      ldexp(double, int);
double      log(double);
double      log10(double);
double      log1p(double);
double      log2(double);
double      logb(double);
double      modf(double, double *);
double      nan(const char *);
double      nearbyint(double);
double      pow(double, double);
double      remainder(double, double);
double      rint(double);
double      round(double);
double      scalbln(double, long);
double      scalbn(double, int);
double      sin(double);
double      sinh(double);
double      sqrt(double);
double      tan(double);
double      tanh(double);
double      trunc(double);
float       acosf(float);
float       acoshf(float);
float       asinf(float);
float       asinhf(float);
float       atanf(float);
float       atanhf(float);
float       atan2f(float, float);
float       ceilf(float);
float       copysignf(float, float);
float       cosf(float);
float       coshf(float);
float       expf(float);
float       exp2f(float);
float       exp10f(float);
float       expm1f(float);
float       fabsf(float);
float       fdimf(float, float);
float       floorf(float);
float       fmaf(float, float, float);
float       fmaxf(float, float);
float       fminf(float, float);
float       fmodf(float, float);
float       frexpf(float value, int *);
float       hypotf(float, float);
float       ldexpf(float, int);
float       logf(float);
float       log10f(float);
float       log1pf(float);
float       log2f(float);
float       logbf(float);
float       modff(float, float *);
float       nanf(const char *);
float       nearbyintf(float);
float       powf(float, float);
float       remainderf(float, float);
float       rintf(float);
float       roundf(float);
float       scalblnf(float, long);
float       scalbnf(float, int);
float       sinf(float);
float       sinhf(float);
float       sqrtf(float);
float       tanf(float);
float       tanhf(float);
float       truncf(float);
long double acosl(long double);
long double acoshl(long double);
long double asinl(long double);
long double asinhl(long double);
long double atanl(long double);
long double atanhl(long double);
long double atan2l(long double, long double);
long double ceill(long double);
long double copysignl(long double, long double);
long double cosl(long double);
long double coshl(long double);
long double expl(long double);
long double exp2l(long double);
long double exp10l(long double);
long double expm1l(long double);
long double fabsl(long double);
long double fdiml(long double, long double);
long double floorl(long double);
long double fmal(long double, long double, long double);
long double fmaxl(long double, long double);
long double fminl(long double, long double);
long double fmodl(long double, long double);
long double frexpl(long double value, int *);
long double hypotl(long double, long double);
long double ldexpl(long double, int);
long double logl(long double);
long double log10l(long double);
long double log1pl(long double);
long double log2l(long double);
long double logbl(long double);
long double modfl(long double, long double *);
long double nanl(const char *);
long double nearbyintl(long double);
long double powl(long double, long double);
long double remainderl(long double, long double);
long double rintl(long double);
long double roundl(long double);
long double scalblnl(long double, long);
long double scalbnl(long double, int);
long double sinl(long double);
long double sinhl(long double);
long double sqrtl(long double);
long double tanl(long double);
long double tanhl(long double);
long double truncl(long double);
int         ilogb(double);
int         ilogbf(float);
int         ilogbl(long double);
long        lrint(double);
long        lrintf(float);
long        lrintl(long double);
long        lround(double);
long        lroundf(float);
long        lroundl(long double);
#if __STDC_VERSION__ >= 199901L
/* long long not available before c99 */
long long   llround(double);
long long   llroundf(float);
long long   llroundl(long double);
#endif
/* end function declarations */

#if defined(__M68881) || defined(__M68882)
/* direct FPU support */

#if defined(__M68060)
#include <math_060.h>
#elif defined(__M68040)
#include <math_040.h>
#else
#include <math_881.h>
#endif

#else
/* IEEE or software floating-point */

/* begin macros */
int fpclassify(double);
int isfinite(double);
int isinf(double);
int isnan(double);
int isnormal(double);
int signbit(double);
int isgreater(double, double);
int isgreaterequal(double, double);
int isless(double, double);
int islessequal(double, double);
int islessgreater(double, double);
int isunordered(double, double);
/* end macros */

#endif

/* non-C99 macros (used on some operating systems) */
#define fpclassifyf     fpclassify
#define fpclassifyl     fpclassify
#define isfinitef       isfinite
#define isfinitel       isfinite
#define isinff          isinf
#define isinfl          isinf
#define isnanf          isnan
#define isnanl          isnan
#define isnormalf       isnormal
#define isnormall       isnormal
#define signbitf        signbit
#define signbitl        signbit
#define isgreaterf      isgreater
#define isgreaterl      isgreater
#define isgreaterequalf isgreaterequal
#define isgreaterequall isgreaterequal
#define islessf         isless
#define islessl         isless
#define islessequalf    islessequal
#define islessequall    islessequal
#define islessgreaterf  islessgreater
#define islessgreaterl  islessgreater
#define isunorderedf    isunordered
#define isunorderedl    isunordered

/* remainder is the new name for drem */
#define dremf(x) remainderf(x)
#define drem(x)  remainder(x)
#define dreml(x) remainderl(x)
/* rint & lrint causes exceptions but otherwise similar to nearbyint */
#define rintf(x)  nearbyintf(x)
#define rint(x)   nearbyint(x)
#define rintl(x)  nearbyintl(x)
#define lrintf(x) nearbyintf(x)
#define lrint(x)  nearbyint(x)
#define lrintl(x) nearbyintl(x)
/* if (FLT_RADIX==2) */
#define scalbnf(x,y) ldexpf(x,y)
#define scalbn(x,y)  ldexp(x,y)
#define scalbnl(x,y) ldexpl(x,y)
/* if (FLT_RADIX==2 && SIZEOF(int)==4) */
#define scalblnf(x,y) ldexpf(x,y)
#define scalbln(x,y)  ldexp(x,y)
#define scalblnl(x,y) ldexpl(x,y)

/* if (SIZEOF(double long)==8)) */
#define acosl      acos
#define acoshl     acosh
#define asinl      asin
#define asinhl     asinh
#define atanl      atan
#define atanhl     atanh
#define atan2l     atan2
#define ceill      ceil
#define copysignl  copysign
#define cosl       cos
#define coshl      cosh
#define expl       exp
#define exp2l      exp2
#define exp10l     exp10
#define expm1l     expm1
#define fabsl      fabs
#define fdiml      fdim
#define floorl     floor
#define fmal       fma
#define fmaxl      fmax
#define fminl      fmin
#define fmodl      fmod
#define frexpl     frexp
#define hypotl     hypot
#define ldexpl     ldexp
#define logl       log
#define log10l     log10
#define log1pl     log1p
#define log2l      log2
#define logbl      logb
#define modfl      modf
#define nanl       nan
#define nearbyintl nearbyint
#define powl       pow
#define remainderl remainder
#define roundl     round
#define sinl       sin
#define sinhl      sinh
#define sqrtl      sqrt
#define tanl       tan
#define tanhl      tanh
#define truncl     trunc
#define ilogbl     ilogb
#define llroundl   llround
#define lroundl    lround

#endif /* __MATH_H */
