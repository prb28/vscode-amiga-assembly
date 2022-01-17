
**NAME**

OpenScreen -- Open an Intuition screen.

**SYNOPSIS**

```c
    Screen = OpenScreen( NewScreen )
    D0                   A0

    struct Screen *OpenScreen( struct NewScreen * );

    or

    struct Screen *OpenScreen( struct ExtNewScreen * );

```
Links: [Screen](_00DD.md) [NewScreen](_00DD.md) [Screen](_00DD.md) [NewScreen](_00DD.md) [Screen](_00DD.md) [ExtNewScreen](_00DD.md) 

**FUNCTION**

Opens an Intuition screen according to the specified parameters
found in the [NewScreen](_00DD.md) structure.

Does all the allocations, sets up the screen structure and all
substructures completely, and links this screen's viewport into
Intuition's [View](_00B8.md) structure.

Before you call OpenScreen(), you must initialize an instance of
a [NewScreen](_00DD.md) structure.  [NewScreen](_00DD.md) is a structure that contains
all of the arguments needed to open a screen.  The [NewScreen](_00DD.md)
structure may be discarded immediately after OpenScreen() returns.

The SHOWTITLE flag is set to TRUE by default when a screen is opened.
To change this, you must call the routine [ShowTitle](ShowTitle.md).

**INPUTS**

[NewScreen](_00DD.md) = pointer to an instance of a [NewScreen](_00DD.md) structure.

