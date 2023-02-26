#ifndef CLIB_CIA_PROTOS_H
#define CLIB_CIA_PROTOS_H


/*
**	$VER: cia_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  EXEC_INTERRUPTS_H
#include <exec/interrupts.h>
#endif
#ifndef  EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

struct Interrupt * AddICRVector(struct Library * resource, LONG iCRBit,
	struct Interrupt * interrupt);
VOID RemICRVector(struct Library * resource, LONG iCRBit, struct Interrupt * interrupt);
WORD AbleICR(struct Library * resource, LONG mask);
WORD SetICR(struct Library * resource, LONG mask);

#endif	/*  CLIB_CIA_PROTOS_H  */
