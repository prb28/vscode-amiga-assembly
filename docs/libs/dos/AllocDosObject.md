
**NAME**

AllocDosObject -- Creates a dos object (V36)

**SYNOPSIS**

```c
    ptr = AllocDosObject(type, tags)
    D0                    D1    D2

    void *AllocDosObject(ULONG, struct TagItem *)

    ptr = AllocDosObjectTagList(type, tags)
    D0                           D1    D2

    void *AllocDosObjectTagList(ULONG, struct TagItem *)

    ptr = AllocDosObjectTags(type, Tag1, ...)

    void *AllocDosObjectTags(ULONG, ULONG, ...)

```
Links: [TagItem](_012E.md) [TagItem](_012E.md) 

**FUNCTION**

Create one of several dos objects, initializes it, and returns it
to you.  Note the DOS_STDPKT returns a pointer to the sp_Pkt of the
structure.

**INPUTS**

type - type of object requested
tags - pointer to taglist with additional information

RESULT
packet - pointer to the object or NULL

**SEE ALSO**

[FreeDosObject](FreeDosObject.md), [&#060;dos/dostags.h&#062;](_006D.md), [&#060;dos/dos.h&#062;](_0068.md)
