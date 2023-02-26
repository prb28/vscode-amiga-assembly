#ifndef _VBCCINLINE_CIA_H
#define _VBCCINLINE_CIA_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct Interrupt * __AddICRVector(__reg("a6") struct Library * resource, __reg("d0") LONG iCRBit, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-6(a6)";
#define AddICRVector(resource, iCRBit, interrupt) __AddICRVector((resource), (iCRBit), (interrupt))

VOID __RemICRVector(__reg("a6") struct Library * resource, __reg("d0") LONG iCRBit, __reg("a1") struct Interrupt * interrupt)="\tjsr\t-12(a6)";
#define RemICRVector(resource, iCRBit, interrupt) __RemICRVector((resource), (iCRBit), (interrupt))

WORD __AbleICR(__reg("a6") struct Library * resource, __reg("d0") LONG mask)="\tjsr\t-18(a6)";
#define AbleICR(resource, mask) __AbleICR((resource), (mask))

WORD __SetICR(__reg("a6") struct Library * resource, __reg("d0") LONG mask)="\tjsr\t-24(a6)";
#define SetICR(resource, mask) __SetICR((resource), (mask))

#endif /*  _VBCCINLINE_CIA_H  */
