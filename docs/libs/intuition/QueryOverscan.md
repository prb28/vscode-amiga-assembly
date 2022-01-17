
**NAME**

QueryOverscan -- Inquire about a standard overscan region. (V36)

**SYNOPSIS**

```c
    success = QueryOverscan( DisplayID, Rect, OScanType )
    D0                       A0         A1    D0

    LONG QueryOverscan( ULONG, struct Rectangle *, WORD );

```
Links: [Rectangle](_00A6.md) 

**FUNCTION**

This function fills in a rectangle with one of the system
overscan dimensions, scaled appropriately for the mode of
the DisplayID it is passed.

There are three types of system overscan values:
OSCAN_TEXT: completely visible, by user preference.  Used
for Workbench screen and screen dimensions STDSCREENWIDTH
and STDSCREENHEIGHT.  Left/Top is always 0,0.
OSCAN_STANDARD: just beyond visible bounds of monitor, by
user preference.  Left/Top may be negative.
OSCAN_MAX: The largest region we can display, AND display
any smaller region (see note below).
OSCAN_VIDEO: The absolute largest region that the graphics.library
can display.  This region must be used as-is.


**INPUTS**

DisplayID -- A 32-bit identifier for a display mode, as
defined in [graphics/displayinfo.h](_00BD.md).

NOTE: If you only intend to use one of the four standard
overscan dimensions as is, and open your screen to exactly
the DisplayClip dimensions, you can specify one of
the OSCAN_ values in the [ExtNewScreen](_00DD.md) tag SA_StdDClip,
and specify STDSCREENWIDTH and STDSCREENHEIGHT as the
dimensions to more easily open up an overscanned screen
(or use no [NewScreen](_00DD.md) in [OpenScreenTagList](OpenScreenTagList.md) and accept
the default standard screen dimensions).

Rect -- pointer to a [Rectangle](_00A6.md) structure which this function
will fill out with its return values.  Note that to convert
a rectangle to a screen &#034;Height&#034; you do (MaxY - MinY + 1), and
similarly for &#034;Width.&#034;  The rectangle may be passed directly
to [OpenScreen](OpenScreen.md) as a DisplayClip region (SA_DClip).

RESULT
0 (FALSE) if the [MonitorSpec](_00A7.md) your [NewScreen](_00DD.md) requests
does not exist.  Non-zero (TRUE) if it does.

BUGS
Change in parameter V36.A17 might cause problems for some.

**SEE ALSO**

[OpenScreen](OpenScreen.md), Intuition V36 update documentation
