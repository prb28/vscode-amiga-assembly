
**NAME**

SetAttrsA -- Specify attribute values for an object. (V36)
SetAttrs -- Varargs stub for SetAttrsA(). (V36)

**SYNOPSIS**

```c
    result = SetAttrsA( Object, TagList )
    D0                  A0      A1

    ULONG SetAttrsA( APTR, struct TagItem * );

    result = SetAttrs( Object, Tag1, ... )

    ULONG SetAttrs( APTR, ULONG, ... );

```
Links: [TagItem](_012E) 

**FUNCTION**

Specifies a set of attribute/value pairs with meaning as
defined by a 'boopsi' object's class.

This function does not provide enough context information or
arbitration for boopsi gadgets which are attached to windows
or requesters.  For those objects, use SetGadgetAttrs().

**INPUTS**

Object = abstract pointer to a boopsi object.
TagList = array of [TagItem](_012E) structures with attribute/value pairs.

RESULT
The object does whatever it wants with the attributes you provide.
The return value tends to be non-zero if the changes would require
refreshing gadget imagery, if the object is a gadget.

NOTES
This function invokes the OM_SET method with a NULL [GadgetInfo](_00D2)
parameter.

BUGS

**SEE ALSO**

[NewObject](NewObject), [DisposeObject](DisposeObject), [GetAttr](GetAttr), [MakeClass](MakeClass),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
