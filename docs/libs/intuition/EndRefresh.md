
**NAME**

EndRefresh -- End the optimized refresh state of the window.

**SYNOPSIS**

```c
    EndRefresh( Window, Complete )
                A0      D0

    VOID EndRefresh( struct Window *, BOOL );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

This function gets you out of the special refresh state of your
window.  It is called following a call to [BeginRefresh](BeginRefresh), which
routine puts you into the special refresh state.  While your window
is in the refresh state, the only rendering that will be wrought in
your window will be to those areas which were recently revealed and
need to be refreshed.

After you've done all the refreshing you want to do for this window,
you should call this routine to restore the window to its
non-refreshing state.  Then all rendering will go to the entire
window, as usual.

The 'Complete' argument is a boolean TRUE or FALSE value used to
describe whether or not the refreshing you've done was all the
refreshing that needs to be done at this time.  Most often, this
argument will be TRUE.  But if, for instance, you have multiple
tasks or multiple procedure calls which must run to completely
refresh the window, then each can call its own Begin/EndRefresh()
pair with a Complete argument of FALSE, and only the last calls
with a Complete argument of TRUE.

WARNING:  Passing this function the value of FALSE has its
pitfalls.  Please see the several caveats in the autodoc for
[BeginRefresh](BeginRefresh).

For your information, this routine calls the Layers library function
[EndUpdate](_0396), unlocks your layers (calls [UnlockLayerRom](../graphics/UnlockLayerRom)), clears
the LAYERREFRESH bit in your [Layer](_00A1) Flags, and clears the
WFLG_WINDOWREFRESH bit in your window Flags.

**INPUTS**

[Window](_00D4) = pointer to the window currently in optimized-refresh mode
Complete = Boolean TRUE or FALSE describing whether or not this
window is completely refreshed

RESULT
None

BUGS

**SEE ALSO**

[BeginRefresh](BeginRefresh), [layers.library/EndUpdate](../layers/EndUpdate),
[graphics.library/UnlockLayerRom](../graphics/UnlockLayerRom)
