
**NAME**

CloseMonitor -- close a [MonitorSpec](_00A7) (V36)

**SYNOPSIS**

```c
    error = CloseMonitor( monitor_spec )
      d0                    a0

   LONG CloseMonitor( struct MonitorSpec * );

```
Links: [MonitorSpec](_00A7) 

**FUNCTION**

Relinquish access to a [MonitorSpec](_00A7).

**INPUTS**

monitor_spec - a pointer to a [MonitorSpec](_00A7) opened via [OpenMonitor](OpenMonitor)

**RESULTS**

error - FALSE if [MonitorSpec](_00A7) closed uneventfully.
TRUE if [MonitorSpec](_00A7) could not be closed.

BUGS

**SEE ALSO**

[OpenMonitor](OpenMonitor)
