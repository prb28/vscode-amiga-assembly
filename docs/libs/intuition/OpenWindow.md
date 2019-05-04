
**NAME**

OpenWindow -- Open an Intuition window.

**SYNOPSIS**

```c
    Window = OpenWindow( NewWindow )
    D0                   A0

    struct Window *OpenWindow( struct NewWindow * );

```
Links: [Window](_00D4) [NewWindow](_00D4) [Window](_00D4) [NewWindow](_00D4) 

**FUNCTION**

Opens an Intuition window of the given dimensions and position,
with the properties specified in the [NewWindow](_00D4) structure.
Allocates everything you need to get going.

New for V36: there is an extensive discussion of public Screens
and visitor windows at the end of this section.  Also,
you can provide extensions to the [NewWindow](_00D4) parameters using
and array of [TagItem](_012E) structures.  See the discussion below,
and the documentation for the function [OpenScreenTagList](OpenScreenTagList).

Before you call OpenWindow(), you must initialize an instance of
a [NewWindow](_00D4) structure.  [NewWindow](_00D4) is a structure that contains
all of the arguments needed to open a window.  The [NewWindow](_00D4)
structure may be discarded immediately after it is used to open
the window.

If Type == CUSTOMSCREEN, you must have opened your own screen
already via a call to [OpenScreen](OpenScreen).  Then Intuition uses your screen
argument for the pertinent information needed to get your window
going.  On the other hand, if type == one of the Intuition's standard
screens, your screen argument is ignored.  Instead,
Intuition will check to see whether or not that screen
already exists:  if it doesn't, it will be opened first before
Intuition opens your window in the standard screen.

New for V36: If you specify Type == WBENCHSCREEN, then your
window will appear on the Workbench screen, unless the global
public screen mode SHANGHAI is set, in which case your window
will be &#034;hijacked&#034; to the default public screen.  See also
[SetPubScreenModes](SetPubScreenModes).

New for V36: If the WFLG_NW_EXTENDED flag is set, it means that the
field 'ExtNewWindow-&#062;Extension' points to an array of TagItems, as
defined in intuition/tagitem.h.  This provides an extensible means
of providing extra parameters to OpenWindow.  For compatibility
reasons, we could not add the 'Extension' field to the [NewWindow](_00D4)
structure, so we have define a new structure [ExtNewWindow](_00D4), which
is identical to [NewWindow](_00D4) with the addition of the Extension field.

We recommend that rather than using ExtNewWindow.Extension, you
use the new Intuition function [OpenWindowTagList](OpenWindowTagList) and its
varargs equivalent OpenWindowTags().  We document the window
attribute tag ID's (ti_Tag values) here, rather than in
[OpenWindowTagList](OpenWindowTagList), so that you can find all the parameters
for a new window defined in one place.

If the WFLG_SUPER_BITMAP flag is set, the bitmap variable must point
to your own bitmap.

The DetailPen and the BlockPen are used for system rendering; for
instance, the title bar is first filled using the BlockPen, and then
the gadgets and text are rendered using DetailPen.  You can either
choose to supply special pens for your window, or, by setting either
of these arguments to -1, the screen's pens will be used instead.

Note for V36: The DetailPen and BlockPen no longer determine
what colors will be used for window borders, if your window
opens on a &#034;full-blown new look screen.&#034;

**INPUTS**

[NewWindow](_00D4) = pointer to an instance of a [NewWindow](_00D4) structure.  That
structure is initialized with the following data:
-------------------------------------------------------------------------
Left = the initial x-position for your window
Top = the initial y-position for your window
Width = the initial width of this window
Height = the initial height of this window

DetailPen = pen number (or -1) for the rendering of window details
(like gadgets or text in title bar)
BlockPen = pen number (or -1) for window block fills (like title bar)
[For V36: Title bar colors are determined otherwise.]

Flags = specifiers for your requirements of this window, including:
which system gadgets you want attached to your window:

- WFLG_DRAGBAR allows this window to be dragged
- WFLG_DEPTHGADGET lets the user depth-arrange this window
- WFLG_CLOSEGADGET attaches the standard close gadget
- WFLG_SIZEGADGET allows this window to be sized.

