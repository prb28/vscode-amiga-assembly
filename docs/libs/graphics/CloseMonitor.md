
**NAME**

CloseMonitor -- close a [MonitorSpec](_OOAW) (V36)

**SYNOPSIS**

```c
    error = CloseMonitor( monitor_spec )
      d0                    a0

   LONG CloseMonitor( struct MonitorSpec * );

```
Links: [MonitorSpec](_OOAW) 

**FUNCTION**

Relinquish access to a [MonitorSpec](_OOAW).

**INPUTS**

monitor_spec - a pointer to a [MonitorSpec](_OOAW) opened via [OpenMonitor](OpenMonitor)

**RESULTS**

error - FALSE if [MonitorSpec](_OOAW) closed uneventfully.
TRUE if [MonitorSpec](_OOAW) could not be closed.

BUGS

**SEE ALSO**

[OpenMonitor](OpenMonitor)
