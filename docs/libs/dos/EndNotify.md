
**NAME**

EndNotify -- Ends a notification request (V36)

**SYNOPSIS**

```c
    EndNotify(notifystructure)
                    D1

    VOID EndNotify(struct NotifyRequest *)

```
Links: [NotifyRequest](_006E) 

**FUNCTION**

Removes a notification request.  Safe to call even if [StartNotify](StartNotify)
failed.  For NRF_SEND_MESSAGE, it searches your port for any messages
about the object in question and removes and replies them before
returning.

**INPUTS**

notifystructure - a structure passed to [StartNotify](StartNotify)

**SEE ALSO**

[StartNotify](StartNotify), [&#060;dos/notify.h&#062;](_006E)
