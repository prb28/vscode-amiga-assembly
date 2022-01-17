
**NAME**

ScrollVPort -- Reinterpret RasInfo information in [ViewPort](_00B8.md) to reflect
the current Offset values.

**SYNOPSIS**

```c
    ScrollVPort( vp )
                 a0

    void ScrollVPort(struct ViewPort *);

```
Links: [ViewPort](_00B8.md) 

**FUNCTION**

After the programmer has adjusted the Offset values in
the RasInfo structures of [ViewPort](_00B8.md), change the
the copper lists to reflect the the Scroll positions.
Changing the [BitMap](_00A6.md) ptr in RasInfo and not changing the
the Offsets will effect a double buffering affect.

**INPUTS**

vp - pointer to a [ViewPort](_00B8.md) structure
that is currently be displayed.
**RESULTS**

modifies hardware and intermediate copperlists to reflect
new RasInfo

BUGS
pokes not fast enough to avoid some visible hashing of display

**SEE ALSO**

[MakeVPort](MakeVPort.md) [MrgCop](MrgCop.md) [LoadView](LoadView.md)  [graphics/view.h](_00B8.md)
