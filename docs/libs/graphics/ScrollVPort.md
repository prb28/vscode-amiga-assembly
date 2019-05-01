
**NAME**

ScrollVPort -- Reinterpret RasInfo information in [ViewPort](_OOBX) to reflect
the current Offset values.

**SYNOPSIS**

```c
    ScrollVPort( vp )
                 a0

    void ScrollVPort(struct ViewPort *);

```
Links: [ViewPort](_OOBX) 

**FUNCTION**

After the programmer has adjusted the Offset values in
the RasInfo structures of [ViewPort](_OOBX), change the
the copper lists to reflect the the Scroll positions.
Changing the [BitMap](_OOAV) ptr in RasInfo and not changing the
the Offsets will effect a double buffering affect.

**INPUTS**

vp - pointer to a [ViewPort](_OOBX) structure
that is currently be displayed.
**RESULTS**

modifies hardware and intermediate copperlists to reflect
new RasInfo

BUGS
pokes not fast enough to avoid some visible hashing of display

**SEE ALSO**

[MakeVPort](MakeVPort) [MrgCop](MrgCop) [LoadView](LoadView)  [graphics/view.h](_OOBX)
