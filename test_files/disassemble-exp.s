 movea.l	$4.w,a6; 0  2c 78 00 04  movea.l	$4.w, a6
 moveq	#$0,d0; 4  70 00  moveq	#$0, d0
 move.l	#$3e8,d0; 6  20 3c 00 00 03 e8  move.l	#$3e8, d0
 move.l	#$10002,d1; c  22 3c 00 01 00 02  move.l	#$10002, d1
 movea.l	$4.w,a6;12  2c 78 00 04  movea.l	$4.w, a6
 jsr	-$c6(a6);16  4e ae ff 3a  jsr	-$c6(a6)
 move.l	d0,$19c.l;1a  23 c0 00 00 01 9c  move.l	d0, $19c.l
 lea.l	$17e(pc),a1;20  43 fa 01 5c  lea.l	$17e(pc), a1
 jsr	-$198(a6);24  4e ae fe 68  jsr	-$198(a6)
 movea.l	d0,a1;28  22 40  movea.l	d0, a1
 move.l	$26(a1),d4;2a  28 29 00 26  move.l	$26(a1), d4
 jsr	-$19e(a6);2e  4e ae fe 62  jsr	-$19e(a6)
 move.b	#$80,d7;32  1e 3c 00 80  move.b	#$80, d7
 move.w	#$ffff,d6;36  3c 3c ff ff  move.w	#$ffff, d6
 move.w	$dff01c.l,d5;3a  3a 39 00 df f0 1c  move.w	$dff01c.l, d5
 move.w	#$7fff,$dff09a.l;40  33 fc 7f ff 00 df f0 9a  move.w	#$7fff, $dff09a.l
 movea.l	$19c(pc),a0;48  20 7a 01 52  movea.l	$19c(pc), a0
 move.w	#$1fc,(a0)+;4c  30 fc 01 fc  move.w	#$1fc, (a0)+
 move.w	#$0,(a0)+;50  30 fc 00 00  move.w	#$0, (a0)+
 move.w	#$100,(a0)+;54  30 fc 01 00  move.w	#$100, (a0)+
 move.w	#$200,(a0)+;58  30 fc 02 00  move.w	#$200, (a0)+
 move.w	#$180,(a0)+;5c  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$349,(a0)+;60  30 fc 03 49  move.w	#$349, (a0)+
 move.w	#$2b07,(a0)+;64  30 fc 2b 07  move.w	#$2b07, (a0)+
 move.w	#$fffe,(a0)+;68  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;6c  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$56c,(a0)+;70  30 fc 05 6c  move.w	#$56c, (a0)+
 move.w	#$2c07,(a0)+;74  30 fc 2c 07  move.w	#$2c07, (a0)+
 move.w	#$fffe,(a0)+;78  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;7c  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$113,(a0)+;80  30 fc 01 13  move.w	#$113, (a0)+
 move.w	#$9,d0;84  30 3c 00 09  move.w	#$9, d0
 move.w	#$50,d1;88  32 3c 00 50  move.w	#$50, d1
 move.w	#$8007,d3;8c  36 3c 80 07  move.w	#$8007, d3
 move.l	a0,$190.l;90  23 c8 00 00 01 90  move.l	a0, $190.l
 move.w	d3,(a0)+;96  30 c3  move.w	d3, (a0)+
 move.w	#$fffe,(a0)+;98  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;9c  30 fc 01 80  move.w	#$180, (a0)+
 move.w	d1,(a0)+;a0  30 c1  move.w	d1, (a0)+
 add.w	#$100,d3;a2  d6 7c 01 00  add.w	#$100, d3
 add.w	#$10,d1;a6  d2 7c 00 10  add.w	#$10, d1
 dbra	d0,$96;aa  51 c8 ff ea  dbra	d0, $96
 move.w	#$9,d0;ae  30 3c 00 09  move.w	#$9, d0
 move.w	d3,(a0)+;b2  30 c3  move.w	d3, (a0)+
 move.w	#$fffe,(a0)+;b4  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;b8  30 fc 01 80  move.w	#$180, (a0)+
 move.w	d1,(a0)+;bc  30 c1  move.w	d1, (a0)+
 add.w	#$100,d3;be  d6 7c 01 00  add.w	#$100, d3
 sub.w	#$10,d1;c2  92 7c 00 10  sub.w	#$10, d1
 dbra	d0,$b2;c6  51 c8 ff ea  dbra	d0, $b2
 move.l	a0,$198.l;ca  23 c8 00 00 01 98  move.l	a0, $198.l
 move.w	d3,(a0)+;d0  30 c3  move.w	d3, (a0)+
 move.w	#$fffe,(a0)+;d2  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;d6  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$113,(a0)+;da  30 fc 01 13  move.w	#$113, (a0)+
 move.w	#$ffdf,(a0)+;de  30 fc ff df  move.w	#$ffdf, (a0)+
 move.w	#$fffe,(a0)+;e2  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$2c07,(a0)+;e6  30 fc 2c 07  move.w	#$2c07, (a0)+
 move.w	#$fffe,(a0)+;ea  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;ee  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$56c,(a0)+;f2  30 fc 05 6c  move.w	#$56c, (a0)+
 move.w	#$2d07,(a0)+;f6  30 fc 2d 07  move.w	#$2d07, (a0)+
 move.w	#$fffe,(a0)+;fa  30 fc ff fe  move.w	#$fffe, (a0)+
 move.w	#$180,(a0)+;fe  30 fc 01 80  move.w	#$180, (a0)+
 move.w	#$349,(a0)+;102  30 fc 03 49  move.w	#$349, (a0)+
 move.w	#$ffdf,(a0)+;106  30 fc ff df  move.w	#$ffdf, (a0)+
 move.w	#$fffe,(a0)+;10a  30 fc ff fe  move.w	#$fffe, (a0)+
 move.l	#$fffffffe,(a0);10e  20 bc ff ff ff fe  move.l	#$fffffffe, (a0)
 move.l	$19c(pc),$dff080.l;114  23 fa 00 86 00 df f0 80  move.l	$19c(pc), $dff080.l
 clr.w	$dff088.l;11c  42 79 00 df f0 88  clr.w	$dff088.l
 moveq	#$50,d2;122  74 50  moveq	#$50, d2
 neg.w	d6;124  44 46  neg.w	d6
 move.w	#$c,d0;126  30 3c 00 0c  move.w	#$c, d0
 bsr.w	$16e;12a  61 00 00 42  bsr.w	$16e
 add.w	d6,d7;12e  de 46  add.w	d6, d7
 dbra	d2,$136;130  51 ca 00 04  dbra	d2, $136
 bra.b	$122;134  60 ec  bra.b	$122
 move.w	#$13,d0;136  30 3c 00 13  move.w	#$13, d0
 move.w	d7,d3;13a  36 07  move.w	d7, d3
 movea.l	$190(pc),a3;13c  26 7a 00 52  movea.l	$190(pc), a3
 move.b	d3,(a3);140  16 83  move.b	d3, (a3)
 addq.w	#$1,d3;142  52 43  addq.w	#$1, d3
 addq.w	#$6,a3;144  5c 4b  addq.w	#$6, a3
 addq.w	#$2,a3;146  54 4b  addq.w	#$2, a3
 dbra	d0,$140;148  51 c8 ff f6  dbra	d0, $140
 movea.l	$198(pc),a3;14c  26 7a 00 4a  movea.l	$198(pc), a3
 move.b	d3,(a3);150  16 83  move.b	d3, (a3)
 btst.b	#$6,$bfe001.l;152  08 39 00 06 00 bf e0 01  btst.b	#$6, $bfe001.l
 bne.b	$126;15a  66 ca  bne.b	$126
 move.l	d4,$dff080.l;15c  23 c4 00 df f0 80  move.l	d4, $dff080.l
 or.w	#$c000,d5;162  8a 7c c0 00  or.w	#$c000, d5
 move.w	d5,$dff09a.l;166  33 c5 00 df f0 9a  move.w	d5, $dff09a.l
 rts	;16c  4e 75  rts	
 move.l	$dff004.l,d1;16e  22 39 00 df f0 04  move.l	$dff004.l, d1
 lsr.l	#$1,d1;174  e2 89  lsr.l	#$1, d1
 lsr.w	#$7,d1;176  ee 49  lsr.w	#$7, d1
 cmp.w	d0,d1;178  b2 40  cmp.w	d0, d1
 bne.b	$16e;17a  66 f2  bne.b	$16e
 rts	;17c  4e 75  rts	
 beq.b	$1f2;17e  67 72  beq.b	$1f2
 bsr.b	$1f2;180  61 70  bsr.b	$1f2
 bvc.b	$1ed;182  68 69  bvc.b	$1ed
 bls.b	$1f9;184  63 73  bls.b	$1f9
 movea.l	$6962(a4),a7;186  2e 6c 69 62  movea.l	$6962(a4), a7
 moveq	#$61,d1;18a  72 61  moveq	#$61, d1
 moveq	#$79,d1;18c  72 79  moveq	#$79, d1
 ori.b	#$aa,d0;18e  00 00  ori.b	#$aa, d0
;