	IFND	GRAPHICS_GFX_I
GRAPHICS_GFX_I	=	1
BITSET	=	$8000
BITCLR	=	0
AGNUS	=	1
DENISE	=	1
	RSRESET
BitMap		RS.B	0
bm_BytesPerRow	RS.W	1
bm_Rows		RS.W	1
bm_Flags	RS.B	1
bm_Depth	RS.B	1
bm_Pad		RS.W	1
bm_Planes	RS.B	8*4
bm_SIZEOF	RS.W	0
	RSRESET
Rectangle	RS.B	0
ra_MinX		RS.W	1
ra_MinY		RS.W	1
ra_MaxX		RS.W	1
ra_MaxY		RS.W	1
ra_SIZEOF	RS.W	0
	ENDC
