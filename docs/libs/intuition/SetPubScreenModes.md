
**NAME**

SetPubScreenModes -- Establish global public screen behavior. (V36)

**SYNOPSIS**

```c
    OldModes = SetPubScreenModes( Modes )
    D0                            D0

    UWORD SetPubScreenModes( UWORD );

```
**FUNCTION**

Sets GLOBAL Intuition public screen modes.

**INPUTS**

Modes = new global modes flags.  Values for flag bits are:
SHANGHAI: workbench windows are to be opened on the
default public screen
POPPUBSCREEN: when a visitor window is opened, the public
screen it opens on is to be brought to the front.

RESULT
OldModes = previous global mode settings

BUGS

**SEE ALSO**

[OpenScreen](OpenScreen.md), Intuition V36 update documentation
