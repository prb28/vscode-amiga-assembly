#ifndef __CTYPE_H
#define __CTYPE_H 1

extern const unsigned char __ctype[];

int isalnum(int);
int isalpha(int);
int isblank(int);
int iscntrl(int);
int isdigit(int);
int isgraph(int);
int islower(int);
int isprint(int);
int ispunct(int);
int isspace(int);
int isupper(int);
int isxdigit(int);

#define isalpha(x)  (__ctype[(x)+1] & 3)
#define isblank(x)  ((x)==9 || (x)==32)
#define isupper(x)  (__ctype[(x)+1] & 1)
#define islower(x)  (__ctype[(x)+1] & 2)
#define isdigit(x)  (__ctype[(x)+1] & 4)
#define isxdigit(x) (__ctype[(x)+1] & 68)
#define isalnum(x)  (__ctype[(x)+1] & 7)
#define isspace(x)  (__ctype[(x)+1] & 8)
#define ispunct(x)  (__ctype[(x)+1] & 16)
#define iscntrl(x)  (__ctype[(x)+1] & 32)
#define isprint(x)  (__ctype[(x)+1] & 151)
#define isgraph(x)  (__ctype[(x)+1] & 23)

int toupper(int);
int tolower(int);

#ifndef __NOINLINE__
int __asm_toupper(__reg("d0") int) =
        "\tinline\n"
        "\txref\t___ctype\n"
        "\tlea\t___ctype,a0\n"
        "\tbtst\t#1,(1,a0,d0.w)\n"
        "\tbeq\t.skip\n"
        "\tand.b\t#$df,d0\n"
        ".skip\n"
        "\teinline";
int __asm_tolower(__reg("d0") int) =
        "\tinline\n"
        "\txref\t___ctype\n"
        "\tlea\t___ctype,a0\n"
        "\tbtst\t#0,(1,a0,d0.w)\n"
        "\tbeq\t.skip\n"
        "\tor.b\t#$20,d0\n"
        ".skip\n"
        "\teinline";

#define toupper(c) __asm_toupper(c)
#define tolower(c) __asm_tolower(c)
#endif /* __NOINLINE__ */

#endif /* __CTYPE_H */
