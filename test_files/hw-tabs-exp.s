myvar2	equ	28				;comment
foo		=	43
SC_W_P	=	W

FW_InitCopperBplPtrs:
	subq.w	#1,d0			;-1 for dbf
	ext.l	d2				;Make d2 safe for longword addition

.makecl:
	swap	d1				;Swap high & low words
	move.w	d1,2(a0)		;High ptr
	swap	d1				;Swap high & low words
	move.w	d1,6(a0)		;Low ptr
	addq.l	#8,a0			;Next set of ptrs
	add.l	d2,d1			;Next bitplane
	dbf		d0,.makecl

	rts