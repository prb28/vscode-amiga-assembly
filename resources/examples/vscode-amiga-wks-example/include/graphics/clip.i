	IFND	GRAPHICS_CLIP_I
GRAPHICS_CLIP_I	=	1
	IFND	GRAPHICS_GFX_I
	INCLUDE	graphics/gfx.i
	ENDC
	IFND	EXEC_SEMAPHORES_I
	INCLUDE	exec/semaphores.i
	ENDC
NEWLOCKS	=	1
	RSRESET
Layer		RS.B	0
lr_front	RS.L	1
lr_back		RS.L	1
lr_ClipRect	RS.L	1
lr_rp		RS.L	1
lr_MinX		RS.W	1
lr_MinY		RS.W	1
lr_MaxX		RS.W	1
lr_MaxY		RS.W	1
lr_reserved	RS.B	4
lr_priority	RS.W	1
lr_Flags	RS.W	1
lr_SuperBitMap	RS.L	1
lr_SuperClipRect	RS.L	1
lr_Window	RS.L	1
lr_Scroll_X	RS.W	1
lr_Scroll_Y	RS.W	1
lr_cr		RS.L	1
lr_cr2		RS.L	1
lr_crnew	RS.L	1
lr_SuperSaverClipRects	RS.L	1
lr__cliprects	RS.L	1
lr_LayerInfo	RS.L	1
lr_Lock		RS.B	SS_SIZE
lr_reserved3	RS.B	8
lr_ClipRegion	RS.L	1
lr_saveClipRects	RS.L	1
lr_reserved2	RS.B	22
lr_DamageList	RS.L	1
lr_SIZEOF	RS.W	0
	RSRESET
ClipRect	RS.B	0
cr_Next		RS.L	1
cr_prev		RS.L	1
cr_lobs		RS.L	1
cr_BitMap	RS.L	1
cr_MinX		RS.W	1
cr_MinY		RS.W	1
cr_MaxX		RS.W	1
cr_MaxY		RS.W	1
cr__p1		RS.L	1
cr__p2		RS.L	1
cr_reserved	RS.L	1
cr_Flags	RS.L	1
cr_SIZEOF	RS.W	0
CR_NEEDS_NO_CONCEALED_RASTERS	=	1
ISLESSX	=	1
ISLESSY	=	2
ISGRTRX	=	4
ISGRTRY	=	8
	IFND	lr_Front
lr_Front=	lr_front
lr_Back	=	lr_back
lr_RastPort=	lr_rp
cr_Prev	=	cr_prev
cr_LObs	=	cr_lobs
	ENDC
	ENDC
