#ifndef __STDINT_H
#define __STDINT_H 1

#include <limits.h>

typedef signed char int8_t;
typedef signed short int16_t;
typedef signed long int32_t;
typedef signed long long int64_t;
#define INT8_MIN SCHAR_MIN
#define INT8_MAX SCHAR_MAX
#define INT16_MIN SHRT_MIN
#define INT16_MAX SHRT_MAX
#define INT32_MIN LONG_MIN
#define INT32_MAX LONG_MAX
#define INT64_MIN LLONG_MIN
#define INT64_MAX LLONG_MAX

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;
typedef unsigned long uint32_t;
typedef unsigned long long uint64_t;
#define UINT8_MAX UCHAR_MAX
#define UINT16_MAX USHRT_MAX
#define UINT32_MAX ULONG_MAX
#define UINT64_MAX ULLONG_MAX

typedef signed char int_least8_t;
typedef signed short int_least16_t;
typedef signed long int_least32_t;
typedef signed long long int_least64_t;
#define INT_LEAST8_MIN SCHAR_MIN
#define INT_LEAST8_MAX SCHAR_MAX
#define INT_LEAST16_MIN SHRT_MIN
#define INT_LEAST16_MAX SHRT_MAX
#define INT_LEAST32_MIN LONG_MIN
#define INT_LEAST32_MAX LONG_MAX
#define INT_LEAST64_MIN LLONG_MIN
#define INT_LEAST64_MAX LLONG_MAX

typedef unsigned char uint_least8_t;
typedef unsigned short uint_least16_t;
typedef unsigned long uint_least32_t;
typedef unsigned long long uint_least64_t;
#define UINT_LEAST8_MAX UCHAR_MAX
#define UINTLEAST16_MAX USHRT_MAX
#define UINTLEAST32_MAX ULONG_MAX
#define UINTLEAST64_MAX ULLONG_MAX

typedef signed int int_fast8_t;
typedef signed int int_fast16_t;
typedef signed long int_fast32_t;
typedef signed long long int_fast64_t;
#define INT_FAST8_MIN INT_MIN
#define INT_FAST8_MAX INT_MAX
#define INT_FAST16_MIN INT_MIN
#define INT_FAST16_MAX INT_MAX
#define INT_FAST32_MIN LONG_MIN
#define INT_FAST32_MAX LONG_MAX
#define INT_FAST64_MIN LLONG_MIN
#define INT_FAST64_MAX LLONG_MAX

typedef unsigned int uint_fast8_t;
typedef unsigned int uint_fast16_t;
typedef unsigned long uint_fast32_t;
typedef unsigned long long uint_fast64_t;
#define UINT_FAST8_MAX UINT_MAX
#define UINT_FAST16_MAX UINT_MAX
#define UINT_FAST32_MAX ULONG_MAX
#define UINT_FAST64_MAX ULLONG_MAX


typedef long intptr_t;
#define INTPTR_MIN LONG_MIN
#define INTPTR_MAX LONG_MAX

typedef unsigned long uintptr_t;
#define UINTPTR_MAX ULONG_MAX

typedef long long intmax_t;
#define INTMAX_MIN LLONG_MIN
#define INTMAX_MAX LLONG_MAX

typedef unsigned long long uintmax_t;
#define UINTMAX_MAX ULLONG_MAX

#define SIG_ATOMIC_MIN INT_MIN
#define SIG_ATOMIC_MAX INT_MAX

#define SIZE_MAX ULONG_MAX

#define WCHAR_MIN CHAR_MIN
#define WCHAR_MAX CHAR_MAX

#define WINT_MIN INT_MIN
#define WINT_MAX INT_MAX

#define INT8_C(x) x
#define INT16_C(x) x
#if __INTSIZE == 16
#define INT32_C(x) x##L
#else
#define INT32_C(x) x
#endif
#define INT64_C(x) x##LL
#define INTMAX_C(x) x##LL

#define UINT8_C(x) x##U
#define UINT16_C(x) x##U
#if __INTSIZE == 16
#define UINT32_C(x) x##UL
#else
#define UINT32_C(x) x##U
#endif
#define UINT64_C(x) x##ULL
#define UINTMAX_C(x) x##ULL

#endif /* __STDINT_H */
