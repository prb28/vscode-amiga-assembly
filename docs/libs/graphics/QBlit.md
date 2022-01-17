
**NAME**

QBlit -- Queue up a request for blitter usage

**SYNOPSIS**

```c
    QBlit( bp )
           a1

    void QBlit( struct bltnode * );

```
Links: [bltnode](_00CC.md) 

**FUNCTION**

Link a request for the use of the blitter to the end of the
current blitter queue.  The pointer bp points to a blit structure
containing, among other things, the link information, and the
address of your routine which is to be called when the blitter
queue finally gets around to this specific request.  When your
routine is called, you are in control of the blitter ... it is
not busy with anyone else's requests.  This means that you can
directly specify the register contents and start the blitter.
See the description of the blit structure and the uses of QBlit
in the section titled Graphics Support in the OS Kernel Manual.
Your code must be written to run either in supervisor or user
mode on the 68000.

**INPUTS**

bp - pointer to a blit structure

RESULT
Your routine is called when the blitter is ready for you.
In general requests for blitter usage through this channel are
put in front of those who use the blitter via [OwnBlitter](OwnBlitter.md) and
[DisownBlitter](DisownBlitter.md). However for small blits there is more overhead
using the queuer than Own/Disown Blitter.

BUGS

**SEE ALSO**

[QBSBlit](QBSBlit.md) [hardware/blit.h](_00CC.md)
