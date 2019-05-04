
**NAME**

LockDosList -- Locks the specified Dos Lists for use (V36)

**SYNOPSIS**

```c
    dlist = LockDosList(flags)
    D0                   D1

    struct DosList *LockDosList(ULONG)

```
Links: [DosList](_0078) 

**FUNCTION**

Locks the dos device list in preparation to walk the list.
If the list is 'busy' then this routine will not return until it is
available.  This routine &#034;nests&#034;: you can call it multiple times, and
then must unlock it the same number of times.  The dlist
returned is NOT a valid entry: it is a special value.  Note that
for 1.3 compatibility, it also does a [Forbid](../exec/Forbid) - this will probably
be removed at some future time.  The 1.3 [Forbid](../exec/Forbid) locking of this
list had some race conditions.  The pointer returned by this is NOT
an actual [DosList](_0078) pointer - you should use on of the other DosEntry
calls to get actual pointers to [DosList](_0078) structures (such as
[NextDosEntry](NextDosEntry)), passing the value returned by LockDosList()
as the dlist value.

Note for handler writers: you should never call this function with
LDF_WRITE, since it can deadlock you (if someone has it read-locked
and they're trying to send you a packet).  Use [AttemptLockDosList](AttemptLockDosList)
instead, and effectively busy-wait with delays for the list to be
available.  The other option is that you can spawn a process to
add the entry safely.

As an example, here's how you can search for all volumes of a specific
name and do something with them:

2.0 way:

dl = LockDosList(LDF_VOLUMES|LDF_READ);
while (dl = FindDosEntry(dl,name,LDF_VOLUMES))
{
Add to list of volumes to process or break out of
the while loop.
(You could try using it here, but I advise
against it for compatability reasons if you
are planning on continuing to examine the list.)
}

process list of volumes saved above, or current entry if
you're only interested in the first one of that name.

UnLockDosList();  /* must not use dl after this! */

1.3/2.0 way:

if (version &#062;= 36)
dl = LockDosList(LDF_VOLUMES|LDF_READ);
else {
Forbid();
/* tricky! note dol_Next is at offset 0! */
dl = &#038;(...-&#062;di_DeviceList);
}

while (version &#062;= 36 ?
dl = FindDosEntry(dl,name,LDF_VOLUMES) :
dl = yourfindentry(dl,name,DLT_VOLUME))
{
Add to list of volumes to process, or break out of
the while loop.
Do NOT lock foo1/foo2 here if you will continue
to examine the list - it breaks the forbid
and the list may change on you.
}

process list of volumes saved above, or current entry if
you're only interested in the first one of that name.

if (version &#062;= 36)
UnLockDosList();
else
Permit();
/* must not use dl after this! */
...

struct [DosList](_0078) *
yourfindentry (struct [DosList](_0078) *dl, STRPTRname, type)
{
/* tricky - depends on dol_Next being at offset 0,
and the initial ptr being a ptr to di_DeviceList! */
while (dl = dl-&#062;dol_Next)
{
if (dl-&#062;dol_Type == type &#038;&#038;
stricmp(name,BADDR(dl-&#062;dol_Name)+1) == 0)
{
break;
}
}
return dl;
}

**INPUTS**

flags - Flags stating which types of nodes you want to lock.

RESULT
dlist - Pointer to the head of the list.  NOT a valid node!

**SEE ALSO**

[AttemptLockDosList](AttemptLockDosList), [UnLockDosList](UnLockDosList), [Forbid](../exec/Forbid), [NextDosEntry](NextDosEntry)
