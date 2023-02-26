#ifndef _VBCCINLINE_COLORWHEEL_H
#define _VBCCINLINE_COLORWHEEL_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __ConvertHSBToRGB(__reg("a6") void *, __reg("a0") struct ColorWheelHSB * hsb, __reg("a1") struct ColorWheelRGB * rgb)="\tjsr\t-30(a6)";
#define ConvertHSBToRGB(hsb, rgb) __ConvertHSBToRGB(ColorWheelBase, (hsb), (rgb))

VOID __ConvertRGBToHSB(__reg("a6") void *, __reg("a0") struct ColorWheelRGB * rgb, __reg("a1") struct ColorWheelHSB * hsb)="\tjsr\t-36(a6)";
#define ConvertRGBToHSB(rgb, hsb) __ConvertRGBToHSB(ColorWheelBase, (rgb), (hsb))

#endif /*  _VBCCINLINE_COLORWHEEL_H  */
