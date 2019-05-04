
**NAME**

SetPointer -- Specify a pointer sprite image for a window.

**SYNOPSIS**

```c
    SetPointer( Window, Pointer, Height, Width, XOffset, YOffset )
                A0      A1       D0      D1     D2       D3

    VOID SetPointer( struct Window *, UWORD *, WORD, WORD, WORD, WORD );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

Sets up the window with the sprite definition for the pointer.
Then, whenever the window is the active one, the pointer
image will change to the window's version.  If the window is
the active one when this routine is called, the change takes
place immediately.

The XOffset and YOffset parameters are used to offset the
upper-left corner of the hardware sprite image from what Intuition
regards as the current position of the pointer.  Another way of
describing it is as the offset from the &#034;hot spot&#034; of the pointer
to the top-left corner of the sprite.  For instance, if you specify
offsets of zero, zero, then the top-left corner of your sprite
image will be placed at the mouse position.  On the other hand,
if you specify an XOffset of -7 (remember, sprites are 16 pixels
wide) then your sprite will be centered over the mouse position.
If you specify an XOffset of -15, the right-edge of the sprite
will be over the mouse position.

**INPUTS**

[Window](_00D4) = pointer to the window to receive this pointer definition
Pointer = pointer to the data definition of a sprite
Height = the height of the pointer
Width = the width of the sprite (must be less than or equal to sixteen)
XOffset = the offset for your sprite from the mouse position
YOffset = the offset for your sprite from the mouse position

RESULT
None

BUGS

**SEE ALSO**

[ClearPointer](ClearPointer), Intuition Reference Manual or Amiga Rom
Kernel Manual