If you ask for the WFLG_SIZEGADGET gadget, you must specify one or
both of the flags WFLG_SIZEBRIGHT and WFLG_SIZEBBOTTOM below; if
you don't, the default is WFLG_SIZEBRIGHT.  See the following items
WFLG_SIZEBRIGHT and WFLG_SIZEBBOTTOM for more details.

- WFLG_SIZEBRIGHT is a special system gadget flag that
you set to specify whether or not you want the
RIGHT border adjusted to account for the physical size
of the sizing gadget.  The sizing gadget must, after
all, take up room in either the right or bottom border
(or both, if you like) of the window.  Setting either
this or the WFLG_SIZEBBOTTOM flag selects which edge
will take up the slack.  This will be particularly
useful to applications that want to use the extra space
for other gadgets (like a proportional gadget and two
Booleans done up to look like scroll bars) or, for
for instance, applications that want every possible
horizontal bit and are willing to lose lines vertically.
NOTE:  if you select WFLG_SIZEGADGET, you must select
either WFLG_SIZEBRIGHT or WFLG_SIZEBBOTTOM or both.  If
you select neither, the default is WFLG_SIZEBRIGHT.
- WFLG_SIZEBBOTTOM is a special system gadget flag that
you set to specify whether or not you want the
BOTTOM border adjusted to account for the physical size
of the sizing gadget.  For details, refer to
WFLG_SIZEBRIGHT above.

- WFLG_GIMMEZEROZERO for easy but expensive output

what type of window layer you want, either:
- WFLG_SIMPLE_REFRESH
- WFLG_SMART_REFRESH
- WFLG_SUPER_BITMAP

- WFLG_BACKDROP for whether or not you want this window to be one
of Intuition's special backdrop windows.  See WFLG_BORDERLESS
as well.

- WFLG_REPORTMOUSE for whether or not you want to &#034;listen&#034; to
mouse movement events whenever your window is the active
one.  After you've opened your window, if you want to change
you can later change the status of this via a call to
[ReportMouse](ReportMouse).  Whether or not your window is listening to
mouse is affected by gadgets too, since they can cause you
to start getting reports too if you like.  The mouse move
reports (either InputEvents or messages on the IDCMP) that
you get will have the x/y coordinates of the current mouse
position, relative to the upper-left corner of your window
(WFLG_GIMMEZEROZERO notwithstanding).  This flag can work in
conjunction with the IDCMP Flag called IDCMP_MOUSEMOVE, which
allows you to listen via the IDCMP.

- WFLG_BORDERLESS should be set if you want a window with no
border padding.  Your window may have the border variables
set anyway, depending on what gadgetry you've requested for
the window, but you won't get the standard border lines and
spacing that comes with typical windows.

This is a good way to take over the entire screen, since you
can have a window cover the entire width of the screen using
this flag.  This will work particularly well in conjunction
with the WFLG_BACKDROP flag (see above), since it allows you
to open a window that fills the ENTIRE screen.  NOTE:  this is
not a flag that you want to set casually, since it may cause
visual confusion on the screen.  The window borders are the
only dependable visual division between various windows and
the background screen.  Taking away that border takes away
that visual cue, so make sure that your design doesn't need
it at all before you proceed.

- WFLG_ACTIVATE is the flag you set if you want this window to
automatically become the active window.  The active
window is the one that receives input from the keyboard and
mouse.  It's usually a good idea to to have the window you
open when your application first starts up be an ACTIVATED
one, but all others opened later not be ACTIVATED (if the
user is off doing something with another screen, for
instance, your new window will change where the input is
going, which would have the effect of yanking the input rug
from under the user).  Please use this flag thoughtfully and
carefully.

Some notes: First, your window may or may not be active
by the time this function returns.  Use the IDCMP_ACTIVEWINDOW
IDCMP message to know when your window has become active.
Also, be very careful not to mistakenly specify the
obsolete flag names WINDOWACTIVE or ACTIVEWINDOW.  These are
used in other contexts, and their values unintentionally added
to your flags can cause most unfortunate results.  To avoid
confusion, they are now know as WFLG_WINDOWACTIVE and
IDCMP_ACTIVEWINDOW.

