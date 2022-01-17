
**NAME**

DisposeObject -- Deletes a 'boopsi' object. (V36)

**SYNOPSIS**

```c
    DisposeObject( Object )
                   A0

    VOID DisposeObject( APTR );

```
**FUNCTION**

Deletes a boopsi object and all of it auxiliary data.
These objects are all created by [NewObject](NewObject.md).  Objects
of certain classes &#034;own&#034; other objects, which will also
be deleted when the object is passed to DisposeObject().
Read the per-class documentation carefully to be aware
of these instances.

**INPUTS**

Object = abstract pointer to a boopsi object returned by [NewObject](NewObject.md)

NOTES
This function invokes the OM_DISPOSE method.

RESULT
None.

BUGS

**SEE ALSO**

[NewObject](NewObject.md), SetAttrs(), [GetAttr](GetAttr.md), [MakeClass](MakeClass.md),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
