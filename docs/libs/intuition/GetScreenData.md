
**NAME**

GetScreenData -- Get copy of a screen data structure.

**SYNOPSIS**

```c
    Success = GetScreenData( Buffer, Size, Type, Screen )
    D0                       A0      D0    D1    A1

    BOOL GetScreenData( APTR, UWORD, UWORD, struct Screen * );

```
Links: [Screen](_00DD) [Screen](_00DD) 

**FUNCTION**

This function copies into the caller's buffer data from a [Screen](_00DD)
structure.  Typically, this call will be used to find the size, title
bar height, and other values for a standard screen, such as the
Workbench screen.

To get the data for the Workbench screen, one would call:
GetScreenData(buff, sizeof(struct Screen), WBENCHSCREEN, NULL)

NOTE: if the requested standard screen is not open, this function
will have the effect of opening it.

This function has been useful for two basic types of things:
1) Determining information about the Workbench screen, in
preparation for opening a window on it.
2) Attempts at discerning the user's preferences in a working
screen, for &#034;cloning&#034; the Workbench modes and dimensions
when opening a similar custom screen.

Providing compatibility with both of these goals has proven
difficult, as we introduce new display modes and screen scrolling
in V36.  Read carefully the somewhat involved exceptions we
elected to implement ...

Changes as of V36:

For V36 and later, the function [LockPubScreen](LockPubScreen) is an improvement
over this function, in that it doesn't copy the screen data
but returns a pointer and a guarantee that the screen will not
be closed.

If the global public screen SHANGHAI mode is in effect (see
[SetPubScreenModes](SetPubScreenModes) ), this function will actually report on
the default public screen, where &#034;Workbench&#034; windows will
actually open.

For V36 and later, this function does some &#034;compatibility tricks&#034;
when you inquire about the WBENCHSCREEN.  To keep programs from
&#034;stumbling&#034; into modes they don't understand, and because an NTSC
machine may be running a PAL Workbench or PRODUCTIVITY, for example,
the following &#034;false&#034; information is returned.

The Screen.ViewPort.Modes field will either be HIRES or HIRES+LACE
(with the SPRITES flag also set, as usual).  HIRES+LACE is
used if the display mode selected for the Workbench screen
is an interlaced screen of any type.

The dimensions returned will be the *smaller* of the OSCAN_TEXT
dimensions for the returned mode, and the actual dimensions
of the Workbench screen.

EXCEPTION: For specific compatibility considerations, if the
Workbench is in one of the A2024 modes, the mode returned
in Screen.ViewPort.Modes will be HIRES+LACE (with perhaps
some &#034;special&#034; bits also set for future improvement), but
with dimensions equal to the actual A2024-mode Workbench screen.
This will favor programs which open windows on the A2024
Workbench, but will cause some problems for programs which
try to &#034;clone&#034; the Workbench screen using this function.

If you want the real information about the modern Workbench
screen, call LockPubScreen( &#034;Workbench&#034; ) and acquire its
display mode ID by inquiring of the actual [ViewPort](_00B8) (using
[graphics.library/GetVPModeID](../graphics/GetVPModeID) ).

You may then use the information you get to clone as many of
the properties of the Workbench screen that you wish.

In the long run, it's probably better to provide your user
with a screen mode selection option, and skip all this.

**INPUTS**

Buffer = pointer to a buffer into which data can be copied
Size   = the size of the buffer provided, in bytes
Type   = the screen type, as specified in [OpenWindow](OpenWindow) (WBENCHSCREEN,
CUSTOMSCREEN, ...)
[Screen](_00DD) = ignored, unless type is CUSTOMSCREEN, which results only in
copying 'size' bytes from 'screen' to 'buffer'

RESULT
TRUE if successful
FALSE if standard screen of Type 'type' could not be opened.

BUGS
You cannot support the new V36 display modes using this function.

**SEE ALSO**

[OpenWindow](OpenWindow), [LockPubScreen](LockPubScreen), [graphics.library/GetVPModeID](../graphics/GetVPModeID),
[SetPubScreenModes](SetPubScreenModes), [OpenScreen](OpenScreen)