New for V36:
In addition to the information contained in the [NewScreen](_00DD.md) structure,
Intuition now recognizes extended data passed in the form
of an array of [TagItem](_012E.md) structures (from [&#060;utility/tagitem.h&#062;](_012E.md)),
commonly called a &#034;tag list.&#034;

There are two ways to provide this array.  The first is to
use the new Intuition entry point [OpenScreenTagList](OpenScreenTagList.md) and
pass the tag list as a parameter.  This is the recommended
method, and has a convenient format variation for C programs
using a variable number of arguments.

An older way used for some V36 development uses the OpenScreen()
entry point, and an extension of the [NewScreen](_00DD.md) structure named
[ExtNewScreen](_00DD.md).  See the documentation of the flag NS_EXTENDED,
below.

While we recommend that you use [OpenScreenTagList](OpenScreenTagList.md) rather than
OpenScreen() when using the extension tag list, we document
the tag ID values here, so that all parameters for opening
a screen can be found in one place.

[NewScreen](_00DD.md) is initialized with the following information:
-------------------------------------------------------------
Left = initial x-position of your screen (should be zero for
releases prior to V36)

Top = initial y-position of the opening screen
(Note: Left and Top are specified relative to the Intuition's view,
in same resolution as the screen pixels.)

Width = the width for this screen's [RastPort](_00AF.md)

Height = the height for his screen's [RastPort](_00AF.md), or the constant
STDSCREENHEIGHT to get the current default height (at
this time guaranteed to be at least 200 rows).  The normal
width and height for a particular system is stored by
the graphics.library in GfxBase-&#062;NormalDisplayRows and
GfxBase-&#062;NormalDisplayColumns.  These values will be different
depending on factors such as PAL video and overscan.

For V36, a new constant STDSCREENWIDTH is introduced.  It
serves the similar function for screen width.  Both
STDSCREENWIDTH and STDSCREENHEIGHT indicate that your
screen [RastPort](_00AF.md) is to be the same dimensions as your
DisplayClip rectangle.  If you do not specify either a
standard or custom DisplayClip, the OSCAN_TEXT region
will be used, which corresponds to the standard dimensions
of V35 and earlier.

Furthermore, if you are using [OpenScreenTagList](OpenScreenTagList.md), and you
specify STDSCREENWIDTH, and you DO NOT provide a [NewScreen](_00DD.md)
pointer, and you DO NOT provide SA_Left, then Intuition
will automatically set the LeftEdge of the screen to
be the left edge of the screen's DisplayClip region.
Likewise for STDSCREENHEIGHT and the screen's TopEdge.

Depth = number of bitplanes

DetailPen = pen number for details (like gadgets or text in title bar)
The common value for this pen is 0.

BlockPen = pen number for block fills (like title bar)
The common value for this pen is 1.

Type = screen type values
Set these flags as desired from the set:
CUSTOMSCREEN -- this is your own screen, not a system screen.
CUSTOMBITMAP -- this custom screen has bit maps supplied
in the bitmap field of the [NewScreen](_00DD.md) structure.  Intuition is
not to allocate any raster bitmaps.
SCREENBEHIND -- your screen will be created behind all other open
screens.  This allows a program to prepare imagery in the
screen, change its colors, and so on, bringing it to the
front when it is presentable.
SCREENQUIET -- Intuition will not render system screen gadgets or
screen title.  In concert with the WFLG_RMBTRAP flag on all
your screen's windows, this flag will prevent Intuition from
rendering into your screen's bitplanes.  Without WFLG_RMBTRAP
(or using the IDCMP_MENUVERIFY facility to cancel menu
operations), this flag will prevent Intuition from clearing
your menu bar, which is probably unacceptable.  The menu bar
layer may still overwrite  a portion of your screen bitmap
when the screen is opened.  (V36: it won't clobber your bits
any more.)
NS_EXTENDED for this screen to use extended attributes pointed
to by the 'Extended' field, below.

ViewModes = the appropriate argument for the data type ViewPort.Modes.
These include:
HIRES for this screen to be HIRES width.
INTERLACE for the display to switch to interlace.
SPRITES for this screen to use sprites (the pointer
sprite is always displayed)
DUALPF for dual-playfield mode (not supported yet)
[For V36: The ViewModes field is superceded by a [TagItem](_012E.md) with
tag value SA_DisplayID.]

Font = pointer to the default [TextAttr](_00A8.md) structure for text in this
screen and all windows that open in this screen.  Text that uses
this [TextAttr](_00A8.md) includes title bars of both screen and windows,
string gadgets, and menu titles.  Of course, [IntuiText](_00D4.md) that
specifies a NULL [TextAttr](_00A8.md) field will use the screen/window default
fonts.  NOTE: Intuition will *NOT* call [OpenDiskFont](../diskfont/OpenDiskFont.md), so
the [TextAttr](_00A8.md) you supply must be in memory.  The ways to ensure
that are to either use a ROM font (Topaz 8 or 9) or first
call [OpenDiskFont](../diskfont/OpenDiskFont.md) to load the font, and don't close it
until after your screen is successfully opened.
[For V36: this is superceded by SA_Font and SA_SysFont.]

DefaultTitle = pointer to a line of text that will be displayed along
the screen's title bar.  Null terminated, or just a NULL pointer
to get no text
[For V36: superceded by SA_Title.]

Gadgets = This field should be set to NULL, since no user gadgets may
be attached to a screen with the current versions of Intuition.

CustomBitMap = if you're not supplying a custom bitmap, this value is
ignored.  However, if you have your own display memory that you
want used for this screen, the CustomBitMap field should point to
the [BitMap](_00A6.md) structure that describes your display memory.  See the
&#034;Screens&#034; chapter and the &#034;Amiga ROM Kernel Manual&#034; for more
information about bitmaps.
[For V36: this is superceded by SA_BitMap.]

[ All [TagItem](_012E.md) extensions below are new for V36.]
Extension = if NS_EXTENDED is set in NewScreen.Type, this pointer
should point to an array (or chain of arrays) of TagItems,
as defined in the include file [&#060;utility/tagitem.h&#062;](_012E.md).   This
field is only defined in the structure [ExtNewScreen](_00DD.md).
The values to use for TagItem.ti_Tag are defined below.  We
recommend that V36-specific applications use the new Intuition
entry point [OpenScreenTagList](OpenScreenTagList.md), rather than using this field.
The [ExtNewScreen](_00DD.md) structure is a convenient way to give V36
Intuition some information that V34 and earlier Intuition will
ignore.

Each [TagItem](_012E.md) is an optional tagged data structure which identifies
an additional parameter to OpenScreen().  The applicable tag ID
values for TagItem.ti_Tag and their corresponding data follow.

Several of the tag items are alternative (and overriding) versions
to familiar fields in [NewScreen](_00DD.md).  They are:

SA_Left
SA_Top
SA_Width
SA_Height
SA_Depth
SA_DetailPen
SA_BlockPen
SA_Title
SA_Font
SA_Type
SA_BitMap (whose existence also implies CUSTOMBITMAP).

Several tags are Booleans, which means that depending on whether
their corresponding ti_Data field is zero (FALSE) or non-zero
(TRUE), they specify Boolean attributes.  The ones corresponding
to Boolean flags in the NewScreen.Type field are:

SA_ShowTitle
SA_Behind (equiv. to SCREENBEHIND)
SA_Quiet (equiv. to SCREENQUIET)

The following tags provide extended information to Intuition
when creating a screen:

SA_DisplayID: ti_Data is a 32-bit extended display mode ID
as defined in [&#060;graphics/displayinfo.h&#062;](_00BD.md)

SA_Overscan: ti_Data contains a defined constant specifying
one of the system standard overscan dimensions appropriate for
the display mode of the screen.  Used with the Width and
Height dimensions STDSCREENWIDTH and STDSCREEN, this makes
it trivial to open an overscanned or standard dimension
screen.  You may also hand-pick your various dimensions
for overscanned or other screens, by specifying screen position
and dimensions explicitly, and by using SA_DClip to explicitly
specify an overscanned DisplayClip region.

The values for ti_Data of this tag are as follows:

OSCAN_TEXT - Text Overscan region.  A region which is completely
on screen and readable (&#034;text safe&#034;).  A preferences data
setting, this is backward equivalent with the old MoreRows,
and specifies the DisplayClip and default dimensions of the
Workbench screen.  This is the default.

OSCAN_STANDARD - Also a preferences setting, this specifies
a rectangle whose edges are &#034;just out of view.&#034;  This yields
the most efficient position and dimensions of on-monitor
presentations, such as games and artwork.

OSCAN_MAX - This is the largest rectangular region that the
graphics library can handle &#034;comfortably&#034; for a given mode.
Screens can smoothly scroll (hardware pan) within this region,
and any DisplayClip or [Screen](_00DD.md) region within this rectangle
is also legal.  It is not a preferences item, but reflects
the limits of the graphics hardware and software.

OSCAN_VIDEO - This is the largest region that the graphics
library can display, comfortable or not.  There is no guarantee
that all smaller rectangles are valid.  This region is
typically out of sight on any monitor or TV, but provides our
best shot at &#034;edge-to-edge&#034; video generation.

[Remember](_00D4.md), using overscan drastically effects memory use and
chip memory bandwidth.  Always use the smallest (standard)
overscan region that works for your application.

SA_DClip: ti_Data is a pointer to a rectangle which explicitly
defines a DisplayClip region for this screen.  See [QueryOverscan](QueryOverscan.md)
for the role of the DisplayClip region.

Except for overscan display screens, this parameter is
unnecessary, and specifying a standard value using SA_Overscan
is normally an easier way to get overscan.

SA_AutoScroll: this is a Boolean tag item, which specifies that
this screens is to scroll automatically when the mouse pointer
reaches the edge of the screen.  The operation of this requires
that the screen dimensions be larger than its DisplayClip
region.

SA_PubName: If this field is present (and ti_Data is non-NULL),
it means that the screen is a public screen, and that
the public screen name string is pointed to by ti_Data.
Public screens are opened in &#034;PRIVATE&#034; mode and must
be made public using [PubScreenStatus](PubScreenStatus.md).

SA_Pens: The ti_Data field (if non-NULL) points to a UWORD
array of pen specification, as defined for struct [DrawInfo](_00DD.md).
This array will be used to initialize the screen's
DrawInfo.dri_Pens array.

SA_Pens is also used to decide that a screen is ready
to support the full-blown &#034;new look&#034; graphics.  If you
want the 3D embossed look, you must provide this tag,
and the ti_Data value cannot be NULL.  If it points
to a &#034;minimal&#034; array, containing just the terminator ~0,
you can specify &#034;new look&#034; without providing any values
for the pen array.

The following two tag items specify the task and signal to be issued
to notify when the last &#034;visitor&#034; window closes on a public screen.
This support is to assist envisioned public screen manager programs.

SA_PubTask:  [Task](_008E.md) to be signalled.  If absent (and SA_PubSig is
valid), use the task which called OpenScreen() or
[OpenScreenTagList](OpenScreenTagList.md)).

SA_PubSig:  Data is a UBYTE signal number (not flag) used to notify
a task when the last visitor window closes on a public screen.

SA_Colors: ti_Data points to an array of [ColorSpec](_00D4.md) structures
(terminated with ColorIndex = -1) which specify initial
values of the screen's color palette.

SA_FullPalette: this is a Boolean attribute.  Prior to V36, there
were just 7 RGB color values that Intuition maintained
in its user preferences (playfield colors 0-3, and colors
17-19 for the sprite).  When opening a screen, the color
map for the screens viewport is first initialized by
graphics <a href="../Includes_and_Autodocs_2._guide/node0445.html">(graphics.library/GetColorMap()) then these
seven values are overridden to take the preferences values.

In V36, Intuition maintains a full set of 32 preferences colors.
If you specify TRUE for SA_FullPalette, Intuition will
override ALL color map entries with its full suite of
preferred colors.

SA_ErrorCode: ti_Data points to a ULONG in which Intuition will
stick an extended error code if OpenScreen[TagList](.md) fails.
Values are of this include 0, for success, and:
OSERR_NOMONITOR     - monitor for display mode not available.
OSERR_NOCHIPS       - you need newer custom chips for display mode.
OSERR_NOMEM         - couldn't get normal memory
OSERR_NOCHIPMEM     - couldn't get chip memory
OSERR_PUBNOTUNIQUE  - public screen name already used
OSERR_UNKNOWNMODE   - don't recognize display mode requested

NOTE: These values are not the same as some similar return
values defined in [graphics.library/ModeNotAvailable](../graphics/ModeNotAvailable.md).

SA_SysFont: ti_Data selects one of the system standard fonts
specified in preferences.  This tag item overrides the
NewScreen.Font field and the SA_Font tag item.

Values recognized in ti_Data at present are:
0 - old DefaultFont, fixed-width, the default.
1 - Workbench screen preferred font.  You have to
be very font sensitive to handle a proportional or
larger than traditional screen font.

NOTE WELL: if you select sysfont 1, windows opened on
your screen will not inherit the screen font, but rather
the window [RastPort](_00AF.md) will be initialized to the old-style
DefaultFont (sysfont 0).

RESULT
If all is well, returns the pointer to your new screen
If anything goes wrong, returns NULL, with further error
specification in the variable pointed to by the SA_ErrorCode
data field (V36 and later).

NOTE
By default, AmigaDOS requesters related to your process are put on
the Workbench screen (these are messages like &#034;Disk Full&#034;).  If
you wish them to show up on custom screens, DOS must be told.
This fragment shows the procedure.  More information is available
in the AmigaDOS manuals.  Sample code fragment:

#include &#034;libraries/dosextens.h&#034;
...
struct [Process](_0078.md) *process;
struct [Window](_00D4.md)   *window;
APTR            temp;
...
process = (struct [Process](_0078.md) *) FindTask(NULL);
temp = process-&#062;pr_WindowPtr;   (save old value)
process-&#062;pr_WindowPtr = (APTR) window;
( use a pointer to any open window on your screen )
...
your code goes here
...
process-&#062;pr_WindowPtr = temp;
( restore value BEFORE [CloseWindow](CloseWindow.md) )
CloseWindow(window);

BUGS

**SEE ALSO**

[OpenScreenTagList](OpenScreenTagList.md), [OpenWindow](OpenWindow.md), [PrintIText](PrintIText.md), [CloseScreen](CloseScreen.md),
[QueryOverscan](QueryOverscan.md) [PubScreenStatus](PubScreenStatus.md), The Intuition Reference Manual,
[utility/tagitem.h](_012E.md), [graphics.library/ModeNotAvailable](../graphics/ModeNotAvailable.md),
[diskfont.library/OpenDiskFont](../diskfont/OpenDiskFont.md), [graphics.library/GetColorMap](../graphics/GetColorMap.md)
