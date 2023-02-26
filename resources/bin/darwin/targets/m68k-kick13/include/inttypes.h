#ifndef __INTTYPES_H
#define __INTTYPES_H 1

#include <stdint.h>

typedef struct
{
    intmax_t quot; /* Quotient */
    intmax_t rem;  /* Remainder */
} imaxdiv_t;

intmax_t  imaxabs(intmax_t);
imaxdiv_t imaxdiv(intmax_t, intmax_t);
intmax_t  strtoimax(const char *restrict, char **restrict, int);
uintmax_t strtoumax(const char *restrict, char **restrict, int);

/* fprintf() macros for new C99 data types */
#define __PRI8_PREFIX ""
#define __PRI16_PREFIX ""
#define __PRI32_PREFIX ""
#define __PRI64_PREFIX "ll"

#define PRId8 __PRI8_PREFIX "d"
#define PRIi8 __PRI8_PREFIX "i"
#define PRIo8 __PRI8_PREFIX "o"
#define PRIu8 __PRI8_PREFIX "u"
#define PRIx8 __PRI8_PREFIX "x"
#define PRIX8 __PRI8_PREFIX "X"

#define PRId16 __PRI16_PREFIX "d"
#define PRIi16 __PRI16_PREFIX "i"
#define PRIo16 __PRI16_PREFIX "o"
#define PRIu16 __PRI16_PREFIX "u"
#define PRIx16 __PRI16_PREFIX "x"
#define PRIX16 __PRI16_PREFIX "X"

#define PRId32 __PRI32_PREFIX "d"
#define PRIi32 __PRI32_PREFIX "i"
#define PRIo32 __PRI32_PREFIX "o"
#define PRIu32 __PRI32_PREFIX "u"
#define PRIx32 __PRI32_PREFIX "x"
#define PRIX32 __PRI32_PREFIX "X"

#define PRId64 __PRI64_PREFIX "d"
#define PRIi64 __PRI64_PREFIX "i"
#define PRIo64 __PRI64_PREFIX "o"
#define PRIu64 __PRI64_PREFIX "u"
#define PRIx64 __PRI64_PREFIX "x"
#define PRIX64 __PRI64_PREFIX "X"

#define PRIdLEAST8 PRId8
#define PRIiLEAST8 PRIi8
#define PRIoLEAST8 PRIo8
#define PRIuLEAST8 PRIu8
#define PRIxLEAST8 PRIx8
#define PRIXLEAST8 PRIX8

#define PRIdLEAST16 PRId16
#define PRIiLEAST16 PRIi16
#define PRIoLEAST16 PRIo16
#define PRIuLEAST16 PRIu16
#define PRIxLEAST16 PRIx16
#define PRIXLEAST16 PRIX16

#define PRIdLEAST32 PRId32
#define PRIiLEAST32 PRIi32
#define PRIoLEAST32 PRIo32
#define PRIuLEAST32 PRIu32
#define PRIxLEAST32 PRIx32
#define PRIXLEAST32 PRIX32

#define PRIdLEAST64 PRId64
#define PRIiLEAST64 PRIi64
#define PRIoLEAST64 PRIo64
#define PRIuLEAST64 PRIu64
#define PRIxLEAST64 PRIx64
#define PRIXLEAST64 PRIX64

#define PRIdFAST8 PRId32
#define PRIiFAST8 PRIi32
#define PRIoFAST8 PRIo32
#define PRIuFAST8 PRIu32
#define PRIxFAST8 PRIx32
#define PRIXFAST8 PRIX32

#define PRIdFAST16 PRId32
#define PRIiFAST16 PRIi32
#define PRIoFAST16 PRIo32
#define PRIuFAST16 PRIu32
#define PRIxFAST16 PRIx32
#define PRIXFAST16 PRIX32

#define PRIdFAST32 PRId32
#define PRIiFAST32 PRIi32
#define PRIoFAST32 PRIo32
#define PRIuFAST32 PRIu32
#define PRIxFAST32 PRIx32
#define PRIXFAST32 PRIX32

