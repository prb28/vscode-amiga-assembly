	IFND	GRAPHICS_REGIONS_I
GRAPHICS_REGIONS_I	=	1
	IFND	GRAPHICS_GFX_I
	INCLUDE	graphics/gfx.i
	ENDC
	RSRESET
Region			RS.B	0
rg_bounds		RS.B	ra_SIZEOF
rg_RegionRectangle	RS.L	1
rg_SIZEOF		RS.W	0
	RSRESET
RegionRectangle		RS.B	0
rr_Next			RS.L	1
rr_Prev			RS.L	1
rr_bounds		RS.B	ra_SIZEOF
rr_SIZEOF		RS.W	0
	ENDC
