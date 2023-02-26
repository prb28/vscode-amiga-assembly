#ifndef _VBCCINLINE_CONSOLE_H
#define _VBCCINLINE_CONSOLE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct InputEvent * __CDInputHandler(__reg("a6") void *, __reg("a0") CONST struct InputEvent * events, __reg("a1") struct Library * consoleDevice)="\tjsr\t-42(a6)";
#define CDInputHandler(events, consoleDevice) __CDInputHandler(ConsoleDevice, (events), (consoleDevice))

LONG __RawKeyConvert(__reg("a6") void *, __reg("a0") CONST struct InputEvent * events, __reg("a1") STRPTR buffer, __reg("d1") LONG length, __reg("a2") CONST struct KeyMap * keyMap)="\tjsr\t-48(a6)";
#define RawKeyConvert(events, buffer, length, keyMap) __RawKeyConvert(ConsoleDevice, (events), (buffer), (length), (keyMap))

#endif /*  _VBCCINLINE_CONSOLE_H  */
