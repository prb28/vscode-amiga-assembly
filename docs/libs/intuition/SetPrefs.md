
**NAME**

SetPrefs -- Set Intuition preferences data.

**SYNOPSIS**

```c
    Prefs = SetPrefs( PrefBuffer, Size, Inform )
    D0                A0          D0    D1

    struct Preferences *SetPrefs( struct Preferences *, LONG, BOOL );

```
Links: [Preferences](_00D5.md) [Preferences](_00D5.md) 

**FUNCTION**

Sets new preferences values.  Copies the first 'Size' bytes
from your preferences buffer to the system preferences table,
and puts them into effect.

The 'Inform' parameter, if TRUE, indicates that an IDCMP_NEWPREFS
message is to be sent to all windows that have the IDCMP_NEWPREFS
IDCMPFlag set.

It is legal to set a partial copy of the [Preferences](_00D5.md) structure.
The most frequently changed values are grouped at the beginning
of the [Preferences](_00D5.md) structure.

New for V36:  A new and more extensible method for supplying
[Preferences](_00D5.md) has been introduced in V36, and relies on file
system notification.  The Intuition preferences items rely
also on the IPrefs program.  Certain elements of the
[Preferences](_00D5.md) structure have been superceded by this new method.
Pointer changes submitted through SetPrefs() are only heeded
until the first time IPrefs informs Intuition of a V36-style
pointer.ilbm preferences file.  The [Preferences](_00D5.md) FontHeight and
LaceWB fields are respected only from the system-configuration
file, and never thereafter.  As well, the view centering and
size apply only to the default monitor, and not to such modes
as Productivity.  Other fields may be superceded in the future.

**INPUTS**

PrefBuffer = pointer to the memory buffer which contains your
desired settings for Intuition preferences
Size = the number of bytes in your PrefBuffer, the number of bytes
you want copied to the system's internal preference settings
Inform = whether you want the information of a new preferences
setting propagated to all windows.

NOTES
Unless you are responding to a user's explicit request to
change [Preferences](_00D5.md) (for example, you are writing a [Preferences](_00D5.md)
editor), you should probably avoid using this function.
The user's [Preferences](_00D5.md) should be respected, not overridden.

RESULT
Returns your parameter PrefBuffer.

BUGS

**SEE ALSO**

[GetDefPrefs](GetDefPrefs.md), [GetPrefs](GetPrefs.md)
