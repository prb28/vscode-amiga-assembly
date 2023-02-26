#ifndef __STRING_H
#define __STRING_H 1

#ifndef __SIZE_T
#define __SIZE_T 1
typedef unsigned long size_t;
#endif

#undef NULL
#define NULL ((void *)0)

void *memcpy(void *,const void *,size_t);
void *memmove(void *,const void *,size_t);
char *strcpy(char *,const char *);
char *strncpy(char *,const char *,size_t);
char *strcat(char *,const char *);
char *strncat(char *,const char *,size_t);
int memcmp(const void *,const void *,size_t);
int strcmp(const char *,const char *);
int strncmp(const char *,const char *,size_t);
void *memchr(const void *,int,size_t);
char *strchr(const char *,int);
size_t strcspn(const char *,const char *);
char *strpbrk(const char *,const char *);
char *strrchr(const char *,int);
size_t strspn(const char *,const char *);
char *strstr(const char *,const char *);
void *memset(void *,int,size_t);
size_t strlen(const char *);
char *strtok(char *,const char *);
char *strerror(int);
int strcoll(const char *,const char *);
size_t strxfrm(char *,const char *,size_t);

#ifndef __NOINLINE__
#if defined(__M68000) || defined(__M68010)
void *__asm_memcpy(__reg("a0") void *, __reg("a1") const void *,
                   __reg("d2") size_t) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        "\tcmp.l\t#16,d2\n"
        "\tblo\t.l5\n"
        "\tmoveq\t#1,d1\n"
        "\tand.b\td0,d1\n"
        "\tbeq\t.l1\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tsubq.l\t#1,d2\n"
        ".l1\n"
        "\tmove.l\ta1,d1\n"
        "\tand.b\t#1,d1\n"
        "\tbeq\t.l3\n"
        "\tcmp.l\t#$10000,d2\n"
        "\tblo\t.l5\n"
        ".l2\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tsubq.l\t#1,d2\n"
        "\tbne\t.l2\n"
        "\tbra\t.l7\n"
        ".l3\n"
        "\tmoveq\t#3,d1\n"
        "\tand.l\td2,d1\n"
        "\tsub.l\td1,d2\n"
        ".l4\n"
        "\tmove.l\t(a1)+,(a0)+\n"
        "\tsubq.l\t#4,d2\n"
        "\tbne\t.l4\n"
        "\tmove.w\td1,d2\n"
        ".l5\n"
        "\tsubq.w\t#1,d2\n"
        "\tblo\t.l7\n"
        ".l6\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tdbf\td2,.l6\n"
        ".l7\n"
        "\teinline";
void *__asm_memcpy_desc(__reg("a0") void *, __reg("a1") const void *,
                        __reg("d2") size_t) =
        "\tinline\n"
        "\tcmp.l\t#16,d2\n"
        "\tblo\t.l5\n"
        "\tmoveq\t#1,d1\n"
        "\tmove.l\ta0,d0\n"
        "\tand.b\td1,d0\n"
        "\tbeq\t.l1\n"
        "\tmove.b\t-(a1),-(a0)\n"
        "\tsubq.l\t#1,d2\n"
        ".l1\n"
        "\tmove.l\ta1,d0\n"
        "\tand.b\td1,d0\n"
        "\tbeq\t.l3\n"
        "\tcmp.l\t#$10000,d2\n"
        "\tblo\t.l5\n"
        ".l2\n"
        "\tmove.b\t-(a1),-(a0)\n"
        "\tsubq.l\t#1,d2\n"
        "\tbne\t.l2\n"
        "\tbra\t.l7\n"
        ".l3\n"
        "\tmoveq\t#3,d1\n"
        "\tand.l\td2,d1\n"
        "\tsub.l\td1,d2\n"
        ".l4\n"
        "\tmove.l\t-(a1),-(a0)\n"
        "\tsubq.l\t#4,d2\n"
        "\tbne\t.l4\n"
        "\tmove.w\td1,d2\n"
        ".l5\n"
        "\tsubq.w\t#1,d2\n"
        "\tblo\t.l7\n"
        ".l6\n"
        "\tmove.b\t-(a1),-(a0)\n"
        "\tdbf\td2,.l6\n"
        ".l7\n"
        "\tmove.l\ta0,d0\n"
        "\teinline";
