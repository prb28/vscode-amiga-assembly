	IFND	GRAPHICS_LAYERS_I
GRAPHICS_LAYERS_I	=	1
	IFND	EXEC_SEMAPHORES_I
	INCLUDE	exec/semaphores.i
	ENDC
	IFND	EXEC_LISTS_I
	INCLUDE	exec/lists.i
	ENDC
	RSRESET
LayerInfo_extra	RS.B	0
lie_env		RS.B	13*4
lie_mem		RS.B	LH_SIZE
lie_SIZEOF	RS.W	0
LAYERSIMPLE	=	1
LAYERSMART	=	2
LAYERSUPER	=	4
LAYERUPDATING	=	$10
LAYERBACKDROP	=	$40
LAYERREFRESH	=	$80
LAYER_CLIPRECTS_LOST=	$100
LMN_REGION	=	-1
	RSRESET
Layer_Info		RS.B	0
li_top_layer		RS.L	1
li_check_lp		RS.L	1
li_obs			RS.L	1
li_FreeClipRects	RS.B	MLH_SIZE
li_Lock			RS.B	SS_SIZE
li_gs_Head		RS.B	LH_SIZE
li_long_reserved	RS.L	1
li_Flags		RS.W	1
li_fatten_count		RS.B	1
li_LockLayersCount	RS.B	1
li_LayerInfo_extra_size	RS.W	1
li_blitbuff		RS.L	1
li_LayerInfo_extra	RS.L	1
li_SIZEOF		RS.W	0
NEWLAYERINFO_CALLED	=	1
ALERTLAYERSNOMEM	=	$83010000
	ENDC