- WFLG_RMBTRAP, when set, causes the right mouse button events
to be trapped and broadcast as events.  You can receive
these events through either the IDCMP or the console.

- WFLG_NOCAREREFRESH indicates that you do not wish to
be responsible for calling [BeginRefresh](BeginRefresh) and [EndRefresh](EndRefresh)
when your window has exposed regions (i.e., when the
IDCMP_REFRESHWINDOW message would be generated).  See also
the descriptions of these two functions.

- WFLG_NW_EXTENDED (V36) indicates that [NewWindow](_00D4) in fact points
to an [ExtNewWindow](_00D4) structure, and that the 'Extension'
field points to an array of [TagItem](_012E) structures, with
meaning described below.

IDCMPFlags = IDCMP is the acronym for Intuition Direct Communications
[Message](_0099) Port.  (It's Intuition's sole acronym.) If any of the
IDCMP Flags is selected, Intuition will create a pair of
message ports and use them for direct communications with the
task opening this window (as compared with broadcasting
information via the Console device).  See the &#034;Input and
Output Methods&#034; chapter of the Intuition Reference Manual for
complete details.

You request an IDCMP by setting any of these flags.  Except
for the special VERIFY flags, every other flag you set tells
Intuition that if a given event occurs which your program
wants to know about, it is to broadcast the details of that
event through the IDCMP rather than via the Console device.
This allows a program to interface with Intuition directly,
rather than going through the Console device.

Many programs have elected to use IDCMP communication
exclusively, and not to associate a console with their
windows at all.  Some operations, such as IDCMP_MENUVERIFY,
can ONLY be achieved using IDCMP.

The IDCMP flags you can set are:

- IDCMP_REQVERIFY is the flag which, like IDCMP_SIZEVERIFY and ...

- IDCMP_MENUVERIFY (see immediately below), specifies that you
want to make sure that your graphical state is quiescent
before something extraordinary happens.  In this case, the
extraordinary event is that a rectangle of graphical data is
about to be blasted into your [Window](_00D4).  If you're drawing
directly into its screen, you probably will wish to make sure
that you've ceased drawing before the user is allowed to bring
up the DMRequest you've set up, and the same for when system
has a request for the user.  Set this flag to ask for that
verification step.

- IDCMP_REQCLEAR is the flag you set to hear a message whenever
a requester is cleared from your window.  If you are using
IDCMP_REQVERIFY to arbitrate access to your screen's bitmap, it
is safe to start your output once you have heard an
IDCMP_REQCLEAR for each IDCMP_REQSET.

- IDCMP_REQSET is a flag that you set to receive a broadcast
for each requester that is opened in your window.  Compare
this with IDCMP_REQCLEAR above.  This function is distinct
from IDCMP_REQVERIFY.  This functions merely tells you that a
requester has opened, whereas IDCMP_REQVERIFY requires you to
respond before the requester is opened.

- IDCMP_MENUVERIFY is the flag you set to have Intuition stop
and wait for you to finish all graphical output to your
window before rendering the menus.  Menus are currently
rendered in the most memory-efficient way, which involves
interrupting output to all windows in the screen before the
menus are drawn.  If you need to finish your graphical
output before this happens, you can set this flag to make
sure that you do.

- IDCMP_SIZEVERIFY means that you will be doing output to your
window which depends on a knowledge of the current size of the
window.  If the user wants to resize the window,  you may want
to make sure that any queued output completes before the sizing
takes place (critical text, for instance).  If this is the
case, set this flag.   Then, when the user wants to size,
Intuition will send you the IDCMP_SIZEVERIFY message and [Wait](../exec/Wait)
until you reply that it's OK to proceed with the sizing. NOTE:
when we say that Intuition will [Wait](../exec/Wait) until you reply, what
we're really saying is that user will WAIT until you reply, which
suffers the great negative potential of User-Unfriendliness.
So remember:  use this flag sparingly, and, as always with any
IDCMP [Message](_0099) you receive, reply to it promptly!  Then, after
user has sized the window, you can find out about it using
IDCMP_NEWSIZE.

