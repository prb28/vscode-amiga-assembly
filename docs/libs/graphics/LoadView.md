
**NAME**

LoadView -- Use a (possibly freshly created) coprocessor instruction
list to create the current display.

**SYNOPSIS**

```c
    LoadView( View )
              A1

    void LoadView( struct View * );

```
Links: [View](_OOBX) [View](_OOBX) 

**FUNCTION**

Install a new view to be displayed during the next display
refresh pass.
Coprocessor instruction list has been created by
[InitVPort](InitVPort), [MakeVPort](MakeVPort), and [MrgCop](MrgCop).

**INPUTS**

[View](_OOBX) - a pointer to the [View](_OOBX) structure which contains the
pointer to the constructed coprocessor instructions list, or NULL.

RESULT
If the [View](_OOBX) pointer is non-NULL, the new [View](_OOBX) is displayed,
according to your instructions.  The vertical blank routine
will pick this pointer up and direct the copper to start
displaying this [View](_OOBX).

If the [View](_OOBX) pointer is NULL, no [View](_OOBX) is displayed.

NOTE
Even though a LoadView(NULL) is performed, display DMA will still be
active.  Sprites will continue to be displayed after a LoadView(NULL)
unless an OFF_SPRITE is subsequently performed.

BUGS

**SEE ALSO**

[InitVPort](InitVPort) [MakeVPort](MakeVPort) [MrgCop](MrgCop) [intuition/RethinkDisplay](_ORTB)
[graphics/view.h](_OOBX)
