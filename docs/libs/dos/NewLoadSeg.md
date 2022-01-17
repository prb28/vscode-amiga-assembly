
**NAME**

NewLoadSeg -- Improved version of [LoadSeg](LoadSeg.md) for stacksizes (V36)

**SYNOPSIS**

```c
    seglist = NewLoadSeg(file, tags)
    D0                    D1    D2

    BPTR NewLoadSeg(STRPTR, struct TagItem *)

    seglist = NewLoadSegTagList(file, tags)
    D0                           D1    D2

    BPTR NewLoadSegTagList(STRPTR, struct TagItem *)

    seglist = NewLoadSegTags(file, ...)

    BPTR NewLoadSegTags(STRPTR, ...)

```
Links: [TagItem](_012E.md) [TagItem](_012E.md) 

**FUNCTION**

Does a [LoadSeg](LoadSeg.md) on a file, and takes additional actions based on the
tags supplied.

Clears unused portions of Code and Data hunks (as well as BSS hunks).
(This also applies to [InternalLoadSeg](InternalLoadSeg.md) and [LoadSeg](LoadSeg.md)).

NOTE to overlay users: NewLoadSeg() does NOT return seglist in
both D0 and D1, as [LoadSeg](LoadSeg.md) does.  The current ovs.asm uses [LoadSeg](LoadSeg.md),
and assumes returns are in D1.  We will support this for [LoadSeg](LoadSeg.md)
ONLY.

**INPUTS**

file - Filename of file to load
tags - pointer to tagitem array

RESULT
seglist - Seglist loaded, or NULL

BUGS
No tags are currently defined.

**SEE ALSO**

[LoadSeg](LoadSeg.md), [UnLoadSeg](UnLoadSeg.md), [InternalLoadSeg](InternalLoadSeg.md), [InternalUnLoadSeg](InternalUnLoadSeg.md)