With all the &#034;VERIFY&#034; functions, it is not save to leave them
enabled at any time when your task may not be able to respond
for a long period.

It is NEVER safe to call AmigaDOS, directly or indirectly, when
a &#034;VERIFY&#034; function is active.  If AmigaDOS needs to put up a
disk requester for you, your task might end up waiting for the
requester to be satisfied, at the same time as Intuition is
waiting for your response.  The result is a complete machine
lockup.  USE [ModifyIDCMP](ModifyIDCMP) TO TURN OFF ANY VERIFY MESSAGES
BEFORE CALLING dos.library!!

For V36: If you do not respond to the verification IntuiMessages
within the user specified timeout duration, Intuition will abort
the operation.  This eliminates the threat of these easy
deadlocks, but can result in a confused user.  Please try
hard to continue to avoid &#034;logical deadlocks&#034;.

- IDCMP_NEWSIZE is the flag that tells Intuition to send an IDCMP
message to you after the user has resized your window.  At
this point, you could examine the size variables in your
window structure to discover the new size of the window.
See also the IDCMP_CHANGEWINDOW IDCMP flag.

- IDCMP_REFRESHWINDOW when set will cause a message to be sent
whenever your window needs refreshing.  This flag makes
sense only with WFLG_SIMPLE_REFRESH and WFLG_SMART_REFRESH
windows.

