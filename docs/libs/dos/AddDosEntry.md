
**NAME**

AddDosEntry -- Add a Dos [List](_007D) entry to the lists (V36)

**SYNOPSIS**

```c
    success = AddDosEntry(dlist)
    D0                     D1

    LONG AddDosEntry(struct DosList *)

```
Links: [DosList](_0078) 

**FUNCTION**

Adds a device, volume or assign to the dos devicelist.  Can fail if it
conflicts with an existing entry (such as another assign to the same
name or another device of the same name).  Volume nodes with different
dates and the same name CAN be added, or with names that conflict with
devices or assigns.  Note: the dos list does NOT have to be locked to
call this.  Do not access dlist after adding unless you have locked the
Dos [Device](_0087) list.

An additional note concerning calling this from within a handler:
in order to avoid deadlocks, your handler must either be multi-
threaded, or it must attempt to lock the list before calling this
function.  The code would look something like this:

if (AttemptLockDosList(LDF_xxx|LDF_WRITE))
{
rc = AddDosEntry(...);
UnLockDosList(LDF_xxx|LDF_WRITE);
}

If [AttemptLockDosList](AttemptLockDosList) fails (i.e. it's locked already), check for
messages at your filesystem port (don't wait!) and try the
[AttemptLockDosList](AttemptLockDosList) again.

**INPUTS**

dlist   - [Device](_0087) list entry to be added.

RESULT
success - Success/Failure indicator

**SEE ALSO**

[RemDosEntry](RemDosEntry), [FindDosEntry](FindDosEntry), [NextDosEntry](NextDosEntry), [LockDosList](LockDosList),
[MakeDosEntry](MakeDosEntry), [FreeDosEntry](FreeDosEntry), [AttemptLockDosList](AttemptLockDosList)
