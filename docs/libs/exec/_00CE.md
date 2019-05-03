```c
#ifndef	HARDWARE_INTBITS_H
#define	HARDWARE_INTBITS_H
/*
**	$Filename: hardware/intbits.h $
**	$Release: 2.04 Includes, V37.4 $
**	$Revision: 36.2 $
**	$Date: 90/07/10 $
**
**	bits in the interrupt enable (and interrupt request) register
**
**	(C) Copyright 1985-1999 Amiga, Inc.
**	    All Rights Reserved
*/

#define  INTB_SETCLR	(15)  /* Set/Clear control bit. Determines if bits */
/* written with a 1 get set or cleared. Bits */
/* written with a zero are allways unchanged */
#define  INTB_INTEN	(14)  /* Master interrupt (enable only ) */
#define  INTB_EXTER	(13)  /* External interrupt */
#define  INTB_DSKSYNC	(12)  /* Disk re-SYNChronized */
#define  INTB_RBF	(11)  /* serial port Receive Buffer Full */
#define  INTB_AUD3	(10)  /* Audio channel 3 block finished */
#define  INTB_AUD2	(9)   /* Audio channel 2 block finished */
#define  INTB_AUD1	(8)   /* Audio channel 1 block finished */
#define  INTB_AUD0	(7)   /* Audio channel 0 block finished */
#define  INTB_BLIT	(6)   /* Blitter finished */
#define  INTB_VERTB	(5)   /* start of Vertical Blank */
#define  INTB_COPER	(4)   /* Coprocessor */
#define  INTB_PORTS	(3)   /* I/O Ports and timers */
#define  INTB_SOFTINT	(2)   /* software interrupt request */
#define  INTB_DSKBLK	(1)   /* Disk Block done */
#define  INTB_TBE	(0)   /* serial port Transmit Buffer Empty */



#define  INTF_SETCLR	(1&#060;&#060;15)
#define  INTF_INTEN	(1&#060;&#060;14)
#define  INTF_EXTER	(1&#060;&#060;13)
#define  INTF_DSKSYNC	(1&#060;&#060;12)
#define  INTF_RBF	(1&#060;&#060;11)
#define  INTF_AUD3	(1&#060;&#060;10)
#define  INTF_AUD2	(1&#060;&#060;9)
#define  INTF_AUD1	(1&#060;&#060;8)
#define  INTF_AUD0	(1&#060;&#060;7)
#define  INTF_BLIT	(1&#060;&#060;6)
#define  INTF_VERTB	(1&#060;&#060;5)
#define  INTF_COPER	(1&#060;&#060;4)
#define  INTF_PORTS	(1&#060;&#060;3)
#define  INTF_SOFTINT	(1&#060;&#060;2)
#define  INTF_DSKBLK	(1&#060;&#060;1)
#define  INTF_TBE	(1&#060;&#060;0)

#endif	/* HARDWARE_INTBITS_H */
```
