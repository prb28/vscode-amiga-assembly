	IFND	GRAPHICS_VIEW_I
GRAPHICS_VIEW_I	=	1
	IFND	GRAPHICS_GFX_I
	INCLUDE	graphics/gfx.i
	ENDC
	IFND	GRAPHICS_COPPER_I
	INCLUDE	graphics/copper.i
	ENDC
V_PFBA	=	$40
V_DUALPF=	$400
V_HIRES	=	$8000
V_LACE	=	4
V_HAM	=	$800
V_SPRITES=	$4000
GENLOCK_VIDEO=	2
	RSRESET
ColorMap	RS.B	0
cm_Flags	RS.B	1
cm_Type		RS.B	1
cm_Count	RS.W	1
cm_ColorTable	RS.L	1
cm_SIZEOF	RS.W	0
	rsreset
ViewPort	RS.B	0
vp_Next		RS.L	1
vp_ColorMap	RS.L	1
vp_DspIns	RS.L	1
vp_SprIns	RS.L	1
vp_ClrIns	RS.L	1
vp_UCopIns	RS.L	1
vp_DWidth	RS.W	1
vp_DHeight	RS.W	1
vp_DxOffset	RS.W	1
vp_DyOffset	RS.W	1
vp_Modes	RS.W	1
vp_reserved	RS.W	1
vp_RasInfo	RS.L	1
vp_SIZEOF	RS.W	0
	RSRESET
View		RS.B	0
v_ViewPort	RS.L	1
v_LOFCprList	RS.L	1
v_SHFCprList	RS.L	1
v_DyOffset	RS.W	1
v_DxOffset	RS.W	1
v_Modes		RS.W	1
v_SIZEOF	RS.W	0
	RSRESET
collTable	RS.B	0
cp_collPtrs	RS.L	1
cp_SIZEOF	RS.W	0
	RSRESET
RasInfo		RS.B	0
ri_Next		RS.L	1
ri_BitMap	RS.L	1
ri_RxOffset	RS.W	1
ri_RyOffset	RS.W	1
ri_SIZEOF	RS.W	0
	ENDC
