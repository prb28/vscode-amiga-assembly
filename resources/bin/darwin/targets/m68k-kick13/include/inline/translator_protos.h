#ifndef _VBCCINLINE_TRANSLATOR_H
#define _VBCCINLINE_TRANSLATOR_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __Translate(__reg("a6") void *, __reg("a0") char * inputString, __reg("d0") long inputLength, __reg("a1") char * outputBuffer, __reg("d1") long bufferSize)="\tjsr\t-30(a6)";
#define Translate(inputString, inputLength, outputBuffer, bufferSize) __Translate(TranslatorBase, (inputString), (inputLength), (outputBuffer), (bufferSize))

#endif /*  _VBCCINLINE_TRANSLATOR_H  */
