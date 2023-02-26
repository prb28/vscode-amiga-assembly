	IFND	GRAPHICS_GELS_I
GRAPHICS_GELS_I	=	1
SUSERFLAGS	=	$00FF
VSB_VSPRITE	=	0
VSF_VSPRITE	=	1<<0
VSB_SAVEBACK	=	1
VSF_SAVEBACK	=	1<<1
VSB_OVERLAY	=	2
VSF_OVERLAY	=	1<<2
VSB_MUSTDRAW	=	3
VSF_MUSTDRAW	=	1<<3
VSB_BACKSAVED	=	8
VSF_BACKSAVED	=	1<<8
VSB_BOBUPDATE	=	9
VSF_BOBUPDATE	=	1<<9
VSB_GELGONE	=	10
VSF_GELGONE	=	1<<10
VSB_VSOVERFLOW	=	11
VSF_VSOVERFLOW	=	1<<11
BUSERFLAGS	=	$00FF
BB_SAVEBOB	=	0
BF_SAVEBOB	=	1<<0
BB_BOBISCOMP	=	1
BF_BOBISCOMP	=	1<<1
BB_BWAITING	=	8
BF_BWAITING	=	1<<8
BB_BDRAWN	=	9
BF_BDRAWN	=	1<<9
BB_BOBSAWAY	=	10
BF_BOBSAWAY	=	1<<10
BB_BOBNIX	=	11
BF_BOBNIX	=	1<<11
BB_SAVEPRESERVE	=	12
BF_SAVEPRESERVE	=	1<<12
BB_OUTSTEP	=	13
BF_OUTSTEP	=	1<<13
ANFRACSIZE	=	6
ANIMHALF	=	$0020
RINGTRIGGER	=	$0001
InitAnimate	MACRO
	CLR.L	\1
	ENDM
RemBob	MACRO
	OR.W	#BF_BOBSAWAY,b_BobFlags+\1
	ENDM
	RSRESET
VS		RS.B	0
vs_NextVSprite	RS.L	1
vs_PrevVSprite	RS.L	1
vs_DrawPath	RS.L	1
vs_ClearPath	RS.L	1
vs_Oldy		RS.W	1
vs_Oldx		RS.W	1
vs_VSFlags	RS.W	1
vs_Y		RS.W	1
vs_X		RS.W	1
vs_Height	RS.W	1
vs_Width	RS.W	1
vs_Depth	RS.W	1
vs_MeMask	RS.W	1
vs_HitMask	RS.W	1
vs_ImageData	RS.L	1
vs_BorderLine	RS.L	1
vs_CollMask	RS.L	1
vs_SprColors	RS.L	1
vs_VSBob	RS.L	1
vs_PlanePick	RS.B	1
vs_PlaneOnOff	RS.B	1
vs_SUserExt	RS.W	0
vs_SIZEOF	RS.W	0
	RSRESET
BOB		RS.B	0
bob_BobFlags	RS.W	1
bob_SaveBuffer	RS.L	1
bob_ImageShadow	RS.L	1
bob_Before	RS.L	1
bob_After	RS.L	1
bob_BobVSprite	RS.L	1
bob_BobComp	RS.L	1
bob_DBuffer	RS.L	1
bob_BUserExt	RS.W	0
bob_SIZEOF	RS.W	0
	RSRESET
AC		RS.B	0
ac_CompFlags	RS.W	1
ac_Timer	RS.W	1
ac_TimeSet	RS.W	1
ac_NextComp	RS.L	1
ac_PrevComp	RS.L	1
ac_NextSeq	RS.L	1
ac_PrevSeq	RS.L	1
ac_AnimCRoutine	RS.L	1
ac_YTrans	RS.W	1
ac_XTrans	RS.W	1
ac_HeadOb	RS.L	1
ac_AnimBob	RS.L	1
ac_SIZE		RS.W	0
	RSRESET
AO		RS.B	0
ao_NextOb	RS.L	1
ao_PrevOb	RS.L	1
ao_Clock	RS.L	1
ao_AnOldY	RS.W	1
ao_AnOldX	RS.W	1
ao_AnY		RS.W	1
ao_AnX		RS.W	1
ao_YVel		RS.W	1
ao_XVel		RS.W	1
ao_XAccel	RS.W	1
ao_YAccel	RS.W	1
ao_RingYTrans	RS.W	1
ao_RingXTrans	RS.W	1
ao_AnimORoutine	RS.L	1
ao_HeadComp	RS.L	1
ao_AUserExt	RS.W	0
ao_SIZEOF	RS.W	0
	RSRESET
DBP		RS.B	0
dbp_BufY	RS.W	1
dbp_BufX	RS.W	1
dbp_BufPath	RS.L	1
dbp_BufBuffer	RS.L	1
dbp_BufPlanes	RS.L	1
dbp_SIZEOF	RS.W	0
	ENDC
