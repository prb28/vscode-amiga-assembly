
**NAME**

GetAttr -- Inquire the value of some attribute of an object. (V36)

**SYNOPSIS**

```c
    attr = GetAttr( AttrID, Object, StoragePtr )
    D0              D0      A0      A1

    ULONG GetAttr( ULONG, APTR, ULONG * );

```
**FUNCTION**

Inquires from the specified object the value of the specified
attribute.

You always pass the address of a long variable, which will
receive the same value that would be passed to SetAttrs() in
the ti_Data portion of a [TagItem](_012E.md) element.  See the documentation
for the class for exceptions to this general rule.

Not all attributes will respond to this function.  Those that
will are documented on a class-by-class basis.

**INPUTS**

AttrID = the attribute tag ID understood by the object's class
Object = abstract pointer to the boopsi object you are interested in
StoragePtr = pointer to appropriate storage for the answer

RESULT
Returns FALSE (0) if the inquiries of attribute are not provided
by the object's class.

NOTES
This function invokes the OM_GET method of the object.

BUGS

**SEE ALSO**

[NewObject](NewObject.md), [DisposeObject](DisposeObject.md), SetAttrs(), [MakeClass](MakeClass.md),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
