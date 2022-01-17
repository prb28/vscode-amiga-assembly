
**NAME**

CloseMonitor -- close a [MonitorSpec](_00A7.md) (V36)

**SYNOPSIS**

```c
    error = CloseMonitor( monitor_spec )
      d0                    a0

   LONG CloseMonitor( struct MonitorSpec * );

```
Links: [MonitorSpec](_00A7.md) 

**FUNCTION**

Relinquish access to a [MonitorSpec](_00A7.md).

**INPUTS**

monitor_spec - a pointer to a [MonitorSpec](_00A7.md) opened via [OpenMonitor](OpenMonitor.md)

**RESULTS**

error - FALSE if [MonitorSpec](_00A7.md) closed uneventfully.
TRUE if [MonitorSpec](_00A7.md) could not be closed.

BUGS

**SEE ALSO**

[OpenMonitor](OpenMonitor.md)
