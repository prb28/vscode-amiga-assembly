#ifndef _VBCCINLINE_CGXSYSTEM_H
#define _VBCCINLINE_CGXSYSTEM_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct Region * __InstallTransparentRegion(__reg("a6") void *, __reg("a0") SLayer SLayer, __reg("a1") struct Region * Region)="\tjsr\t-84(a6)";
#define InstallTransparentRegion(SLayer, Region) __InstallTransparentRegion(CGXSystemBase, (SLayer), (Region))

struct Hook * __InstallTransparentRegionHook(__reg("a6") void *, __reg("a0") SLayer SLayer, __reg("a1") struct Hook * Hook)="\tjsr\t-90(a6)";
#define InstallTransparentRegionHook(SLayer, Hook) __InstallTransparentRegionHook(CGXSystemBase, (SLayer), (Hook))

ULONG __HideWindow(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-96(a6)";
#define HideWindow(Window) __HideWindow(CGXSystemBase, (Window))

ULONG __ShowWindow(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-102(a6)";
#define ShowWindow(Window) __ShowWindow(CGXSystemBase, (Window))

#endif /*  _VBCCINLINE_CGXSYSTEM_H  */
