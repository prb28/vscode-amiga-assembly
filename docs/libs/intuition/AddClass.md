
**NAME**

AddClass -- Make a public class available (V36)

**SYNOPSIS**

```c
    AddClass( Class )
              A0

    VOID AddClass( struct IClass * );

```
**FUNCTION**

Adds a public boopsi class to the internal list of classes available
for public consumption.

You must call this function after you call [MakeClass](MakeClass).

**INPUTS**

Class = pointer returned by [MakeClass](MakeClass)

RESULT
Nothing returned.

NOTES

BUGS
Although there is some protection against creating classes
with the same name as an existing class, this function
does not do any checking or other dealings with like-named
classes.  Until this is rectified, only officially registered
names can be used for public classes, and there is no
&#034;class replacement&#034; policy in effect.

**SEE ALSO**

[MakeClass](MakeClass), [FreeClass](FreeClass), [RemoveClass](RemoveClass)
Document &#034;Basic Object-Oriented Programming System for Intuition&#034;
and the &#034;boopsi Class Reference&#034; document.
