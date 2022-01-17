
**NAME**

OpenScreenTagList -- [OpenScreen](OpenScreen.md) with [TagItem](_012E.md) extension array. (V36)
OpenScreenTags -- Varargs stub for OpenScreenTagList. (V36)

**SYNOPSIS**

```c
    Screen = OpenScreenTagList( NewScreen, TagItems )
    D0                          A0         A1

    struct Screen *OpenScreenTagList( struct NewScreen *,
            struct TagItem * );

    Screen = OpenScreenTags( NewScreen, Tag1, ... )

    struct Screen *OpenScreenTags( struct NewScreen *,
            ULONG, ... );

```
Links: [Screen](_00DD.md) [NewScreen](_00DD.md) [Screen](_00DD.md) [NewScreen](_00DD.md) [TagItem](_012E.md) [Screen](_00DD.md) [NewScreen](_00DD.md) [Screen](_00DD.md) [NewScreen](_00DD.md) 

**FUNCTION**

Provides an extension to the parameters passed to [OpenScreen](OpenScreen.md).
This extensions is in the form of (a pointer to) an array of
[TagItem](_012E.md) structures, which have to fields: ti_Tag, an ID identifying
the meaning of the other field, ti_Data.  See [&#060;utility/tagitem.h&#062;](_012E.md).

The tag items can supplement or override the values in [NewScreen](_00DD.md).
In fact, you can pass a NULL value of the [NewScreen](_00DD.md) pointer.
For that matter, if you pass NULL in both arguments, you'll get
a screen with defaults in all fields, including display mode,
depth, colors, dimension, title, and so on.  We ask that
you at least supply a title when you open a screen.

See [OpenScreen](OpenScreen.md) documentation for parameter specifications.

**INPUTS**

[NewScreen](_00DD.md)     - (optional) pointer to a [NewScreen](_00DD.md) structure.
TagItems      - (optional) pointer to (an array of) [TagItem](_012E.md)
structures, terminated by the value TAG_END.

RESULT
[Screen](_00DD.md)     - an open Intuition screen.  See [OpenScreen](OpenScreen.md) for
extended error codes when [Screen](_00DD.md) is returned NULL.

EXAMPLE
The version using a variable number of arguments must be
created for each particular compiler, and may not have
an analogue in all versions.  For vanilla, 32-bit C
parameter passing conventions, this works (and will
appear in amiga.lib):

struct [Screen](_00DD.md)      *
OpenScreenTags( ns, tag1 )
struct [NewScreen](_00DD.md)  *ns;
ULONG                   tag1;
{
struct [Screen](_00DD.md)  *OpenScreenTagList();

return ( OpenScreenTagList( ns, (struct [TagItem](_012E.md) *) &#038;tag1 ) );
}

NOTES
We recommend this extension to [OpenScreen](OpenScreen.md) over using the
field ExtNewScreen.Extension.  However, the ExtNewScreen.Extension
is a convenient way to supply a few tags to V36 Intuition which
will be ignored by V34 Intuition.  See [OpenScreen](OpenScreen.md) documentation
for lots of details.

BUGS


**SEE ALSO**

[OpenScreen](OpenScreen.md)