- IDCMP_MOUSEBUTTONS will get reports about mouse-button up/down
events broadcast to you (Note:  only the ones that
don't mean something to Intuition.  If the user clicks the
select button over a gadget, Intuition deals with it and you
don't find out about it through here).

- IDCMP_MOUSEMOVE will work only if you've set the
WFLG_REPORTMOUSE flag above, or if one of your gadgets has the
GACT_FOLLOWMOUSE flag set.  Then all mouse movements will be
reported here, providing your window is active.

- IDCMP_GADGETDOWN means that when the User &#034;selects&#034; a gadget
you've created with the GACT_IMMEDIATE flag set, the fact
will be broadcast through the IDCMP.

- IDCMP_GADGETUP means that when the user &#034;releases&#034; a gadget that
you've created with the GACT_RELVERIFY flag set, the fact
will be broadcast through the IDCMP.  This message is
only generated if the release is &#034;good&#034;, such as releasing
the select button over a Boolean gadget, or typing ENTER
in a string gadget.

- IDCMP_MENUPICK selects that menu number data will be sent via
the IDCMP.

- IDCMP_CLOSEWINDOW means broadcast the IDCMP_CLOSEWINDOW event
through the IDCMP rather than the console.

- IDCMP_RAWKEY selects that all IDCMP_RAWKEY events are
transmitted via the IDCMP.  Note that these are absolutely RAW
keycodes, which you will have to translate before using.
Setting this and the MOUSE flags effectively eliminates the need
to open a Console device to get input from the keyboard and
mouse.  Of course, in exchange you lose all of the console
features, most notably the &#034;cooking&#034; of input data and
the systematic output of text to your window.

- IDCMP_VANILLAKEY is for developers who don't want the hassle
of IDCMP_RAWKEYS.  This flag will return all the keycodes after
translation via the current country-dependent keymap.  When
you set this flag, you will get IntuiMessages where the Code
field has a decoded ANSI character code representing the key
struck on the keyboard.  Only codes that map to a single
character are returned: you can't read such keys as HELP or
the function keys with IDCMP_VANILLAKEY.

NOTE FOR V36: If you have both IDCMP_RAWKEY and IDCMP_VANILLAKEY
set, Intuition will send an IDCMP_RAWKEY event for those
*downstrokes* which do not map to single-byte characters
(&#034;non-vanilla&#034; keys).  In this way you can easily detect cursor
keys, function keys, and the Help key without sacrificing the
convenience of IDCMP_VANILLAKEY.

- IDCMP_INTUITICKS gives you simple timer events from Intuition
when your window is the active one; it may help you avoid
opening and managing the timer device.  With this flag set,
you will get only one queued-up INTUITICKS message at a
time.  If Intuition notices that you've been sent an
IDCMP_INTUITICKS message and haven't replied to it, another
message will not be sent.  Intuition receives timer events and
considers sending you an IDCMP_INTUITICKS message approximately
ten times a second.

- IDCMP_DELTAMOVE gives raw (unscaled) input event delta X/Y
values.  This is so you can detect mouse motion regardless of
screen/window/display boundaries.  This works a little
strangely: if you set both IDCMP_MOUSEMOVE and IDCMP_DELTAMOVE.
IDCMPFlags, you will get IDCMP_MOUSEMOVE messages with delta
x/y values in the MouseX and MouseY fields of the
IDCMPMessage.

- IDCMP_NEWPREFS indicates you wish to be notified when the
system-wide [Preferences](_00D5) changes.  For V36, there is a new
environment mechanism to replace [Preferences](_00D5), which we
recommend you consider using instead.

- Set IDCMP_ACTIVEWINDOW and IDCMP_INACTIVEWINDOW to get messages
when those events happen to your window.  Take care not to
confuse this &#034;ACTIVEWINDOW&#034; with the familiar sounding, but
totally different &#034;WINDOWACTIVE&#034; flag.  These two flags have
been supplanted by &#034;IDCMP_ACTIVEWINDOW&#034; and &#034;WFLG_WINDOWACTIVE&#034;.
Use the new equivalent terms to avoid confusion.

- Set IDCMP_DISKINSERTED or IDCMP_DISKREMOVED to learn when
removable disks are inserted or removed, respectively.

- IDCMP_IDCMPUPDATE is a new class for V36 which is used as
a channel of communication from custom and boopsi gadgets
to your application.

- IDCMP_CHANGEWINDOW is a new class for V36 that will be sent
to your window whenever its dimensions or position are changed
by the user or the functions [SizeWindow](SizeWindow), [MoveWindow](MoveWindow),
[ChangeWindowBox](ChangeWindowBox), or [ZipWindow](ZipWindow).

- IDCMP_MENUHELP is new for V37.  If you specify the WA_MenuHelp
tag when you open your window, then when the user presses the
HELP key on the keyboard during a menu session, Intuition will
terminate the menu session and issue this even in place of an
IDCMP_MENUPICK message.
- NEVER follow the NextSelect link for MENUHELP messages.
- You will be able to hear MENUHELP for ghosted menus.
(This lets you tell the user why the option is ghosted.)
- Be aware that you can receive a MENUHELP message whose code
corresponds to a menu header or an item that has sub-items
(which does not happen for MENUPICK).  The code may also be
MENUNULL.
- LIMITATION:  if the user extend-selects some checkmarked
items with the mouse, then presses MENUHELP, your
application will only hear the MENUHELP report.  You
must re-examine the state of your checkmarks when you
get a MENUHELP.
- Availability of MENUHELP in V36 is not directly
controllable.  We apologize...

Gadgets = the pointer to the first of a linked list of the your own
Gadgets which you want attached to this [Window](_00D4).  Can be NULL
if you have no Gadgets of your own

CheckMark = a pointer to an instance of the struct [Image](_00D4) where can
be found the imagery you want used when any of your
menu items is to be checkmarked.  If you don't want to
supply your own imagery and you want to just use
Intuition's own checkmark, set this argument to NULL

Text = a null-terminated line of text to appear on the title bar of
your window (may be null if you want no text)

Type = the screen type for this window.  If this equal CUSTOMSCREEN,
you must have already opened a CUSTOMSCREEN (see text above).
Types available include:
- WBENCHSCREEN
- CUSTOMSCREEN
- PUBLICSCREEN (new for V36, see text below)

[Screen](_00DD) = if your type is one of Intuition's standard screens, then
this argument is ignored.  However, if Type == CUSTOMSCREEN,
this must point to the structure of your own screen

[BitMap](_00A6) = if you have specified WFLG_SUPER_BITMAP as the type of
refreshing you want for this window, then this value points to a
instance of the struct bitmap.  However, if the refresh type
is NOT WFLG_SUPER_BITMAP, this pointer is ignored.

MinWidth, MinHeight, MaxWidth, MaxHeight = the size limits for this
window.  These must be reasonable values, which is to say that
the minimums cannot be greater than the current size, nor can
the maximums be smaller than the current size.  If they are,
they're ignored.  Any one of these can be initialized to zero,
which means that that limit will be set to the current
dimension of that axis.  The limits can be changed after the
[Window](_00D4) is opened by calling the [WindowLimits](WindowLimits) routine.

NOTE: ORIGINALLY, we stated that:

&#034;If you haven't requested the WFLG_SIZEGADGET option, these
variables are ignored so you don't have to initialize them.&#034;

It is now clear that a variety of programs take it upon
themselves to call [SizeWindow](SizeWindow) (or [ChangeWindowBox](ChangeWindowBox)) without
your program's consent or consulting your WFLG_SIZEGADGE
option.  To protect yourself against the results, we strongly
urge that if you supply suitable values for these fields even
if you do not specify WFLG_SIZEGADGET.

The maximums may be LARGER than the current size, or even
larger than the current screen.  The maximums should be set to
the highest value your application can handle.  This allows
users with larger display devices to take full advantage of
your software.  If there is no good reason to limit the size,
then don't.  -1 or ~0 indicates that the maximum size is only
limited by the size of the window's screen.

See also the docs on the function [WindowLimits](WindowLimits) for more
information.

Extension (New for V36) = a pointer to an array (or chain of arrays)
of TagItems to specify additional parameters to OpenWindow().
TagItems in general are described in [utility/tagitem.h](_012E),
and the OpenWindow tags are defined in [intuition/intuition.h](_00D4)
and described here.  For items pertaining to Public Screens
and visitor windows, please see below.

Here are the TagItem.ti_Tag values that are defined for OpenWindow
(and [OpenWindowTagList](OpenWindowTagList)).

Certain tags simply override equivalent values in [NewWindow](_00D4),
and allow you to open a window using [OpenWindowTagList](OpenWindowTagList) without
having a [NewWindow](_00D4) structure at all.  In each case, cast
the corresponding data to ULONG and put it in ti_Data.

The compatible tag items include:

WA_Left
WA_Top
WA_Width
WA_Height
WA_DetailPen
WA_BlockPen
WA_IDCMP
WA_Flags        - initial values for Flags before looking at other
Boolean component Tag values
WA_Gadgets
WA_Checkmark
WA_Title
WA_CustomScreen - also implies CUSTOMSCREEN property
WA_SuperBitMap - also implies WFLG_SUPER_BITMAP refresh mode.
WA_MinWidth
WA_MinHeight
WA_MaxWidth
WA_MaxHeight

These Boolean tag items are alternatives to the NewWindow.Flags
Boolean attributes with similar names.

WA_SizeGadget           - equivalent to WFLG_SIZEGADGET
WA_DragBar              - equivalent to WFLG_DRAGBAR
WA_DepthGadget          - equivalent to WFLG_DEPTHGADGET
WA_CloseGadget          - equivalent to WFLG_CLOSEGADGET
WA_Backdrop             - equivalent to WFLG_BACKDROP
WA_ReportMouse          - equivalent to WFLG_REPORTMOUSE
WA_NoCareRefresh        - equivalent to WFLG_NOCAREREFRESH
WA_Borderless           - equivalent to WFLG_BORDERLESS
WA_Activate             - equivalent to WFLG_ACTIVATE
WA_RMBTrap              - equivalent to WFLG_RMBTRAP
WA_WBenchWindow         - equivalent to WFLG_WBENCHWINDOW
(system PRIVATE)
WA_SimpleRefresh        - only specify if TRUE
WA_SmartRefresh         - only specify if TRUE
WA_SizeBRight           - equivalent to WFLG_SIZEBRIGHT
WA_SizeBBottom          - equivalent to WFLG_SIZEBBOTTOM
WA_GimmeZeroZero        - equivalent to WFLG_GIMMEZEROZERO

The following tag items specify new attributes of a window.

WA_ScreenTitle - You can specify the screen title associated
with your window this way, and avoid a call to [SetWindowTitles](SetWindowTitles)
when your window opens.

WA_AutoAdjust - a Boolean attribute which says that it's OK
to move or even shrink the dimensions of this window
to fit it on the screen, within the dimension
limits specified by MinWidth and MinHeight.
Someday, this processing might be sensitive to the
currently visible portion of the screen the window
will be opening on, so don't draw too many conclusions
about the auto-adjust algorithms.
(Normally, this attribute defaults to FALSE.  However,
if you call OpenWindowTags() or [OpenWindowTagList](OpenWindowTagList)
with a NULL [NewWindow](_00D4) pointer, this attribute defaults
to TRUE).

WA_InnerWidth
WA_InnerHeight - You can specify the dimensions of the interior
region of your window, independent of what the border
thicknesses will be.  You probably want to specify
WA_AutoAdjust to allow Intuition to move your window
or even shrink it so that it is completely on screen.

Note: using these tags puts some reasonable restrictions
on the gadgets you can specify as &#034;border&#034; gadgets when
you open your window.  Since border gadgets determine
the border dimensions and hence the overall dimensions of
your window, those dimensions cannot be used calculating
the position or dimensions of border gadgets.

Here's the complete list of restrictions:
- GACT_LEFTBORDER gadgets cannot be GFLG_RELWIDTH if
WA_InnerWidth is used.
- GACT_RIGHTBORDER gadgets MUST be GFLG_RELRIGHT if
WA_InnerWidth is used.
- GACT_TOPBORDER gadgets cannot be GFLG_RELHEIGHT if
WA_InnerHeight is used.
- GACT_BOTTOMBORDER gadgets MUST be GFLG_RELBOTTOM if
WA_InnerHeight is used.

WA_PubScreenName - This tag item declares that you want your window
to open as a visitor window on the public screen whose name
is pointed to by (UBYTE *) ti_Data.

WA_PubScreen - Open as a visitor window on the public screen
whose address if provided as (struct [Screen](_00DD) *) ti_Data.
To ensure that this screen remains open long enough, you
must either:
1) Be the screen's owner
2) have another window already open on the screen
3) use [LockPubScreen](LockPubScreen)
Using [exec.library/Forbid](../exec/Forbid) is not sufficient.

