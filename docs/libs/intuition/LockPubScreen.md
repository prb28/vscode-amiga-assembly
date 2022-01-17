
**NAME**

LockPubScreen -- Prevent a public screen from closing. (V36)

**SYNOPSIS**

```c
    screen = LockPubScreen( Name )
    D0                      A0

    struct Screen *LockPubScreen( UBYTE * );

```
Links: [Screen](_00DD.md) 

**FUNCTION**

Prevents a public screen (or the Workbench) from closing
while you examine it in preparation of opening a visitor window.

The sequence you use to open a visitor window that needs to
examine fields in the screen it is about to open on is:
LockPubScreen()
... examine fields ...
[OpenWindow](OpenWindow.md) on public screen
[UnlockPubScreen](UnlockPubScreen.md)
... use your window ...
[CloseWindow](CloseWindow.md)

NOTE
You needn't hold the &#034;pubscreen lock&#034; for the duration that
your window is opened.  LockPubScreen() basically has the
same effect as an open visitor window: it prevents the
screen from being closed.

If you pass the string &#034;Workbench&#034; or you pass NULL and there
is no default public screen, the Workbench screen will
be automatically opened if it is not already present.

**INPUTS**

Name = name string for public screen or NULL for default public
screen.  The string &#034;Workbench&#034; indicates the Workbench
screen.

RESULT
Returns pointer to a screen, if successful, else NULL.
The call can fail for reasons including that the named
public screen doesn't exist or is in private state.

BUGS

**SEE ALSO**

[OpenWindow](OpenWindow.md), [UnlockPubScreen](UnlockPubScreen.md), [GetScreenData](GetScreenData.md)
