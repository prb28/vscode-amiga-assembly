#ifndef CLIB_TRANSLATOR_PROTOS_H
#define CLIB_TRANSLATOR_PROTOS_H


/*
**	$VER: translator_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG Translate(const STRPTR inputString, LONG inputLength, STRPTR outputBuffer,
	LONG bufferSize);

#endif	/*  CLIB_TRANSLATOR_PROTOS_H  */
