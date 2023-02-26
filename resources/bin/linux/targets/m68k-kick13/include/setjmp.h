#ifndef __SETJMP_H
#define __SETJMP_H 1

#if defined(__M68881) || defined(__M68882)
/* direct FPU support */
typedef unsigned char jmp_buf[13*4+6*12];
#else
typedef unsigned char jmp_buf[13*4];
#endif

int setjmp (jmp_buf);
void longjmp (jmp_buf, int);

#endif /* __SETJMP_H */
