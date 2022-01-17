
**NAME**

MrgCop -- Merge together coprocessor instructions.

**SYNOPSIS**

```c
    MrgCop( View )
            A1

    void MrgCop( struct View * );

```
Links: [View](_00B8.md) [View](_00B8.md) 

**FUNCTION**

Merge together the display, color, sprite and user coprocessor
instructions into a single coprocessor instruction stream.  This
essentially creates a per-display-frame program for the coprocessor.
This function MrgCop is used, for example, by the graphics animation
routines which effectively add information into an essentially
static background display.  This changes some of the user
or sprite instructions, but not those which have formed the
basic display in the first place.  When all forms of coprocessor
instructions are merged together, you will have a complete per-
frame instruction list for the coprocessor.

Restrictions:  Each of the coprocessor instruction lists MUST be
internally sorted in min to max Y-X order.  The merge routines
depend on this! Each list must be terminated using CEND(copperlist).

**INPUTS**

[View](_00B8.md) - a pointer to the view structure whose coprocessor
instructions are to be merged.

RESULT
The view structure will now contain a complete, sorted/merged
list of instructions for the coprocessor, ready to be used by
the display processor.  The display processor is told to use
this new instruction stream through the instruction [LoadView](LoadView.md).

BUGS

**SEE ALSO**

[InitVPort](InitVPort.md) [MakeVPort](MakeVPort.md) [LoadView](LoadView.md) [graphics/view.h](_00B8.md)
[intuition.library/RethinkDisplay](../intuition/RethinkDisplay.md)
