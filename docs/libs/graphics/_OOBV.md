```c
#ifndef	GRAPHICS_GFXMACROS_H
#define	GRAPHICS_GFXMACROS_H
/*
**	$Filename: graphics/gfxmacros.h $
**	$Release: 2.04 Includes, V37.4 $
**	$Revision: 37.0 $
**	$Date: 91/01/07 $
**
**
**
**	(C) Copyright 1985-1999 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include &#060;exec/types.h&#062;
#endif

#ifndef  GRAPHICS_RASTPORT_H
#include &#060;graphics/rastport.h&#062;
#endif

#define ON_DISPLAY	custom.dmacon = BITSET|DMAF_RASTER;
#define OFF_DISPLAY	custom.dmacon = BITCLR|DMAF_RASTER;
#define ON_SPRITE	custom.dmacon = BITSET|DMAF_SPRITE;
#define OFF_SPRITE	custom.dmacon = BITCLR|DMAF_SPRITE;

#define ON_VBLANK	custom.intena = BITSET|INTF_VERTB;
#define OFF_VBLANK	custom.intena = BITCLR|INTF_VERTB;

#define SetOPen(w,c)	{(w)-&#062;AOlPen = c;(w)-&#062;Flags |= AREAOUTLINE;}
#define SetDrPt(w,p)	{(w)-&#062;LinePtrn = p;(w)-&#062;Flags |= FRST_DOT;(w)-&#062;linpatcnt=15;}
#define SetWrMsk(w,m)	{(w)-&#062;Mask = m;}
#define SetAfPt(w,p,n)	{(w)-&#062;AreaPtrn = p;(w)-&#062;AreaPtSz = n;}

#define BNDRYOFF(w)	{(w)-&#062;Flags &#038;= ~AREAOUTLINE;}

#define CINIT(c,n)	  UCopperListInit(c,n);
#define CMOVE(c,a,b)	{ CMove(c,&#038;a,b);CBump(c); }
#define CWAIT(c,a,b)	{ CWait(c,a,b);CBump(c); }
#define CEND(c)	{ CWAIT(c,10000,255); }

#define DrawCircle(rp,cx,cy,r)	DrawEllipse(rp,cx,cy,r,r);
#define AreaCircle(rp,cx,cy,r)	AreaEllipse(rp,cx,cy,r,r);

#endif	/* GRAPHICS_GFXMACROS_H */
```
