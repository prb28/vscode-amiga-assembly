#ifndef CLIB_MISC_PROTOS_H
#define CLIB_MISC_PROTOS_H


/*
**	$VER: misc_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

UBYTE * AllocMiscResource(ULONG unitNum, const STRPTR name);
VOID FreeMiscResource(ULONG unitNum);

#endif	/*  CLIB_MISC_PROTOS_H  */