You can provide ti_Data to be NULL (zero), without any
of the above precautions, to specify the default public screen.

WA_PubScreenFallBack - This Boolean attribute specifies that a
visitor window should &#034;fall back&#034; to opening on the default
public screen if the explicitly specify public screen is not
available.

WA_WindowName - this visionary specification of a window
rendezvous name string is not yet implemented.

WA_Colors - this equally great idea about associating a palette
specification with the active window may not ever be implemented.

WA_Zoom - ti_Data points to an array of four WORD's to be used
as the initial Left/Top/Width/Height of the &#034;alternate
Zoom position and dimensions.&#034;  The presence of this tag
item implies that you want a Zoom gadget, even though you
might not have a sizing gadget.

WA_MouseQueue - This tag specifies a limit for the number
of outstanding IDCMP_MOUSEMOVE IntuiMessages that Intuition
will send to your window.  You can change the value of this
limit after the window is open using [SetMouseQueue](SetMouseQueue).

WA_RptQueue - This tag specifies a limit for the number of
outstanding repeated-IDCMP_RAWKEY, repeated-IDCMP_VANILLAKEY,
and repeated-IDCMP_IDCMPUPDATE IntuiMessages that Intuition will
send to your window.  Currently, there is no function to adjust
the repeat-key queue.

