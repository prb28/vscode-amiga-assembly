
**NAME**

DisplayBeep -- Flash the video display.

**SYNOPSIS**

```c
    DisplayBeep( Screen )
                 A0

    VOID DisplayBeep( struct Screen * );

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) 

**FUNCTION**

&#034;Beeps&#034; the video display by flashing the background color of the
specified screen.  If the screen argument is NULL, every screen
in the display will be beeped.  Flashing everyone's screen is not
a polite thing to do, so this should be reserved for dire
circumstances.

The reason such a routine is supported is because the Amiga has
no internal bell or speaker.  When the user needs to know of
an event that is not serious enough to require the use of a requester,
the DisplayBeep() function may be called.

New for V36:  Intuition now calls DisplayBeep through the
external library vector.  This means that if you call [SetFunction](../exec/SetFunction.md)
to replace DisplayBeep with an audible beep, for example, then
your change will affect even Intuition's calls to DisplayBeep.

**INPUTS**

[Screen](_00DD.md) = pointer to a screen.  If NULL, every screen in the display
will be flashed

RESULT
None

BUGS

**SEE ALSO**