void *__asm_memset(__reg("a0") void *, __reg("d0") int, __reg("d2") size_t) =
        "\tinline\n"
        "\tmove.l\ta0,a1\n"
        "\tcmp.l\t#16,d2\n"
        "\tblo\t.l3\n"
        "\tmove.l\ta0,d1\n"
        "\tand.b\t#1,d1\n"
        "\tbeq\t.l1\n"
        "\tmove.b\td0,(a0)+\n"
        "\tsubq.l\t#1,d2\n"
        ".l1\n"
        "\tmove.b\td0,d1\n"
        "\tlsl.w\t#8,d0\n"
        "\tmove.b\td1,d0\n"
        "\tmove.w\td0,d1\n"
        "\tswap\td0\n"
        "\tmove.w\td1,d0\n"
        "\tmoveq\t#3,d1\n"
        "\tand.l\td2,d1\n"
        "\tsub.l\td1,d2\n"
        ".l2\n"
        "\tmove.l\td0,(a0)+\n"
        "\tsubq.l\t#4,d2\n"
        "\tbne\t.l2\n"
        "\tmove.w\td1,d2\n"
        ".l3\n"
        "\tsubq.w\t#1,d2\n"
        "\tblo\t.l5\n"
        ".l4\n"
        "\tmove.b\td0,(a0)+\n"
        "\tdbf\td2,.l4\n"
        ".l5\n"
        "\tmove.l\ta1,d0\n"
        "\teinline";

#else /* 68020+ */
void *__asm_memcpy(__reg("a0") void *, __reg("a1") const void *,
                   __reg("d2") size_t) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        "\tsubq.l\t#4,d2\n"
        "\tbcs\t.l3\n"
        "\tmove.l\td0,d1\n"
        "\tlsr.l\t#1,d1\n"
        "\tbcc\t.l1\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tsubq.l\t#1,d2\n"
        "\tbcs\t.l3\n"
        "\taddq.l\t#1,d1\n"
        ".l1\n"
        "\tlsr.l\t#1,d1\n"
        "\tbcc\t.l2\n"
        "\tmove.w\t(a1)+,(a0)+\n"
        "\tsubq.l\t#2,d2\n"
        "\tbcs\t.l3\n"
        ".l2\n"
        "\tmove.l\t(a1)+,(a0)+\n"
        "\tsubq.l\t#4,d2\n"
        "\tbcc\t.l2\n"
        ".l3\n"
        "\taddq.l\t#3,d2\n"
        "\tbcc\t.l5\n"
        ".l4\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tdbf\td2,.l4\n"
        ".l5\n"
        "\teinline";
void *__asm_memcpy_desc(__reg("a0") void *, __reg("a1") const void *,
                   __reg("d2") size_t) =
        "\tinline\n"
        "\tsubq.l\t#4,d2\n"
        "\tbcs\t.l3\n"
        "\tmove.l\ta0,d0\n"
        "\tlsr.l\t#1,d0\n"
        "\tbcc\t.l1\n"
        "\tmove.b\t-(a1),-(a0)\n"
        "\tsubq.l\t#1,d2\n"
        "\tbcs\t.l3\n"
        ".l1\n"
        "\tlsr.l\t#1,d0\n"
        "\tbcc\t.l2\n"
        "\tmove.w\t-(a1),-(a0)\n"
        "\tsubq.l\t#2,d2\n"
        "\tbcs\t.l3\n"
        ".l2\n"
        "\tmove.l\t-(a1),-(a0)\n"
        "\tsubq.l\t#4,d2\n"
        "\tbcc\t.l2\n"
        ".l3\n"
        "\taddq.l\t#3,d2\n"
        "\tbcc\t.l5\n"
        ".l4\n"
        "\tmove.b\t-(a1),-(a0)\n"
        "\tdbf\td2,.l4\n"
        ".l5\n"
        "\tmove.l\ta0,d0\n"
        "\teinline";
void *__asm_memset(__reg("a0") void *, __reg("d0") int, __reg("d2") size_t) =
        "\tinline\n"
        "\tmove.l\ta0,a1\n"
        "\tsubq.l\t#8,d2\n"
        "\tbcs\t.l3\n"
        "\tmove.l\td0,d1\n"
        "\tlsl.l\t#8,d0\n"
        "\tmove.b\td1,d0\n"
        "\taddq.l\t#4,d2\n"
        "\tmove.l\td0,d1\n"
        "\tswap\td0\n"
        "\tmove.w\td1,d0\n"
        "\tmove.l\ta1,d1\n"
        "\tlsr.l\t#1,d1\n"
        "\tbcc\t.l1\n"
        "\tmove.b\td0,(a0)+\n"
        "\taddq.l\t#1,d1\n"
        "\tsubq.l\t#1,d2\n"
        ".l1\n"
        "\tlsr.l\t#1,d1\n"
        "\tbcc\t.l2\n"
        "\tmove.w\td0,(a0)+\n"
        "\tsubq.l\t#2,d2\n"
        ".l2\n"
        "\tmove.l\td0,(a0)+\n"
        "\tsubq.l\t#4,d2\n"
        "\tbcc\t.l2\n"
        "\taddq.l\t#3,d2\n"
        "\tbcs\t.l4\n"
        "\tbra\t.l5\n"
        ".l3\n"
        "\taddq.l\t#7,d2\n"
        "\tbcc\t.l5\n"
        ".l4\n"
        "\tmove.b\td0,(a0)+\n"
        "\tdbf\td2,.l4\n"
        ".l5\n"
        "\tmove.l\ta1,d0\n"
        "\teinline";

