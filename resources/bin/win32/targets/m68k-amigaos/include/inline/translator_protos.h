#ifndef _VBCCINLINE_TRANSLATOR_H
#define _VBCCINLINE_TRANSLATOR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __Translate(__reg("a6") void *, __reg("a0") CONST_STRPTR inputString, __reg("d0") LONG inputLength, __reg("a1") STRPTR outputBuffer, __reg("d1") LONG bufferSize)="\tjsr\t-30(a6)";
#define Translate(inputString, inputLength, outputBuffer, bufferSize) __Translate(TranslatorBase, (inputString), (inputLength), (outputBuffer), (bufferSize))

#endif /*  _VBCCINLINE_TRANSLATOR_H  */
