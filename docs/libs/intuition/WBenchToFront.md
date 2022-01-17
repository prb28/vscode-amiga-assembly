
**NAME**

WBenchToFront -- Bring the Workbench screen in front of all screens.

**SYNOPSIS**

```c
    Success = WBenchToFront()
    D0

    BOOL WBenchToFront( VOID );

```
**FUNCTION**

Causes the Workbench [Screen](_00DD.md), if it's currently opened, to come to
the foreground.  This does not 'move' the screen up or down, instead
only affects the depth-arrangement of the screen.

**INPUTS**

None

RESULT
If the Workbench screen was opened, this function returns TRUE,
otherwise it returns FALSE.

BUGS

**SEE ALSO**

[WBenchToBack](WBenchToBack.md), [ScreenToBack](ScreenToBack.md)
