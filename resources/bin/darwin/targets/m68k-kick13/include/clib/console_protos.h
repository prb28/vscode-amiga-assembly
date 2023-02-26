/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct InputEvent*/
#ifndef  DEVICES_INPUTEVENT_H
#include <devices/inputevent.h>
#endif

/* struct Device */
#ifndef EXEC_DEVICES_H
#include <exec/devices.h>
#endif

/* struct KeyMap */
#ifndef  DEVICES_KEYMAP_H
#include <devices/keymap.h>
#endif

extern struct Library *ConsoleDevice;

struct InputEvent *CDInputHandler(struct InputEvent *, struct Device *);
long RawKeyConvert(struct InputEvent *, char *, long, struct KeyMap *);
