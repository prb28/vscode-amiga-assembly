	IFND	GRAPHICS_COPPER_I
GRAPHICS_COPPER_I	=	1
COPPER_MOVE	=	0
COPPER_WAIT	=	1
CPRNXTBUF	=	2
CPR_NT_LOF	=	$8000
CPR_NT_SHT	=	$4000
	RSRESET
CopIns		RS.B	0
ci_OpCode	RS.W	1
ci_nxtlist	RS.B	0
ci_VWaitPos	RS.B	0
ci_DestAddr	RS.B	2
ci_HWaitPos	RS.B	0
ci_DestData	RS.B	2
ci_SIZEOF	RS.W	0
	RSRESET
cprlist		RS.B	0
crl_Next	RS.L	1
crl_start	RS.L	1
crl_MaxCount	RS.W	1
crl_SIZEOF	RS.W	0
	RSRESET
CopList		RS.B	0
cl_Next		RS.L	1
cl__CopList	RS.L	1
cl__ViewPort	RS.L	1
cl_CopIns	RS.L	1
cl_CopPtr	RS.L	1
cl_CopLStart	RS.L	1
cl_CopSStart	RS.L	1
cl_Count	RS.W	1
cl_MaxCount	RS.W	1
cl_DyOffset	RS.W	1
cl_SIZEOF	RS.W	0
	RSRESET
UCopList	RS.B	0
ucl_Next	RS.L	1
ucl_FirstCopList	RS.L	1
ucl_CopList	RS.L	1
ucl_SIZEOF	RS.W	0
	RSRESET
copinit		RS.B	0
copinit_diagstrt	RS.B	8
copinit_sprstrtup	RS.B	2*[[2*8*2]+2+[2*2]+2]
copinit_sprstop	RS.B	4
copinit_SIZEOF	RS.W	0
	ENDC
