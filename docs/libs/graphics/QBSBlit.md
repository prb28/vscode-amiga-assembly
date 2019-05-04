
**NAME**


QBSBlit -- Synchronize the blitter request with the video beam.

**SYNOPSIS**

```c

    QBSBlit( bsp )
             a1

    void QBSBlit( struct bltnode * );

```
Links: [bltnode](_00CC) 

**FUNCTION**

Call a user routine for use of the blitter, enqueued separately from
the [QBlit](QBlit) queue.  Calls the user routine contained in the blit
structure when the video beam is located at a specified position
onscreen.   Useful when you are trying to blit into a visible part
of the screen and wish to perform the data move while the beam is
not trying to display that same area.  (prevents showing part of
an old display and part of a new display simultaneously).  Blitter
requests on the QBSBlit queue take precedence over those on the
regular blitter queue. The beam position is specified the blitnode.

**INPUTS**

bsp - pointer to a blit structure.  See description in the
Graphics Support section of the manual for more info.

RESULT
User routine is called when the QBSBlit queue reaches this
request AND the video beam is in the specified position.
If there are lots of blits going on and the video beam
has wrapped around back to the top it will call all the
remaining bltnodes as fast as it can to try and catch up.

BUGS
Not very smart when getting blits from different tasks.
They all get put in same queue so there are unfortunately
some interdependencies with the beam syncing.

**SEE ALSO**

[QBlit](QBlit) [hardware/blit.h](_00CC)
