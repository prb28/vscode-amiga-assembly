/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct timerequest */
#ifndef DEVICES_TIMER_H
#include <devices/timer.h>
#endif

extern struct Library *TimerBase;
void AddTime(struct timerequest *, struct timerequest *);
void SubTime(struct timerequest *, struct timerequest *);
long CmpTime(struct timerequest *, struct timerequest *);
