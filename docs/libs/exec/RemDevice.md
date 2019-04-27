
**NAME**

RemDevice -- remove a device from the system

**SYNOPSIS**

```
    RemDevice(device)
              A1

```
void RemDevice(struct [Device](Device) *);

**FUNCTION**

This function calls the device's EXPUNGE vector, which requests
that a device delete itself.  The device may refuse to do this if
it is busy or currently open. This is not typically called by user
code.

There are certain, limited circumstances where it may be
appropriate to attempt to specifically flush a certain device.
Example:

/* Attempts to flush the named device out of memory. */
#include [&#060;exec/types.h&#062;](&#060;exec/types.h&#062;)
#include [&#060;exec/execbase.h&#062;](&#060;exec/execbase.h&#062;)

void FlushDevice(name)
STRPTR name;
{
struct [Device](Device) *result;

Forbid();
if(result=(struct [Device](Device) *)FindName(&#038;SysBase-&#062;DeviceList,name))
RemDevice(result);
Permit();
}

**INPUTS**

device - pointer to a device node

**SEE ALSO**

[AddLibrary](AddLibrary)
