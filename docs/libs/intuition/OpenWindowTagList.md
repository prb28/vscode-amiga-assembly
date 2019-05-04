
**NAME**

OpenWindowTagList -- [OpenWindow](OpenWindow) with [TagItem](_012E) extension. (V36)
OpenWindowTags -- Varargs stub for OpenWindowTagList (V36)

**SYNOPSIS**

```c
    Window = OpenWindowTagList( NewWindow, TagItems )
    D0                          A0         A1

    struct Window *OpenWindowTagList( struct NewWindow *,
            struct TagItem * );

    Window = OpenWindowTags( NewWindow, Tag1, ... )

    struct Window *OpenWindowTags( struct NewWindow *, ULONG, ... );

```
Links: [Window](_00D4) [NewWindow](_00D4) [Window](_00D4) [NewWindow](_00D4) [TagItem](_012E) [Window](_00D4) [NewWindow](_00D4) [Window](_00D4) [NewWindow](_00D4) 

**FUNCTION**

A variation of [OpenWindow](OpenWindow) that allow direct specification of
a [TagItem](_012E) array of extension data.  Recommended over using the
ExtNewWindow.Extension field.

If you omit the [NewWindow](_00D4) (pass NULL), a set of defaults
are used, and overridden by the tag items.  Even without
any tag items at all, a reasonable window opens on the Workbench
or default public screen.

See [OpenWindow](OpenWindow) for all the details.

**INPUTS**

[NewWindow](_00D4) - (optional) pointer to a [NewWindow](_00D4) structure.
TagItems - (optional) pointer to [TagItem](_012E) array, with tag
values as described under the description for
[OpenWindow](OpenWindow).

RESULT
[Window](_00D4) - newly created window, per your specifications.

EXAMPLE
See [OpenScreenTagList](OpenScreenTagList) for an example of how to create
a &#034;varargs&#034; version of this function for convenient C
language programming.

NOTES


BUGS


**SEE ALSO**

[OpenWindow](OpenWindow)
