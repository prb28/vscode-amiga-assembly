
**NAME**

LockRecords -- Lock a series of records (V36)

**SYNOPSIS**

```c
    success = LockRecords(record_array,timeout)
    D0                       D1           D2

    BOOL LockRecords(struct RecordLock *,ULONG)

```
Links: [RecordLock](_0063.md) 

**FUNCTION**

This locks several records within a file for exclusive access.
Timeout is how long to wait in ticks for the records to be available.
The wait is applied to each attempt to lock each record in the list.
It is recommended that you always lock a set of records in the same
order to reduce possibilities of deadlock.

The array of [RecordLock](_0063.md) structures is terminated by an entry with
rec_FH of NULL.

**INPUTS**

record_array - [List](_007D.md) of records to be locked
timeout      - Timeout interval.  0 is legal

RESULT
success      - Success or failure

BUGS
See [LockRecord](LockRecord.md)

**SEE ALSO**

[LockRecord](LockRecord.md), [UnLockRecord](UnLockRecord.md), [UnLockRecords](UnLockRecords.md)
