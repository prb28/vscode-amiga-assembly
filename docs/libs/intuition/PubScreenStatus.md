
**NAME**

PubScreenStatus -- Change status flags for a public screen. (V36)

**SYNOPSIS**

```c
    ResultFlags = PubScreenStatus( Screen, StatusFlags )
    D0                             A0      D0

    UWORD PubScreenStatus( struct Screen *, UWORD );

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) 

**FUNCTION**

Changes status flags for a given public screen.

Do not apply this function to a screen if your program
isn't the screen's &#034;owner&#034;, in particular, don't call
this function for the Workbench screen.

**INPUTS**

[Screen](_00DD.md) = pointer to public screen
StatusFlags = values currently:
PSNF_PRIVATE: make this screen unavailable to visitor windows

RESULT
Returns 0 in the lowest order bit of the return value
if the screen wasn't public, or because it can not be taken
private because visitors are open in it.

All other bits in the return code are reserved for future
enhancement.

BUGS

**SEE ALSO**

[OpenScreen](OpenScreen.md), Intuition V36 update documentation
