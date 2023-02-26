/* $VER: math_881.h 1.0 (06.04.2017)
** math.h 6888x specific support, link with -lm881
*/

/* macros */
int fpclassify(__reg("fp0")double) =
        "\tinline\n"
        "\tftst.x\tfp0\n"
        "\tmoveq\t#7,d1\n"
        "\tfmove.l\tfpsr,d0\n"
        "\trol.l\t#8,d0\n"
        "\tand.l\td1,d0\n"
        "\teinline";
int isfinite(__reg("fp0")double) =
        "\tinline\n"
        "\tftst.x\tfp0\n"
        "\tfmove.l\tfpsr,d0\n"
        "\tand.l\t#$03000000,d0\n"
        "\tseq\td0\n"
        "\textb.l\td0\n"
        "\teinline";
int isnormal(__reg("fp0")double) =
        "\tinline\n"
        "\tftst.x\tfp0\n"
        "\tfmove.l\tfpsr,d0\n"
        "\tand.l\t#$07000000,d0\n"
        "\tseq\td0\n"
        "\textb.l\td0\n"
        "\teinline";
int isnan(__reg("fp0")double) =
        "\tinline\n"
        "\tftst.x\tfp0\n"
        "\tmoveq\t#1,d0\n"
        "\tfbun\t.skip\n"
        "\tmoveq\t#0,d0\n"
        ".skip\n"
        "\teinline";
int isinf(__reg("fp0")double) =
        "\tinline\n"
        "\tftst.x\tfp0\n"
        "\tmoveq\t#1,d0\n"
        "\tfmove.l\tfpsr,d1\n"
        "\trol.l\t#7,d1\n"
        "\tand.l\td1,d0\n"
        "\teinline";
