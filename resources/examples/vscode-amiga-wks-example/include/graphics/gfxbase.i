	IFND	GRAPHICS_GFXBASE_I
GRAPHICS_GFXBASE_I	=	1
	IFND	EXEC_LISTS_I
	INCLUDE	exec/lists.i
	ENDC
	IFND	EXEC_LIBRARIES_I
	INCLUDE	exec/libraries.i
	ENDC
	IFND	EXEC_INTERRUPTS_I
	INCLUDE	exec/interrupts.i
	ENDC
	RSRESET
GfxBase		RS.B	LIB_SIZE
gb_ActiView		RS.L	1
gb_copinit		RS.L	1
gb_cia			RS.L	1
gb_blitter		RS.L	1
gb_LOFlist		RS.L	1
gb_SHFlist		RS.L	1
gb_blthd		RS.L	1
gb_blttl		RS.L	1
gb_bsblthd		RS.L	1
gb_bsblttl		RS.L	1
gb_vbsrv		RS.B	IS_SIZE
gb_timsrv		RS.B	IS_SIZE
gb_bltsrv		RS.B	IS_SIZE
gb_TextFonts		RS.B	LH_SIZE
gb_DefaultFont		RS.L	1
gb_Modes		RS.W	1
gb_VBlank		RS.B	1
gb_Debug		RS.B	1
gb_BeamSync		RS.W	1
gb_system_bplcon0	RS.W	1
gb_SpriteReserved	RS.B	1
gb_bytereserved		RS.B	1
gb_Flags		RS.W	1
gb_BlitLock		RS.W	1
gb_BlitNest		RS.W	1
gb_BlitWaitQ		RS.B	LH_SIZE
gb_BlitOwner		RS.L	1
gb_TOF_WaitQ		RS.B	LH_SIZE
gb_DisplayFlags		RS.W	1
gb_SimpleSprites	RS.L	1
gb_MaxDisplayRow	RS.W	1
gb_MaxDisplayColumn	RS.W	1
gb_NormalDisplayRows	RS.W	1
gb_NormalDisplayColumns	RS.W	1
gb_NormalDPMX		RS.W	1
gb_NormalDPMY		RS.W	1
gb_LastChanceMemory	RS.L	1
gb_LCMptr		RS.L	1
gb_MicrosPerLine	RS.W	1
gb_reserved		RS.B	8
gb_SIZE			RS.W	0
OWNBLITTERn	=	0
QBOWNERn	=	1
QBOWNER		=	1<<QBOWNERn
	ENDC
