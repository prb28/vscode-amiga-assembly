	IFND	GRAPHICS_RASTPORT_I
GRAPHICS_RASTPORT_I	=	1
	IFND	GRAPHICS_GFX_I
	INCLUDE	graphics/gfx.i
	ENDC
	RSRESET
TmpRas		RS.B	0
tr_RasPtr	RS.L	1
tr_Size		RS.L	1
tr_SIZEOF	RS.W	0
	RSRESET
GelsInfo	RS.B	0
gi_sprRsrvd	RS.B	1
gi_Flags	RS.B	1
gi_gelHead	RS.L	1
gi_gelTail	RS.L	1
gi_nextLine	RS.L	1
gi_lastColor	RS.L	1
gi_collHandler	RS.L	1
gi_leftmost	RS.W	1
gi_rightmost	RS.W	1
gi_topmost	RS.W	1
gi_bottommost	RS.W	1
gi_firstBlissObj RS.L	1
gi_lastBlissObj	RS.L	1
gi_SIZEOF	RS.W	0
RPB_FRST_DOT	=	0
RPF_FRST_DOT	=	1<<0
RPB_ONE_DOT	=	1
RPF_ONE_DOT	=	1<<1
RPB_DBUFFER	=	2
RPF_DBUFFER	=	1<<2
RPB_AREAOUTLINE	=	3
RPF_AREAOUTLINE	=	1<<3
RPB_NOCROSSFILL	=	5
RPF_NOCROSSFILL	=	1<<5
RP_JAM1		=	0
RP_JAM2		=	1
RP_COMPLEMENT	=	2
RP_INVERSVID	=	4
RPB_TXSCALE	=	0
RPF_TXSCALE	=	1<<0
	RSRESET
RastPort	RS.B	0
rp_Layer	RS.L	1
rp_BitMap	RS.L	1
rp_AreaPtrn	RS.L	1
rp_TmpRas	RS.L	1
rp_AreaInfo	RS.L	1
rp_GelsInfo	RS.L	1
rp_Mask		RS.B	1
rp_FgPen	RS.B	1
rp_BgPen	RS.B	1
rp_AOLPen	RS.B	1
rp_DrawMode	RS.B	1
rp_AreaPtSz	RS.B	1
rp_Dummy	RS.B	1
rp_linpatcnt	RS.B	1
rp_Flags	RS.W	1
rp_LinePtrn	RS.W	1
rp_cp_x		RS.W	1
rp_cp_y		RS.W	1
rp_minterms	RS.B	8
rp_PenWidth	RS.W	1
rp_PenHeight	RS.W	1
rp_Font	RS.L	1
rp_AlgoStyle	RS.B	1
rp_TxFlags	RS.B	1
rp_TxHeight	RS.W	1
rp_TxWidth	RS.W	1
rp_TxBaseline	RS.W	1
rp_TxSpacing	RS.W	1
rp_RP_User	RS.L	1
rp_longreserved	RS.B	8
	IFND	GFX_RASTPORT_1_2
rp_wordreserved	RS.B	14
rp_reserved	RS.B	8
	ENDC
rp_SIZEOF	RS.W	0
	RSRESET
AreaInfo	RS.B	0
ai_VctrTbl	RS.L	1
ai_VctrPtr	RS.L	1
ai_FlagTbl	RS.L	1
ai_FlagPtr	RS.L	1
ai_Count	RS.W	1
ai_MaxCount	RS.W	1
ai_FirstX	RS.W	1
ai_FirstY	RS.W	1
ai_SIZEOF	RS.W	0
ONE_DOTn	=	1
ONE_DOT		=	2
FRST_DOTn	=	0
FRST_DOT	=	1
	ENDC