#define PRIdFAST64 PRId64
#define PRIiFAST64 PRIi64
#define PRIoFAST64 PRIo64
#define PRIuFAST64 PRIu64
#define PRIxFAST64 PRIx64
#define PRIXFAST64 PRIX64

#define PRIdPTR PRId32
#define PRIiPTR PRIi32
#define PRIoPTR PRIo32
#define PRIuPTR PRIu32
#define PRIxPTR PRIx32
#define PRIXPTR PRIX32

#define PRIdMAX PRId64
#define PRIiMAX PRIi64
#define PRIoMAX PRIo64
#define PRIuMAX PRIu64
#define PRIxMAX PRIx64
#define PRIXMAX PRIX64

/* fscanf() macros  for new C99 data types */
#define __SCN8_PREFIX "hh"
#define __SCN16_PREFIX "h"
#define __SCN32_PREFIX ""
#define __SCN64_PREFIX "ll"

#define SCNd8 __SCN8_PREFIX "d"
#define SCNi8 __SCN8_PREFIX "i"
#define SCNo8 __SCN8_PREFIX "o"
#define SCNu8 __SCN8_PREFIX "u"
#define SCNx8 __SCN8_PREFIX "x"

#define SCNd16 __SCN16_PREFIX "d"
#define SCNi16 __SCN16_PREFIX "i"
#define SCNo16 __SCN16_PREFIX "o"
#define SCNu16 __SCN16_PREFIX "u"
#define SCNx16 __SCN16_PREFIX "x"

#define SCNd32 __SCN32_PREFIX "d"
#define SCNi32 __SCN32_PREFIX "i"
#define SCNo32 __SCN32_PREFIX "o"
#define SCNu32 __SCN32_PREFIX "u"
#define SCNx32 __SCN32_PREFIX "x"

#define SCNd64 __SCN64_PREFIX "d"
#define SCNi64 __SCN64_PREFIX "i"
#define SCNo64 __SCN64_PREFIX "o"
#define SCNu64 __SCN64_PREFIX "u"
#define SCNx64 __SCN64_PREFIX "x"

#define SCNdLEAST8 SCNd8
#define SCNiLEAST8 SCNi8
#define SCNoLEAST8 SCNo8
#define SCNuLEAST8 SCNu8
#define SCNxLEAST8 SCNx8

#define SCNdLEAST16 SCNd16
#define SCNiLEAST16 SCNi16
#define SCNoLEAST16 SCNo16
#define SCNuLEAST16 SCNu16
#define SCNxLEAST16 SCNx16

#define SCNdLEAST32 SCNd32
#define SCNiLEAST32 SCNi32
#define SCNoLEAST32 SCNo32
#define SCNuLEAST32 SCNu32
#define SCNxLEAST32 SCNx32

#define SCNdLEAST64 SCNd64
#define SCNiLEAST64 SCNi64
#define SCNoLEAST64 SCNo64
#define SCNuLEAST64 SCNu64
#define SCNxLEAST64 SCNx64

#define SCNdFAST8 SCNd32
#define SCNiFAST8 SCNi32
#define SCNoFAST8 SCNo32
#define SCNuFAST8 SCNu32
#define SCNxFAST8 SCNx32

#define SCNdFAST16 SCNd32
#define SCNiFAST16 SCNi32
#define SCNoFAST16 SCNo32
#define SCNuFAST16 SCNu32
#define SCNxFAST16 SCNx32

#define SCNdFAST32 SCNd32
#define SCNiFAST32 SCNi32
#define SCNoFAST32 SCNo32
#define SCNuFAST32 SCNu32
#define SCNxFAST32 SCNx32

#define SCNdFAST64 SCNd64
#define SCNiFAST64 SCNi64
#define SCNoFAST64 SCNo64
#define SCNuFAST64 SCNu64
#define SCNxFAST64 SCNx64

#define SCNdPTR SCNd32
#define SCNiPTR SCNi32
#define SCNoPTR SCNo32
#define SCNuPTR SCNu32
#define SCNxPTR SCNx32

#define SCNdMAX SCNd64
#define SCNiMAX SCNi64
#define SCNoMAX SCNo64
#define SCNuMAX SCNu64
#define SCNxMAX SCNx64

#endif /* __INTTYPES_H */