#endif /* 68020+ */

size_t __asm_strlen(__reg("a0") const char *) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        ".l1\n"
        "\ttst.b\t(a0)+\n"
        "\tbne\t.l1\n"
        "\tsub.l\ta0,d0\n"
        "\tnot.l\td0\n"
        "\teinline";
char *__asm_strcpy(__reg("a0") char *, __reg("a1") const char *) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        ".l1\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tbne\t.l1\n"
        "\teinline";
char *__asm_strncpy(__reg("a0") char *, __reg("a1") const char *,
                    __reg("d1") size_t) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        "\tbra\t.l2\n"
        ".l1\n"
        "\tmove.b\t(a1),(a0)+\n"
        "\tbeq\t.l2\n"
        "\taddq.l\t#1,a1\n"
        ".l2\n"
        "\tsubq.l\t#1,d1\n"
        "\tbpl\t.l1\n"
        "\teinline";
int __asm_strcmp(__reg("a0") const char *, __reg("a1") const char *) =
        "\tinline\n"
        "\tmoveq\t#0,d0\n"
        "\tmoveq\t#0,d1\n"
        ".l1\n"
        "\tmove.b\t(a0)+,d0\n"
        "\tmove.b\t(a1)+,d1\n"
        "\tbeq\t.l2\n"
        "\tsub.l\td1,d0\n"
        "\tbeq\t.l1\n"
        "\tmoveq\t#0,d1\n"
        ".l2\n"
        "\tsub.l\td1,d0\n"
        "\teinline";
int __asm_strncmp(__reg("a0") const char *, __reg("a1") const char *,
                  __reg("d2") size_t) =
        "\tinline\n"
        "\tmoveq\t#0,d0\n"
        "\tmoveq\t#0,d1\n"
        ".l1\n"
        "\tsubq.l\t#1,d2\n"
        "\tbmi\t.l3\n"
        "\tmove.b\t(a0)+,d0\n"
        "\tmove.b\t(a1)+,d1\n"
        "\tbeq\t.l2\n"
        "\tsub.l\td1,d0\n"
        "\tbeq\t.l1\n"
        "\tmoveq\t#0,d1\n"
        ".l2\n"
        "\tsub.l\td1,d0\n"
        ".l3\n"
        "\teinline";
char *__asm_strcat(__reg("a0") char *, __reg("a1") const char *) =
        "\tinline\n"
        "\tmove.l\ta0,d0\n"
        ".l1\n"
        "\ttst.b\t(a0)+\n"
        "\tbne\t.l1\n"
        "\tsubq.l\t#1,a0\n"
        ".l2\n"
        "\tmove.b\t(a1)+,(a0)+\n"
        "\tbne\t.l2\n"
        "\teinline";
char *__asm_strrchr(__reg("a0") const char *, __reg("d1") int) =
        "\tinline\n"
        "\tmoveq\t#0,d0\n"
        ".l1\n"
        "\tcmp.b\t(a0),d1\n"
        "\tbne\t.l2\n"
        "\tmove.l\ta0,d0\n"
        ".l2\n"
        "\ttst.b\t(a0)+\n"
        "\tbne\t.l1\n"
        "\teinline";

#define memcpy(d,s,n) __asm_memcpy(d,s,n)
#define memmove(d,s,n) ((d)<=(s) ? __asm_memcpy(d,s,n) : \
                                   __asm_memcpy_desc((char *)(d)+(n),(char *)(s)+(n),n))
#define memset(p,f,n) __asm_memset(p,f,n)
#define strlen(p) __asm_strlen(p)
#define strcpy(d,s) __asm_strcpy(d,s)
#define strncpy(d,s,n) __asm_strncpy(d,s,n)
#define strcmp(s1,s2) __asm_strcmp(s1,s2)
#define strncmp(s1,s2,n) __asm_strncmp(s1,s2,n)
#define strcat(d,s) __asm_strcat(d,s)
#define strrchr(s,n) __asm_strrchr(s,n)
#endif /* __NOINLINE__ */

#endif /* __STRING_H */