WA_BackFill - ti_Data is a pointer to a [Hook](_012D) structure that
the Layers library will call when your window needs
&#034;backfilling.&#034;  See [layers.library/InstallLayerHook](../layers/InstallLayerHook).

WA_MenuHelp - ti_Data is a boolean.  If true, enables the MenuHelp
feature for this window.  See IDCMP_MENUHELP above.  (Ignored
in V36 and earlier).

NOTES
Regarding Public Screens, you can specify a window to be a
&#034;visitor window&#034; on a public screen in one of several ways.
In each case, you must be sure not to specify a [NewWindow](_00D4)
type of CUSTOMSCREEN.  You should use the value PUBLICSCREEN.

There are actually several ways you can specify which screen
you want a visitor window to be opened on:

1) Specify the name of the public screen WA_PubScreenName,
or a NULL pointer, in ti_Data.  The name might have been
provided by the user.  A NULL pointer means to use the
default public screen.

If the named screen cannot be found, the default public screen
will be used if the Boolean attribute WA_PubScreenFallBack
is TRUE.

2) Specify a pointer to a public screen using the
WA_PubScreen tag item.  The WA_PubScreenFallBack
attribute has no effect.  You can specify the default
public screen by providing a NULL pointer.

You can also specify the pointer by setting NewWindow.Type
to PUBLICSCREEN, and specifying the public screen pointer
in NewWindow.Screen.  The WA_PubScreen tag item has precedent
over this technique.

