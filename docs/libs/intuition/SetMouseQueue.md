
**NAME**

SetMouseQueue -- Change limit on pending mouse messages. (V36)

**SYNOPSIS**

```c
    oldQueueLength = SetMouseQueue( Window, QueueLength )
    D0                              A0      D0

    LONG SetMouseQueue( struct Window *, UWORD );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Changes the number of mouse messages that Intuition will allow
to be outstanding for your window.

**INPUTS**

[Window](_00D4.md) = your window
QueueLength = the new value of outstanding mouse movement messages
you wish to allow.

RESULT
-1 if 'Window' is not known
Otherwise the previous value of the queue limit.
The corresponding function for changing the repeat key
queue limit is not yet implemented.

BUGS

**SEE ALSO**

[OpenWindow](OpenWindow.md)
