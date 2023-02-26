#ifndef __FENV_H
#define __FENV_H 1

typedef unsigned long fenv_t;
typedef unsigned long fexcept_t;

/* rounding mode used by fegetround() and fesetround() */
#define FE_TONEAREST  0x00 /* round toward nearest (round) */
#define FE_TOWARDZERO 0x10 /* round toward zero (trunc) */
#define FE_DOWNWARD   0x20 /* round toward -inf (floor) */
#define FE_UPWARD     0x30 /* round toward +inf (ceil) */

/* rounding precision used by fegetprec() and fesetprec() */
#define FE_LDBLPREC 0x00 /* long double precision */
#define FE_FLTPREC  0x40 /* float precision */
#define FE_DBLPREC  0x80 /* double precision */

extern const char __Zero_l[];
#define FE_DFL_ENV (*(const fenv_t *)(const void *)__Zero_l)

/* begin function declarations */
int feclearexcept(int);
int fegetenv(fenv_t *);
int fegetexceptflag(fexcept_t *, int);
int fegetprec(void);
int fegetround(void);
int feholdexcept(fenv_t *);
int feraiseexcept(int);
int fesetenv(const fenv_t *);
int fesetexceptflag(const fexcept_t *, int);
int fesetprec(int);
int fesetround(int);
int fetestexcept(int);
int feupdateenv(const fenv_t *);
/* end function declarations */

#ifndef __NOINLINE__
/* faster inline functions */

#if defined(__M68881) || defined(__M68882)
/* direct FPU support */

int __asm_fegetenv(__reg("a0")fenv_t *) =
        "\tinline\n"
        "\tfmove.l\tfpcr,(a0)\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_fegetround() =
        "\tinline\n"
        "\tfmove.l\tfpcr,d1\n"
        "\tmoveq\t#$30,d0\n"
        "\tand.l\td1,d0\n"
        "\teinline";
int __asm_fegetprec() =
        "\tinline\n"
        "\tfmove.l\tfpcr,d0\n"
        "\tand.l\t#$c0,d0\n"
        "\teinline";
int __asm_feholdexcept(__reg("a0")fenv_t *) =
        "\tinline\n"
        "\tfmove.l\tfpcr,(a0)\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_fesetenv(__reg("a0")const fenv_t *) =
        "\tinline\n"
        "\tfmove.l\t(a0),fpcr\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_fesetround(__reg("d0")int) =
        "\tinline\n"
        "\tfmove.l\tfpcr,d1\n"
        "\tand.w\t#$ffcf,d1\n"
        "\tor.l\td0,d1\n"
        "\tfmove.l\td1,fpcr\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_fesetprec(__reg("d0")int) =
        "\tinline\n"
        "\tfmove.l\tfpcr,d1\n"
        "\tand.w\t#$ff3f,d1\n"
        "\tor.l\td0,d1\n"
        "\tfmove.l\td1,fpcr\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";

#else
/* IEEE or software floating-point */

int __asm_fegetenv(__reg("a0")fenv_t *) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fegetround() =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fegetprec() =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_feholdexcept(__reg("a0")fenv_t *) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fesetenv(__reg("a0")const fenv_t *) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fesetround(__reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fesetprec(__reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";

#endif

int __asm_feclearexcept(__reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_fegetexceptflag(__reg("a0")fexcept_t *,
                          __reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_feraiseexcept(__reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fesetexceptflag(__reg("a0")const fexcept_t *,
                          __reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";
int __asm_fetestexcept(__reg("d0")int) =
        "\tinline\n"
        "\tmoveq\t#0,d0\n"
        "\teinline";
int __asm_feupdateenv(__reg("a0")const fenv_t *) =
        "\tinline\n"
        "\tmoveq\t#-1,d0\n"
        "\teinline";

#define feclearexcept(x) __asm_feclearexcept(x)
#define fegetenv(x) __asm_fegetenv(x)
#define fegetexceptflag(x,y) __asm_fegetexceptflag(x,y)
#define fegetround() __asm_fegetround()
#define fegetprec() __asm_fegetprec()
#define feholdexcept(x) __asm_feholdexcept(x)
#define feraiseexcept(x) __asm_feraiseexcept(x)
#define fesetenv(x) __asm_fesetenv(x)
#define fesetexceptflag(x,y) __asm_fesetexceptflag(x,y)
#define fesetround(x) __asm_fesetround(x)
#define fesetprec(x) __asm_fesetprec(x)
#define fetestexcept(x) __asm_fetestexcept(x)
#define feupdateenv(x) __asm_feupdateenv(x)
#endif /* __NOINLINE__ */

#endif /* __FENV_H */
