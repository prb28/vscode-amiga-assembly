
**NAME**

SetGadgetAttrsA -- Specify attribute values for a boopsi gadget. (V36)
SetGadgetAttrs -- Varargs stub for SetGadgetAttrsA(). (V36)

**SYNOPSIS**

```c
    result = SetGadgetAttrsA( Gadget, Window, Requester, TagList )
    D0                        A0      A1      A2         A3

    ULONG SetGadgetAttrsA( struct Gadget *, struct Window *,
            struct Requester *, struct TagItem * );

    result = SetGadgetAttrs( Gadget, Window, Requester, Tag1, ...)

    ULONG SetGadgetAttrs( struct Gadget *, struct Window *,
            struct Requester *, ULONG, ... );

```
Links: [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) [TagItem](_012E.md) [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) 

**FUNCTION**

Same as SetAttrs(), but provides context information and
arbitration for classes which implement custom Intuition gadgets.

You should use this function for boopsi gadget objects which have
already been added to a requester or a window, or for &#034;models&#034; which
propagate information to gadget already added.

Typically, the gadgets will refresh their visuals to reflect
changes to visible attributes, such as the value of a slider,
the text in a string-type gadget, the selected state of a button.

You can use this as a replacement for SetAttrs(), too, if you
specify NULL for the 'Window' and 'Requester' parameters.

**INPUTS**

[Gadget](_00D4.md) = abstract pointer to a boopsi gadget
[Window](_00D4.md) = window gadget has been added to using [AddGList](AddGList.md) or
[AddGadget](AddGadget.md)
[Requester](_00D4.md) = for REQGADGETs, requester containing the gadget
TagList = array of [TagItem](_012E.md) structures with attribute/value pairs.

RESULT
The object does whatever it wants with the attributes you provide,
which might include updating its gadget visuals.

The return value tends to be non-zero if the changes would require
refreshing gadget imagery, if the object is a gadget.

NOTES
This function invokes the OM_SET method with a [GadgetInfo](_00D2.md)
derived from the 'Window' and 'Requester' pointers.

BUGS
There should be more arbitration between this function and
the calls that Intuition's input task will make to the
gadgets.  In the meantime, this function, input processing,
and refreshing must be mutually re-entrant.

**SEE ALSO**

[NewObject](NewObject.md), [DisposeObject](DisposeObject.md), [GetAttr](GetAttr.md), [MakeClass](MakeClass.md),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
