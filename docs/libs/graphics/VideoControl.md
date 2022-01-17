
**NAME**

VideoControl -- Modify the operation of a ViewPort's [ColorMap](_00B8.md) (V36)

**SYNOPSIS**

```c
    error = VideoControl( cm , tags )
    d0                    a0   a1

    ULONG VideoControl( struct ColorMap *, struct TagItem * );

```
Links: [ColorMap](_00B8.md) [TagItem](_012E.md) 

**FUNCTION**

[Process](_0078.md) the commands in the VideoControl command [TagItem](_012E.md) buffer
using cm as the target, with respect to its &#034;attached&#034; [ViewPort](_00B8.md).

viewport commands:

VTAG_ATTACH_CM     [_SET        | _GET] -- setget attached viewport
VTAG_VIEWPORTEXTRA [_SET        | _GET] -- setget attached vp_extra
VTAG_NORMAL_DISP   [_SET        | _GET] -- setget DisplayInfoHandle
(natural mode)
VTAG_COERCE_DISP   [_SET        | _GET] -- setget DisplayInfoHandle
(coerced mode)

genlock commands:

VTAG_BORDERBLANK   [_SET | _CLR | _GET] -- onoffinquire blanking
VTAG_BORDERNOTRANS [_SET | _CLR | _GET] -- onoffinquire notransparency
VTAG_CHROMAKEY     [_SET | _CLR | _GET] -- onoffinquire chroma mode
VTAG_BITPLANEKEY   [_SET | _CLR | _GET] -- onoffinquire bitplane mode
VTAG_CHROMA_PEN    [_SET | _CLR | _GET] -- setclrget chromakey pen #
VTAG_CHROMA_PLANE  [_SET |      | _GET] -- setget bitplanekey plane #

copper commands

VTAG_USERCLIP      [_SET | _CLR | _GET] -- onoffinquire clipping of
UserCopperList at bottom
edge of ColorMap-&#062;cm_vp
(defaults to off)

buffer commands:

VTAG_NEXTBUF_CM                         -- link to more VTAG commands
VTAG_END_CM                             -- terminate command buffer

batch mode commands:

(if you want your videocontol taglist to be processed in &#034;batch&#034;
mode, that is, at the next [MakeVPort](MakeVPort.md) for the ColorMap-&#062;cm_vp;
you may intall a static list of videocontrol TagItems into the
[ColorMap](_00B8.md) with the BATCH_ITEMS_SET command; and then enable/disable
batch mode processing of those items via the BATCH_CM control
command)

VTAG_BATCH_CM      [_SET | _CLR | _GET] -- onoffinquire batch mode
VTAG_BATCH_ITEMS   [_SET | _ADD | _GET] -- setaddget batched TagLists

private commands (used internally by intuition -- do not call):

VTAG_VPMODEID      [_SET | _CLR | _GET] -- force [GetVPModeID](GetVPModeID.md) return


**INPUTS**

cm   = pointer to struct [ColorMap](_00B8.md) obtained via [GetColorMap](GetColorMap.md).
tags = pointer to a table of videocontrol tagitems.

RESULT
error = NULL if no error occured in the control operation.
(non-NULL if bad colormap pointer, no tagitems or bad tag)

The operating characteristics of the [ColorMap](_00B8.md) and its attached
[ViewPort](_00B8.md) are modified. The result will be incorporated into the
[ViewPort](_00B8.md) when its copper lists are reassembled via [MakeVPort](MakeVPort.md).

BUGS

**SEE ALSO**

[graphics/videocontrol.h](_00B0.md), [GetColorMap](GetColorMap.md), [FreeColorMap](FreeColorMap.md)
