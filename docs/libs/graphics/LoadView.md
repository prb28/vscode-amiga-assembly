
**NAME**

LoadView -- Use a (possibly freshly created) coprocessor instruction
list to create the current display.

**SYNOPSIS**

```c
    LoadView( View )
              A1

    void LoadView( struct View * );

```
Links: [View](_00B8.md) [View](_00B8.md) 

**FUNCTION**

Install a new view to be displayed during the next display
refresh pass.
Coprocessor instruction list has been created by
[InitVPort](InitVPort.md), [MakeVPort](MakeVPort.md), and [MrgCop](MrgCop.md).

**INPUTS**

[View](_00B8.md) - a pointer to the [View](_00B8.md) structure which contains the
pointer to the constructed coprocessor instructions list, or NULL.

RESULT
If the [View](_00B8.md) pointer is non-NULL, the new [View](_00B8.md) is displayed,
according to your instructions.  The vertical blank routine
will pick this pointer up and direct the copper to start
displaying this [View](_00B8.md).

If the [View](_00B8.md) pointer is NULL, no [View](_00B8.md) is displayed.

NOTE
Even though a LoadView(NULL) is performed, display DMA will still be
active.  Sprites will continue to be displayed after a LoadView(NULL)
unless an OFF_SPRITE is subsequently performed.

BUGS

**SEE ALSO**

[InitVPort](InitVPort.md) [MakeVPort](MakeVPort.md) [MrgCop](MrgCop.md) [intuition/RethinkDisplay](../intuition/RethinkDisplay.md)
[graphics/view.h](_00B8.md)