Unless NULL, the screen pointer provided MUST be a valid
public screen.  You may ensure this several ways:

- Be the owner of the screen.
- Have a window already open on the screen.
- Use [LockPubScreen](LockPubScreen) to prevent the screen from closing.
- specifying the WFLG_VISITOR bit in NewWindow.Flags is not
supported.

It is anticipated that the last will be the most common method
of opening public screens because you often want to examine
properties of the screen your window will be using in order
to compensate for differences in dimension, depth, and font.

The standard sequence for this method is as follows:
[LockPubScreen](LockPubScreen) - obtain a pointer and a promise
layout window       - adapt your window to the screen you will use
OpenWindow()        - using the pointer you specify
[UnlockPubScreen](UnlockPubScreen)     - once your window is open, you can let go
of the lock on the public screen
... normal window even processing ...
[CloseWindow](CloseWindow).

Regarding &#034;service&#034; windows, such as those opened for a system
requester or file requester associated with a given &#034;client&#034;window.
These windows should NOT be &#034;visitor&#034; windows.  Open them
using NewWindow.Type = CUSTOMSCREEN and NewWindow.Screen
equal to the screen of the client window (window-&#062;WScreen).
You can also use WA_CustomScreen, which has precedence.

This ensures that the requester service window will be allowed to
open on the same screen as the client window, even if that
screen is not a public screen, or has private status.

This has an implication for service/client protocol: when you
pass a window pointer to any system requester routine or
to a routine which creates some other other service window,
you MUST keep your window open until the client window
is closed.

If a requester service will allow a NULL client window, this
should indicate to open the service window on the default public
screen (probably Workbench).  The correct way to get a pointer
to this screen is to call LockPubScreen( NULL ).  In this
case, you want to open as a visitor window, which means you
should use either PUBLICSCREEN or WA_PubScreen, described above.
You should call [UnlockPubScreen](UnlockPubScreen) after your visitor window is open.

As of V36, gadgets in the right and bottom border
(specified with GACT_RIGHTBORDER and GACT_BOTTOMBORDER) only
contribute to the dimensions of the borders if they are also
GFLG_RELRIGHT and GFLG_RELBOTTOM, respectively.

RESULT
If all is well, returns the pointer to your new [Window](_00D4)
If anything goes wrong, returns NULL

BUGS
When you open a window, Intuition will set the font of
the window's [RastPort](_00AF) to the font of the window's screen.
This does not work right for GimmeZeroZero windows: the
BorderRPort [RastPort](_00AF) has the font set correctly, but
Window.RPort is set up with the system default font.
For compatibility reasons, we won't be fixing this problem.

Also, there is a compatibility trick going on with the
default font of your window's [RastPort](_00AF) if the screen's
font is &#034;fancy.&#034;  See the SA_SysFont attribute described
under [OpenScreen](OpenScreen).

Unless you arrange otherwise, each window you open will allocate
a signal for your task from the 16 &#034;user signals.&#034;
If no signal is available, your window will not be able
to be opened.  In early V36 versions and before, Intuition didn't
check this condition, but just left you with an unusable port.

**SEE ALSO**

[OpenWindowTagList](OpenWindowTagList), [OpenScreen](OpenScreen), [ModifyIDCMP](ModifyIDCMP), [SetWindowTitles](SetWindowTitles),
[LockPubScreen](LockPubScreen), [SetDefaultPubScreen](SetDefaultPubScreen), [ZipWindow](ZipWindow),
[layers.library/InstallLayerHook](../layers/InstallLayerHook), [SetPubScreenModes](SetPubScreenModes)
