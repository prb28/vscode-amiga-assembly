
**NAME**

NewObjectA -- Create an object from a class. (V36)
NewObject -- Varargs stub for NewObjectA(). (V36)

**SYNOPSIS**

```c
    object = NewObjectA( class, classID, tagList )
    D0                   A0     A1       A2

    APTR NewObjectA( struct IClass *, UBYTE *, struct TagItem * );

    object = NewObject( class, classID, Tag1, ... )

    APTR NewObject( struct IClass *, UBYTE *, ULONG, ... );

```
Links: [TagItem](_012E.md) 

**FUNCTION**

This is the general method of creating objects from 'boopsi' classes.
('Boopsi' stands for &#034;basic object-oriented programming system for
Intuition&#034;.)

You specify a class either as a pointer (for a private class) or
by its ID string (for public classes).  If the class pointer
is NULL, then the classID is used.

You further specify initial &#034;create-time&#034; attributes for the
object via a [TagItem](_012E.md) list, and they are applied to the resulting
generic data object that is returned.  The attributes, their meanings,
attributes applied only at create-time, and required attributes
are all defined and documented on a class-by-class basis.

**INPUTS**

class = abstract pointer to a boopsi class gotten via [MakeClass](MakeClass.md).
classID = the name/ID string of a public class.  This parameter is
only used if 'class' is NULL.
tagList = pointer to array of TagItems containing attribute/value
pairs to be applied to the object being created

RESULT
A boopsi object, which may be used in different contexts such
as a gadget or image, and may be manipulated by generic functions.
You eventually free the object using [DisposeObject](DisposeObject.md).

NOTES
This function invokes the OM_NEW &#034;method&#034; for the class specified.

BUGS
Typedef's for 'Object' and 'Class' are defined in the include
files but not used consistently.  The generic type APTR is
probably best used for object and class &#034;handles&#034;, with the
type (UBYTE *) used for classID strings.

**SEE ALSO**

[DisposeObject](DisposeObject.md), SetAttrs(), [GetAttr](GetAttr.md), [MakeClass](MakeClass.md),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
