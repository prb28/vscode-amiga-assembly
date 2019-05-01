
**NAME**

UnLockRecord -- Unlock a record (V36)

**SYNOPSIS**

```c
    success = UnLockRecord(fh,offset,length)
    D0                     D1   D2     D3

    BOOL UnLockRecord(BPTR,ULONG,ULONG)

```
**FUNCTION**

This releases the specified lock on a file.  Note that you must use
the same filehandle you used to lock the record, and offset and length
must be the same values used to lock it.  Every [LockRecord](LockRecord) call must
be balanced with an UnLockRecord() call.

**INPUTS**

fh      - File handle of locked file
offset  - Record start position
length  - Length of record in bytes

RESULT
success - Success or failure.

BUGS
See [LockRecord](LockRecord)

**SEE ALSO**

[LockRecords](LockRecords), [LockRecord](LockRecord), [UnLockRecords](UnLockRecords)
