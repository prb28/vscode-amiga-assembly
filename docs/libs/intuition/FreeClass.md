
**NAME**

FreeClass -- Frees a boopsi class created by [MakeClass](MakeClass). (V36)

**SYNOPSIS**

```c
    success = FreeClass( ClassPtr )
    D0                   A0

    BOOL FreeClass( struct IClass * );

```
**FUNCTION**

For class implementors only.

Tries to free a boopsi class created by [MakeClass](MakeClass).  This
won't always succeed: classes with outstanding objects or
with subclasses cannot be freed.  You cannot allow the code
which implements the class to be unloaded in this case.

For public classes, this function will *always* remove
the class (see [RemoveClass](RemoveClass) ) making it unavailable, whether
it succeeds or not.

If you have a dynamically allocated data for your class (hanging
off of cl_UserData), try to free the class before you free the
user data, so you don't get stuck with a half-freed class.

**INPUTS**

ClassPtr - pointer to a class created by [MakeClass](MakeClass).

RESULT
Returns FALSE if the class could not be freed.  Reasons include,
but will not be limited to, having non-zero cl_ObjectCount or
cl_SubclassCount.

Returns TRUE if the class could be freed.

Calls [RemoveClass](RemoveClass) for the class in either case.

EXAMPLE
Freeing a private class with dynamically allocated user data:

freeMyClass( cl )
struct IClass   *cl;
{
struct MyPerClassData       *mpcd;

mpcd = (struct MyPerClassData *) cl-&#062;cl_UserData;
if ( FreeClass( cl ) )
{
FreeMem( mpcd, sizeof mpcd );
return ( TRUE );
}
else
{
return ( FALSE );
}
}

BUGS

**SEE ALSO**

[MakeClass](MakeClass),
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
