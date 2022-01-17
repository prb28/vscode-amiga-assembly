
**NAME**

GetPrefs -- Get the current Intuition [Preferences](_00D5.md) structure.

**SYNOPSIS**

```c
    Prefs = GetPrefs( PrefBuffer, Size )
    D0                A0          D0

    struct Preferences *GetPrefs( struct Preferences *, WORD );

```
Links: [Preferences](_00D5.md) [Preferences](_00D5.md) 

**FUNCTION**

Gets a copy of the current Intuition [Preferences](_00D5.md) structure.
Writes the data into the buffer you specify.  The number of bytes you
want copied is specified by the size argument.

It is legal to take a partial copy of the [Preferences](_00D5.md) structure.
The more pertinent preferences variables have been grouped near
the top of the structure to facilitate the memory conservation
that can be had by taking a copy of only some of the [Preferences](_00D5.md)
structure.

New for V36:  A new and more extensible method for supplying
[Preferences](_00D5.md) has been introduced in V36, and relies on file
system notification.  The Intuition preferences items rely
also on the IPrefs program.  Certain elements of the
[Preferences](_00D5.md) structure have been superceded by this new method.
As much as possible, the [Preferences](_00D5.md) structure returned by
GetPrefs() reflect the current state of [Preferences](_00D5.md).  However,
it is impossible to represent some of the V36-style preferences
items using the existing [Preferences](_00D5.md) structure.

**INPUTS**

PrefBuffer = pointer to the memory buffer to receive your copy of the
Intuition [Preferences](_00D5.md)
Size = the number of bytes in your PrefBuffer, the number of bytes
you want copied from the system's internal Preference settings

RESULT
Returns your parameter PrefBuffer.

BUGS

**SEE ALSO**

[GetDefPrefs](GetDefPrefs.md), [SetPrefs](SetPrefs.md)
