
**NAME**

ClipBlit  --  Calls [BltBitMap](BltBitMap) after accounting for windows

**SYNOPSIS**

```c
    ClipBlit(Src, SrcX, SrcY, Dest, DestX, DestY, XSize, YSize, Minterm)
             A0   D0    D1    A1    D2     D3     D4     D5     D6

    void ClipBlit
         (struct RastPort *, WORD, WORD, struct RastPort *, WORD, WORD,
          WORD, WORD, UBYTE);

```
Links: [RastPort](_00AF) [RastPort](_00AF) 

**FUNCTION**

Performs the same function as [BltBitMap](BltBitMap), except that it
takes into account the Layers and ClipRects of the layer library,
all of which are (and should be) transparent to you.  So, whereas
[BltBitMap](BltBitMap) requires pointers to BitMaps, ClipBlit requires pointers to
the RastPorts that contain the Bitmaps, Layers, etcetera.

If you are going to blit blocks of data around via the [RastPort](_00AF) of your
Intuition [Window](_00D4), you must call this routine (rather than [BltBitMap](BltBitMap)).

Either the Src [RastPort](_00AF), the Dest [RastPort](_00AF), both, or neither, can have
Layers. This routine takes care of all cases.

See [BltBitMap](BltBitMap) for a thorough explanation.

**INPUTS**

Src          = pointer to the [RastPort](_00AF) of the source for your blit
SrcX, SrcY   = the topleft offset into Src for your data
Dest         = pointer to the [RastPort](_00AF) to receive the blitted data
DestX, DestY = the topleft offset into the destination [RastPort](_00AF)
XSize        = the width of the blit
YSize        = the height of the blit
Minterm      = the boolean blitter function, where SRCB is
associated with the Src [RastPort](_00AF) and SRCC goes to the
Dest [RastPort](_00AF)

RESULT

BUGS

**SEE ALSO**

BltBitMap();
