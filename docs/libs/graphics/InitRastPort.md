
**NAME**

InitRastPort -- Initialize raster port structure

**SYNOPSIS**

```c
    InitRastPort( rp )
                  a1

    void InitRastPort(struct RastPort *);


```
Links: [RastPort](_OOAF) 

**FUNCTION**

Initialize a [RastPort](_OOAF) structure to standard values.

**INPUTS**

rp = pointer to a [RastPort](_OOAF) structure.

RESULT
all entries in [RastPort](_OOAF) get zeroed out, with the following exceptions:

Mask, FgPen, AOLPen, and LinePtrn are set to -1.
The DrawMode is set to JAM2
The font is set to the standard system font

NOTES
The struct Rastport describes a control structure
for a write-able raster. The [RastPort](_OOAF) structure
describes how a complete single playfield display
will be written into. A [RastPort](_OOAF) structure is
referenced whenever any drawing or filling
operations are to be performed on a section of
memory.

The section of memory which is being used in this
way may or may not be presently a part of the
current actual onscreen display memory. The name
of the actual memory section which is linked to
the [RastPort](_OOAF) is referred to here as a &#034;raster&#034; or
as a bitmap.

NOTE: Calling the routine InitRastPort only
establishes various defaults. It does NOT
establish where, in memory, the rasters are
located. To do graphics with this [RastPort](_OOAF) the user
must set up the [BitMap](_OOAV) pointer in the [RastPort](_OOAF).

BUGS

**SEE ALSO**

[graphics/rastport.h](_OOAF)
