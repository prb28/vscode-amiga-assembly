#ifndef __STDDEF_H
#define __STDDEF_H 1

/*
  Adapt as needed.
*/
#ifndef __SIZE_T
#define __SIZE_T 1
#ifdef __SIZE_T_INT
typedef unsigned int size_t;
#else
typedef unsigned long size_t;
#endif
#endif

/*
  Adapt as needed.
*/
#ifndef __PTRDIFF_T
#define __PTRDIFF_T 1
typedef long ptrdiff_t;
#endif

#ifndef __WCHAR_T
#define __WCHAR_T
typedef char wchar_t;
#endif

#undef NULL
#define NULL ((void *)0)

#undef offsetof
#define offsetof(P,M) __offsetof(P,M)

#endif