int signbit(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.s\tfp0,d0\n"
        "\tmoveq\t#31,d1\n"
        "\tasr.l\td1,d0\n"
        "\teinline";
int isgreater(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#1,d0\n"
        "\tfbogt\t.skip\n"
        "\tmoveq\t#0,d0\n"
        ".skip\n"
        "\teinline";
int isgreaterequal(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#0,d0\n"
        "\tfbult\t.skip\n"
        "\tmoveq\t#1,d0\n"
        ".skip\n"
        "\teinline";
int isless(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#1,d0\n"
        "\tfbolt\t.skip\n"
        "\tmoveq\t#0,d0\n"
        ".skip\n"
        "\teinline";
int islessequal(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#0,d0\n"
        "\tfbugt\t.skip\n"
        "\tmoveq\t#1,d0\n"
        ".skip\n"
        "\teinline";
int islessgreater(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#0,d0\n"
        "\tfbueq\t.skip\n"
        "\tmoveq\t#1,d0\n"
        ".skip\n"
        "\teinline";
int isunordered(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tmoveq\t#1,d0\n"
        "\tfbun\t.skip\n"
        "\tmoveq\t#0,d0\n"
        ".skip\n"
        "\teinline";

#ifndef __NOINLINE__
/* faster inline functions */
__fp0ret double acos(__reg("fp0")double) =
        "\tinline\n"
        "\tfacos.x\tfp0\n"
        "\teinline";
__fp0ret double asin(__reg("fp0")double) =
        "\tinline\n"
        "\tfasin.x\tfp0\n"
        "\teinline";
__fp0ret double atan(__reg("fp0")double) =
        "\tinline\n"
        "\tfatan.x\tfp0\n"
        "\teinline";
__fp0ret double atanh(__reg("fp0")double) =
        "\tinline\n"
        "\tfatanh.x\tfp0\n"
        "\teinline";
__fp0ret double ceil(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.x\tfp0,fp1\n"
        "\tfintrz.x\tfp0\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tfboge\t.skip\n"
        "\tfadd.s\t#$3f800000,fp0\n"
        ".skip\n"
        "\teinline";
__fp0ret double copysign(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfmove.s\tfp1,d0\n"
        "\tfabs.x\tfp0\n"
        "\ttst.l\td0\n"
        "\tbpl\t.skip\n"
        "\tfneg.x\tfp0\n"
        ".skip\n"
        "\teinline";
__fp0ret double cos(__reg("fp0")double) =
        "\tinline\n"
        "\tfcos.x\tfp0\n"
        "\teinline";
__fp0ret double cosh(__reg("fp0")double) =
        "\tinline\n"
        "\tfcosh.x\tfp0\n"
        "\teinline";
__fp0ret double exp(__reg("fp0")double) =
        "\tinline\n"
        "\tfetox.x\tfp0\n"
        "\teinline";
__fp0ret double exp2(__reg("fp0")double) =
        "\tinline\n"
        "\tftwotox.x\tfp0\n"
        "\teinline";
__fp0ret double exp10(__reg("fp0")double) =
        "\tinline\n"
        "\tftentox.x\tfp0\n"
        "\teinline";
__fp0ret double expm1(__reg("fp0")double) =
        "\tinline\n"
        "\tfetoxm1.x\tfp0\n"
        "\teinline";
__fp0ret double fabs(__reg("fp0")double) =
        "\tinline\n"
        "\tfabs.x\tfp0\n"
        "\teinline";
__fp0ret double fdim(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfsub.x\tfp1,fp0\n"
        "\tfabs.x\tfp0\n"
        "\teinline";
__fp0ret double floor(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.x\tfp0,fp1\n"
        "\tfintrz.x\tfp0\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tfbole\t.skip\n"
        "\tfsub.s\t#$3f800000,fp0\n"
        ".skip\n"
        "\teinline";
__fp0ret double fma(__reg("fp0")double,__reg("fp1")double,__reg("fp2")double) =
        "\tinline\n"
        "\tfmul.x\tfp1,fp0\n"
        "\tfadd.x\tfp2,fp0\n"
        "\teinline";
__fp0ret double fmax(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tfboge\t.skip\n"
        "\tftst.x\tfp1\n"
        "\tfbun\t.skip\n"
        "\tfmove.x\tfp1,fp0\n"
        ".skip\n"
        "\teinline";
__fp0ret double fmin(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfcmp.x\tfp1,fp0\n"
        "\tfbole\t.skip\n"
        "\tftst.x\tfp1\n"
        "\tfbun\t.skip\n"
        "\tfmove.x\tfp1,fp0\n"
        ".skip\n"
        "\teinline";
__fp0ret double fmod(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfmod.x\tfp1,fp0\n"
        "\teinline";
__fp0ret double hypot(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfmul.x\tfp0,fp0\n"
        "\tfmul.x\tfp1,fp1\n"
        "\tfadd.x\tfp1,fp0\n"
        "\tfsqrt.x\tfp0\n"
        "\teinline";
__fp0ret double ldexp(__reg("fp0")double,__reg("d0")int) =
        "\tinline\n"
        "\tfscale.l\td0,fp0\n"
        "\teinline";
__fp0ret double log(__reg("fp0")double) =
        "\tinline\n"
        "\tflogn.x\tfp0\n"
        "\teinline";
__fp0ret double log10(__reg("fp0")double) =
        "\tinline\n"
        "\tflog10.x\tfp0\n"
        "\teinline";
__fp0ret double log2(__reg("fp0")double) =
        "\tinline\n"
        "\tflog2.x\tfp0\n"
        "\teinline";
__fp0ret double logb(__reg("fp0")double) =
        "\tinline\n"
        "\tfgetexp.x\tfp0\n"
        "\teinline";
__fp0ret double lognp1(__reg("fp0")double) =
        "\tinline\n"
        "\tflognp1.x\tfp0\n"
        "\teinline";
long   lround(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.s\tfp0,d0\n"
        "\tand.l\t#$80000000,d0\n"
        "\tor.l\t#$3f000000,d0\n"
        "\tfadd.s\td0,fp0\n"
        "\tfintrz.x\tfp0\n"
        "\tfmove.l\tfp0,d0\n"
        "\teinline";
__fp0ret double nan(__reg("a0")const char *) =
        "\tinline\n"
        "\tfmove.s\t#$7fc00000,fp0\n"
        "\teinline";
__fp0ret double nearbyint(__reg("fp0")double) =
        "\tinline\n"
        "\tfint.x\tfp0\n"
        "\teinline";
__fp0ret double remainder(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfrem.x\tfp1,fp0\n"
        "\teinline";
__fp0ret double round(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.s\tfp0,d0\n"
        "\tand.l\t#$80000000,d0\n"
        "\tor.l\t#$3f000000,d0\n"
        "\tfadd.s\td0,fp0\n"
        "\tfintrz.x\tfp0\n"
        "\teinline";
__fp0ret double sin(__reg("fp0")double) =
        "\tinline\n"
        "\tfsin.x\tfp0\n"
        "\teinline";
__fp0ret double sinh(__reg("fp0")double) =
        "\tinline\n"
        "\tfsinh.x\tfp0\n"
        "\teinline";
__fp0ret double sqrt(__reg("fp0")double) =
        "\tinline\n"
        "\tfsqrt.x\tfp0\n"
        "\teinline";
__fp0ret double tan(__reg("fp0")double) =
        "\tinline\n"
        "\tftan.x\tfp0\n"
        "\teinline";
__fp0ret double tanh(__reg("fp0")double) =
        "\tinline\n"
        "\tftanh.x\tfp0\n"
        "\teinline";
__fp0ret double trunc(__reg("fp0")double) =
        "\tinline\n"
        "\tfintrz.x\tfp0\n"
        "\teinline";

/* single precision */
#define acosf(x) acos(x)
#define asinf(x) asin(x)
#define atanf(x) atan(x)
#define atanhf(x) atanh(x)
#define ceilf(x) ceil(x)
#define copysignf(x,y) copysign(x,y)
#define cosf(x) cos(x)
#define coshf(x) cosh(x)
#define expf(x) exp(x)
#define exp2f(x) exp2(x)
#define exp10f(x) exp10(x)
#define expm1f(x) expm1(x)
#define fabsf(x) fabs(x)
#define fdimf(x,y) fdim(x,y)
#define floorf(x) floor(x)
#define fmaf(x,y) fma(x,y)
#define fmaxf(x,y) fmax(x,y)
#define fminf(x,y) fmin(x,y)
#define fmodf(x,y) fmod(x,y)
#define hypotf(x,y) hypot(x,y)
#define ldexpf(x,exp) ldexp(x,exp)
#define logf(x) log(x)
#define log10f(x) log10(x)
#define log2f(x) log2(x)
#define logbf(x) logb(x)
#define lognp1f(x) lognp1(x)
#define lroundf(x) lround(x)
#define nanf(x) nan(x)
#define nearbyintf(x) nearbyint(x)
#define remainderf(x,y) remainder(x,y)
#define roundf(x) round(x)
#define sinf(x) sin(x)
#define sinhf(x) sinh(x)
#define sqrtf(x) sqrt(x)
#define tanf(x) tan(x)
#define tanhf(x) tanh(x)
#define truncf(x) trunc(x)
#endif /* __NOINLINE__ */
