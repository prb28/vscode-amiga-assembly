#ifndef CLIB_CONSOLE_PROTOS_H
#define CLIB_CONSOLE_PROTOS_H


/*
**	$VER: console_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif
#ifndef  DEVICES_INPUTEVENT_H
#include <devices/inputevent.h>
#endif
#ifndef  DEVICES_KEYMAP_H
#include <devices/keymap.h>
#endif

struct InputEvent * CDInputHandler(const struct InputEvent * events,
	struct Library * consoleDevice);
LONG RawKeyConvert(const struct InputEvent * events, STRPTR buffer, LONG length,
	const struct KeyMap * keyMap);

#endif	/*  CLIB_CONSOLE_PROTOS_H  */
