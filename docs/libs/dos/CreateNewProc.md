
**NAME**

CreateNewProc -- Create a new process (V36)

**SYNOPSIS**

```c
    process = CreateNewProc(tags)
    D0                       D1

    struct Process *CreateNewProc(struct TagItem *)

    process = CreateNewProcTagList(tags)
    D0                              D1

    struct Process *CreateNewProcTagList(struct TagItem *)

    process = CreateNewProcTags(Tag1, ...)

    struct Process *CreateNewProcTags(ULONG, ...)

```
Links: [Process](_0078.md) [TagItem](_012E.md) [Process](_0078.md) [TagItem](_012E.md) [Process](_0078.md) 

**FUNCTION**

This creates a new process according to the tags passed in.  See
[dos/dostags.h](_006D.md) for the tags.

You must specify one of NP_Seglist or NP_Entry.  NP_Seglist takes a
seglist (as returned by LoadSeg()).  NP_Entry takes a function
pointer for the routine to call.

There are many options, as you can see by examining [dos/dostags.h](_006D.md).
The defaults are for a non-CLI process, with copies of your
[CurrentDir](CurrentDir.md), HomeDir (used for PROGDIR:), priority, consoletask,
windowptr, and variables.  The input and output filehandles default
to opens of NIL:, stack to 4000, and others as shown in dostags.h.
This is a fairly reasonable default setting for creating threads,
though you may wish to modify it (for example, to give a descriptive
name to the process.)

CreateNewProc() is callable from a task, though any actions that
require doing Dos I/O (DupLock() of currentdir, for example) will not
occur.

NOTE: if you call CreateNewProc() with both NP_Arguments, you must
not specify an NP_Input of NULL.  When NP_Arguments is specified, it
needs to modify the input filehandle to make [ReadArgs](ReadArgs.md) work properly.

**INPUTS**

tags - a pointer to a [TagItem](_012E.md) array.

RESULT
process - The created process, or NULL.  Note that if it returns
NULL, you must free any items that were passed in via
tags, such as if you passed in a new current directory
with NP_CurrentDir.

BUGS
In V36, NP_Arguments was broken in a number of ways, and probably
should be avoided (instead you should start a small piece of your
own code, which calls [RunCommand](RunCommand.md) to run the actual code you wish
to run).  In V37, NP_Arguments works, though see the note above.

**SEE ALSO**

[LoadSeg](LoadSeg.md), [CreateProc](CreateProc.md), [ReadArgs](ReadArgs.md), [RunCommand](RunCommand.md), [&#060;dos/dostags.h&#062;](_006D.md)
