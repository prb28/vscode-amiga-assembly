
**NAME**

RemoveClass -- Make a public boopsi class unavailable. (V36)

**SYNOPSIS**

```c
    RemoveClass( classPtr )
                 A0

    VOID RemoveClass( struct IClass * );

```
**FUNCTION**

Makes a public class unavailable for public consumption.
It's OK to call this function for a class which is not
yet in the internal public class list, or has been
already removed.

**INPUTS**

ClassPtr = pointer to *public* class created by [MakeClass](MakeClass),
may be NULL.

RESULT
None.

NOTES

BUGS

**SEE ALSO**

[MakeClass](MakeClass), [FreeClass](FreeClass), [AddClass](AddClass)
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
