
**NAME**

UnLockRecords -- Unlock a list of records (V36)

**SYNOPSIS**

```c
    success = UnLockRecords(record_array)
    D0                           D1

    BOOL UnLockRecords(struct RecordLock *)

```
Links: [RecordLock](_0063.md) 

**FUNCTION**

This releases an array of record locks obtained using [LockRecords](LockRecords.md).
You should NOT modify the record_array while you have the records
locked.  Every [LockRecords](LockRecords.md) call must be balanced with an
UnLockRecords() call.

**INPUTS**

record_array - [List](_007D.md) of records to be unlocked

RESULT
success      - Success or failure.

BUGS
See [LockRecord](LockRecord.md)

**SEE ALSO**

[LockRecords](LockRecords.md), [LockRecord](LockRecord.md), [UnLockRecord](UnLockRecord.md)
