#ifndef _VBCCINLINE_KEYMAP_H
#define _VBCCINLINE_KEYMAP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __SetKeyMapDefault(__reg("a6") void *, __reg("a0") CONST struct KeyMap * keyMap)="\tjsr\t-30(a6)";
#define SetKeyMapDefault(keyMap) __SetKeyMapDefault(KeymapBase, (keyMap))

struct KeyMap * __AskKeyMapDefault(__reg("a6") void *)="\tjsr\t-36(a6)";
#define AskKeyMapDefault() __AskKeyMapDefault(KeymapBase)

WORD __MapRawKey(__reg("a6") void *, __reg("a0") CONST struct InputEvent * event, __reg("a1") STRPTR buffer, __reg("d1") LONG length, __reg("a2") CONST struct KeyMap * keyMap)="\tjsr\t-42(a6)";
#define MapRawKey(event, buffer, length, keyMap) __MapRawKey(KeymapBase, (event), (buffer), (length), (keyMap))

LONG __MapANSI(__reg("a6") void *, __reg("a0") CONST_STRPTR string, __reg("d0") LONG count, __reg("a1") STRPTR buffer, __reg("d1") LONG length, __reg("a2") CONST struct KeyMap * keyMap)="\tjsr\t-48(a6)";
#define MapANSI(string, count, buffer, length, keyMap) __MapANSI(KeymapBase, (string), (count), (buffer), (length), (keyMap))

#endif /*  _VBCCINLINE_KEYMAP_H  */
