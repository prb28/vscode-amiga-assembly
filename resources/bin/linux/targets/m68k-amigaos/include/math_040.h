/* $VER: math_040.h 1.0 (06.04.2017)
** math.h 68040 specific support, link with -lm040
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
__fp0ret double ceil(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.l\tfpcr,d1\n"
        "\tmoveq\t#$30,d0\n"
        "\tor.l\td1,d0\n"
        "\tfmove.l\td0,fpcr\n"
        "\tfmove.l\tfp0,d0\n"
        "\tfmove.l\td0,fp0\n"
        "\tfmove.l\td1,fpcr\n"
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
        "\tfmove.l\tfpcr,d1\n"
        "\tmoveq\t#$20,d0\n"
        "\tor.l\td1,d0\n"
        "\tand.w\t#$ffef,d0\n"
        "\tfmove.l\td0,fpcr\n"
        "\tfmove.l\tfp0,d0\n"
        "\tfmove.l\td0,fp0\n"
        "\tfmove.l\td1,fpcr\n"
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
__fp0ret double hypot(__reg("fp0")double,__reg("fp1")double) =
        "\tinline\n"
        "\tfmul.x\tfp0,fp0\n"
        "\tfmul.x\tfp1,fp1\n"
        "\tfadd.x\tfp1,fp0\n"
        "\tfsqrt.x\tfp0\n"
        "\teinline";
__fp0ret double nan(__reg("a0")const char *) =
        "\tinline\n"
        "\tfmove.s\t#$7fc00000,fp0\n"
        "\teinline";
__fp0ret double nearbyint(__reg("fp0")double) =
        "\tinline\n"
        "\tfmove.l\tfp0,d0\n"
        "\tfmove.l\td0,fp0\n"
        "\teinline";
__fp0ret double sqrt(__reg("fp0")double) =
        "\tinline\n"
        "\tfsqrt.x\tfp0\n"
        "\teinline";
__fp0ret double trunc(__reg("fp0")double) =
        "\tinline\n"
        "\tmoveq\t#$10,d0\n"
        "\tfmove.l\tfpcr,d1\n"
        "\tor.l\td1,d0\n"
        "\tand.w\t#$ffdf,d0\n"
        "\tfmove.l\td0,fpcr\n"
        "\tfmove.l\tfp0,d0\n"
        "\tfmove.l\td0,fp0\n"
        "\tfmove.l\td1,fpcr\n"
        "\teinline";

/* single precision */
#define ceilf(x) ceil(x)
#define copysignf(x,y) copysign(x,y)
#define fabsf(x) fabs(x)
#define fdimf(x,y) fdim(x,y)
#define floorf(x) floor(x)
#define fmaf(x,y) fma(x,y)
#define fmaxf(x,y) fmax(x,y)
#define fminf(x,y) fmin(x,y)
#define hypotf(x,y) hypot(x,y)
#define nanf(x) nan(x)
#define nearbyintf(x) nearbyint(x)
#define sqrtf(x) sqrt(x)
#define truncf(x) trunc(x)
#endif /* __NOINLINE__ */
