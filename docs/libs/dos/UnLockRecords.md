
**NAME**

UnLockRecords -- Unlock a list of records (V36)

**SYNOPSIS**

```c
    success = UnLockRecords(record_array)
    D0                           D1

    BOOL UnLockRecords(struct RecordLock *)

```
Links: [RecordLock](_0063) 

**FUNCTION**

This releases an array of record locks obtained using [LockRecords](LockRecords).
You should NOT modify the record_array while you have the records
locked.  Every [LockRecords](LockRecords) call must be balanced with an
UnLockRecords() call.

**INPUTS**

record_array - [List](_007D) of records to be unlocked

RESULT
success      - Success or failure.

BUGS
See [LockRecord](LockRecord)

**SEE ALSO**

[LockRecords](LockRecords), [LockRecord](LockRecord), [UnLockRecord](UnLockRecord)
