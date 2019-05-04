
**NAME**

NextObject -- iterate through the object on an Exec list. (V36)

**SYNOPSIS**

```c
    object = NextObject( objectPtrPtr )
    D0                   A0

    APTR NextObject( APTR );

```
**FUNCTION**

This function is for boopsi class implementors only.

When you collect a set of boopsi objects on an Exec [List](_007D)
structure by invoking their OM_ADDMEMBER method, you
can (only) retrieve them by iterations of this function.

Works even if you remove and dispose the returned list
members in turn.

**INPUTS**

Initially, you set a pointer variable to equal the
lh_Head field of the list (or mlh_Head field of a MinList).
You pass the *address* of that pointer repeatedly
to NextObject() until it returns NULL.

EXAMPLE

/* here is the OM_DISPOSE case of some class's dispatcher */
case OM_DISPOSE:
/* dispose members  */
object_state = mydata-&#062;md_CollectionList.lh_Head;
while ( member_object = NextObject( &#038;object_state ) )
{
DoMethod( member_object, OM_REMOVE ); /* remove from list */
DM( member, msg );      /* and pass along dispose       */
}

RESULT
Returns pointers to each object in the list in turn, and NULL
when there are no more.

NOTES

BUGS

**SEE ALSO**

[DisposeObject](DisposeObject), SetAttrs(), [GetAttr](GetAttr), [MakeClass](MakeClass),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
