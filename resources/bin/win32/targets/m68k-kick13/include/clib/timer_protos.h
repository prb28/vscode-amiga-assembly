#ifndef CLIB_TIMER_PROTOS_H
#define CLIB_TIMER_PROTOS_H


/*
**	$VER: timer_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  DEVICES_TIMER_H
#include <devices/timer.h>
#endif

VOID AddTime(struct timeval * dest, const struct timeval * src);
VOID SubTime(struct timeval * dest, const struct timeval * src);
LONG CmpTime(const struct timeval * dest, const struct timeval * src);

#endif	/*  CLIB_TIMER_PROTOS_H  */
