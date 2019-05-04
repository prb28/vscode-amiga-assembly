
**NAME**

OpenMonitor -- open a named [MonitorSpec](_00A7) (V36)

**SYNOPSIS**

```c
    mspc = OpenMonitor( monitor_name , display_id)
     d0                  a1              d0

    struct MonitorSpec *OpenMonitor( char *, ULONG );

```
Links: [MonitorSpec](_00A7) 

**FUNCTION**

Locate and open a named [MonitorSpec](_00A7).

**INPUTS**

monitor_name - a pointer to a null terminated string.
display_id - an optional 32 bit monitor/mode identifier

**RESULTS**

mspc - a pointer to an open [MonitorSpec](_00A7) structure.
NULL if [MonitorSpec](_00A7) could not  be opened.

NOTE
if monitor_name is non-NULL, the monitor will be opened by name.
if monitor_name is NULL the monitor will be opened by optional ID.
if both monitor_name and display_id are NULL returns default monitor.

BUGS

**SEE ALSO**

[CloseMonitor](CloseMonitor) [graphics/monitor.h](_00A7)
