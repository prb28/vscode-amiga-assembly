# Documentation

## Motorola 68000 assembler

| Instructions  | Description |
|:---|:---|
|[abcd](instructions/abcd.md)|Add decimal with extend|
|[add](instructions/add.md)|Add binary|
|[adda](instructions/adda.md)|Add address|
|[addi](instructions/addi.md)|Add immediate|
|[addq](instructions/addq.md)|Add quick|
|[addx](instructions/addx.md)|Add extended|
|[and](instructions/and.md)|AND logical|
|[andi](instructions/andi.md)|AND immediate|
|[asl asr](instructions/asl_asr.md)|Arithmetic shift left/right|
|[bcc](instructions/bcc.md)|Branch on condition cc|
|[bchg](instructions/bchg.md)|Test a bit and change|
|[bclr](instructions/bclr.md)|Test a bit and clear|
|[bra](instructions/bra.md)|Branch always|
|[bset](instructions/bset.md)|Test a bit and set|
|[bsr](instructions/bsr.md)|Branch to subroutine|
|[btst](instructions/btst.md)|Test a bit|
|[chk](instructions/chk.md)|Check register against bounds|
|[clr](instructions/clr.md)|Clear an operand|
|[cmp](instructions/cmp.md)|Compare|
|[cmpa](instructions/cmpa.md)|Compare address|
|[cmpi](instructions/cmpi.md)|Compare immediate|
|[cmpm](instructions/cmpm.md)|Compare memory with memory|
|[dbcc](instructions/dbcc.md)|Test condition, decrement, and branch|
|[divs divu](instructions/divs_divu.md)|Signed divide, unsigned divide|
|[eor](instructions/eor.md)|Exclusive OR logical|
|[eori](instructions/eori.md)|EOR immediate|
|[exg](instructions/exg.md)|Exchange registers|
|[ext](instructions/ext.md)|Sign|
|[illegal](instructions/illegal.md)|Illegal instruction|
|[jmp](instructions/jmp.md)|Jump (unconditionally)|
|[jsr](instructions/jsr.md)|Jump to subroutine|
|[lea](instructions/lea.md)|Load effective address|
|[link](instructions/link.md)|Link and allocate|
|[lsl lsr](instructions/lsl_lsr.md)|Logical shift left/right|
|[move](instructions/move.md)|Copy data from source to destination|
|[movea](instructions/movea.md)|Move address|
|[movem](instructions/movem.md)|Move multiple registers|
|[movep](instructions/movep.md)|Move peripheral data|
|[moveq](instructions/moveq.md)|Move quick (copy a small literal to a destination)|
|[muls mulu](instructions/muls_mulu.md)|Signed multiply, unsigned multiply|
|[nbcd](instructions/nbcd.md)|Negate decimal with sign extend|
|[neg](instructions/neg.md)|Negate|
|[negx](instructions/negx.md)|Negate with extend|
|[nop](instructions/nop.md)|No operation|
|[not](instructions/not.md)|Logical complement|
|[or](instructions/or.md)|OR logical|
|[ori](instructions/ori.md)|OR immediate|
|[pea](instructions/pea.md)|Push effective address|
|[reset](instructions/reset.md)|Reset external devices|
|[rol ror](instructions/rol_ror.md)|Rotate left/right (without extend)|
|[roxl roxr](instructions/roxl_roxr.md)|Rotate left/right with extend|
|[rte](instructions/rte.md)|Return from exception|
|[rtr](instructions/rtr.md)|Return and restore condition codes|
|[rts](instructions/rts.md)|Return from subroutine|
|[sbcd](instructions/sbcd.md)|Subtract decimal with extend|
|[scc](instructions/scc.md)|Set according to condition cc|
|[stop](instructions/stop.md)|Load status register and stop|
|[sub](instructions/sub.md)|Subtract binary|
|[suba](instructions/suba.md)|Subtract address|
|[subi](instructions/subi.md)|Subtract immediate|
|[subq](instructions/subq.md)|Subtract quick|
|[subx](instructions/subx.md)|Subtract extended|
|[swap](instructions/swap.md)|Swap register halves|
|[tas](instructions/tas.md)|Test and set an operand|
|[trap](instructions/trap.md)|Trap|
|[trapv](instructions/trapv.md)|Trap on overflow|
|[tst](instructions/tst.md)|# TST Test an operand|
|[unlk](instructions/unlk.md)|Unlink|

## Assembler directives

| Directive | Description |
|:---|:---|
|[align](directives/align.md)|Insert as much zero bytes as required to reach an address where `<bitcount>` low order bits are zero|
|[blk](directives/blk.md)|Equivalent to `dcb.[bdlqswx] <exp>,<fill>`|
|[bss](directives/bss.md)|Equivalent to `section bss,bss`|
|[bss_c](directives/bss_c.md)|Equivalent to `section bss_c,bss,chip`|
|[bss_f](directives/bss_f.md)|Equivalent to `section bss_f,bss,fast`|
|[cargs](directives/cargs.md)|Defines `<symbol1>` with the value of `<offset>`|
|[clrfo](directives/clrfo.md)|Reset stack-frame offset counter to zero|
|[clrso](directives/clrso.md)|Reset structure offset counter to zero|
|[cnop](directives/cnop.md)|Insert as much zero bytes as required to reach an address which can be divided by `<alignment>`|
|[code](directives/code.md)|Equivalent to `section code,code`|
|[code_c](directives/code_c.md)|Equivalent to `section code_c,code,chip`|
|[code_f](directives/code_f.md)|Equivalent to `section code_f,code,fast`|
|[comm](directives/comm.md)|Create a common symbol with the given size|
|[comment](directives/comment.md)|Everything in the operand field is ignored and seen as a comment|
|[cseg](directives/cseg.md)|Equivalent to `section code,code`|
|[data](directives/data.md)|Equivalent to `section data,data`|
|[data_c](directives/data_c.md)|Equivalent to `section data_c,data,chip`|
|[data_f](directives/data_f.md)|Equivalent to `section data_f,data,fast`|
|[db](directives/db.md)|Equivalent to `dc.b` for ArgAsm, BAsm, HX68, Macro68, ProAsm, etc. compatibility|
|[dbc](directives/dbc.md)|Insert `<exp>` zero or `<fill>` bytes/words into the current section|
|[dc](directives/dc.md)|Assign the integer or string constant operands into successive bytes/words of memory in the current section|
|[dl](directives/dl.md)|Equivalent to `dc.l` for ArgAsm, BAsm, HX68, Macro68, ProAsm, etc. compatibility|
|[dr](directives/dr.md)|Calculates `<expN> - <current pc value>` and stores it into successive bytes/words of memory in the current section|
|[dw](directives/dw.md)|Equivalent to `dc.w` for ArgAsm, BAsm, HX68, Macro68, ProAsm, etc. compatibility|
|[dx](directives/dx.md)|Tries to allocate space in the DataBss portion of a code or data section|
|[echo](directives/echo.md)|Prints `<string>` to stdout|
|[einline](directives/einline.md)|End a block of isolated local labels, started by inline|
|[else](directives/else.md)|Assemble the following lines if the previous if condition was false|
|[end](directives/end.md)|Assembly will terminate behind this line|
|[endif](directives/endif.md)|Ends a section of conditional assembly|
|[endm](directives/endm.md)|Ends a macro definition|
|[endr](directives/endr.md)|Ends a repetition block|
|[equ](directives/equ.md)|Define a new program symbol with the name `<symbol>` and assign to it the value of `<expression>`|
|[erem](directives/erem.md)|Ends an outcommented block. Assembly will continue|
|[even](directives/even.md)|Aligns to an even address|
|[fail](directives/fail.md)|Show an error message including the `<message>` string|
|[fequ](directives/fequ.md)|Define a new program symbol with the name `<symbol>` and assign to it the floating point value of `<expression>`|
|[fo](directives/fo.md)|Assigns the current value of the stack-frame offset counter to `<label>`|
|[idnt](directives/idnt.md)|Sets the file or module name in the generated object file to `<name>`, when the selected output module supports it|
|[if](directives/if.md)|Conditionally assemble the following lines if `<expression>` is non-zero|
|[if1](directives/if1.md)|Just for compatibility|
|[if2](directives/if2.md)|Just for compatibility|
|[ifb](directives/ifb.md)|Conditionally assemble the following lines when `<operand>` is completely blank, except an optional comment|
|[ifc](directives/ifc.md)|Conditionally assemble the following lines if `<string1>` matches `<string2>`|
|[ifd](directives/ifd.md)|Conditionally assemble the following lines if `<symbol>` is defined|
|[ifeq](directives/ifeq.md)|Conditionally assemble the following lines if `<expression>` is zero|
|[ifge](directives/ifge.md)|Conditionally assemble the following lines if `<expression>` is greater than zero or equal|
|[ifgt](directives/ifgt.md)|Conditionally assemble the following lines if `<expression>` is greater than zero|
|[ifle](directives/ifle.md)|Conditionally assemble the following lines if `<expression>` is less than zero or equal|
|[iflt](directives/iflt.md)|Conditionally assemble the following lines if `<expression>` is less than zero|
|[ifmacrod](directives/ifmacrod.md)|Conditionally assemble the following line if `<macro>` is defined|
|[ifmacrond](directives/ifmacrond.md)|Conditionally assemble the following line if `<macro>` is undefined|
|[ifnb](directives/ifnb.md)|Conditionally assemble the following lines when `<operand>` is non-blank|
|[ifnc](directives/ifnc.md)|Conditionally assemble the following lines if `<string1>` does not match `<string2>`|
|[ifnd](directives/ifnd.md)|Conditionally assemble the following lines if `<symbol>` is undefined|
|[ifne](directives/ifne.md)|Conditionally assemble the following lines if `<expression>` is non-zero|
|[ifp1](directives/ifp1.md)|Just for compatibility. Equivalent to if1|
|[iif](directives/iif.md)|Conditionally assemble the `<statement>` following `<expression>`|
|[incbin](directives/incbin.md)|Inserts the binary contents of `<file>` into the object code at this position|
|[incdir](directives/incdir.md)|Add another path to search for include files to the list of known paths|
|[include](directives/include.md)|Include source text of `<file>` at this position|
|[inline](directives/inline.md)|Local labels in the following block are isolated from previous local labels and those after einline|
|[list](directives/list.md)|The following lines will appear in the listing file, if it was requested|
|[llen](directives/llen.md)|Set the line length in a listing file to a maximum of `<len>` characters|
|[macro](directives/macro.md)|Defines a macro which can be referenced by `<name>`|
|[mexit](directives/mexit.md)|Leave the current macro and continue with assembling the parent context|
|[msource](directives/msource.md)|Enable or disable source level debugging within a macro context|
|[nolist](directives/nolist.md)|The following lines will not be visible in a listing file|
|[nopage](directives/nopage.md)|Never start a new page in the listing file|
|[nref](directives/nref.md)|Flag `<symbol>` as externally defined|
|[odd](directives/odd.md)|Aligns to an odd address|
|[offset](directives/offset.md)|Switches to a special offset-section|
|[org](directives/org.md)|Sets the base address for the subsequent code|
|[output](directives/output.md)|Sets the output file name to `<name>` when no output name was given on the command line|
|[page](directives/page.md)|Start a new page in the listing file (not implemented)|
|[plen](directives/plen.md)|Set the page length for a listing file to `<len>` lines|
|[popsection](directives/popsection.md)|Restore the top section from the internal section-stack and activate it|
|[printt](directives/printt.md)|Prints `<string>` to stdout|
|[printv](directives/printv.md)|Evaluate `<expression>` and print it to stdout out in hexadecimal, decimal, ASCII and binary format|
|[public](directives/public.md)|Flag `<symbol>` as an external symbol, which means that `<symbol>` is visible to all modules in the linking process|
|[pushsection](directives/pushsection.md)|Pushes the current section onto an internal stack, where it may be restored from by the popsection directive|
|[rem](directives/rem.md)|The assembler will ignore everything from encountering the rem directive until an erem directive was found|
|[rept](directives/rept.md)|Repeats the assembly of the block between rept and endr `<expression>` number of times|
|[rorg](directives/rorg.md)|Sets the program counter `<expression>` bytes behind the start of the current section|
|[rs](directives/rs.md)|Works like the so directive, with the only difference that the offset symbol is named `__RS`|
|[rsreset](directives/rsreset.md)|Equivalent to [clrso](clrso.md), but the symbol manipulated is `__RS`|
|[rsset](directives/rsset.md)|Sets the structure offset counter (`__RS`) to `<expression>`|
|[section](directives/section.md)|Starts a new section named `<name>` or reactivates an old one|
|[set](directives/set.md)|Create a new symbol with the name `<symbol>` and assign the value of `<expression>`|
|[setfo](directives/setfo.md)|Sets the structure offset counter (`__FO`) to `<expression>`|
|[setso](directives/setso.md)|Sets the structure offset counter (`__SO`) to `<expression>`|
|[so](directives/so.md)|Assigns the current value of the structure offset counter to `<label>`|
|[spc](directives/spc.md)|Output `<lines>` number of blank lines in the listing file|
|[text](directives/text.md)|Equivalent to `section code,code`|
|[ttl](directives/ttl.md)|PhxAss syntax. Equivalent to `idnt <name>`|
|[weak](directives/weak.md)|Flag `<symbol>` as a weak symbol, which means that `<symbol>` is visible to all modules in the linking process, but may be replaced by any global symbol with the same name|
|[xdef](directives/xdef.md)|Flag `<symbol>` as a global symbol, which means that `<symbol>` is visible to all modules in the linking process|
|[xref](directives/xref.md)|Flag `<symbol>` as externally defined, which means it has to be imported from another module into the linking process|

## Amiga registers

| Address  | Name | Description |
|:---|:---|:---|
|BFD000|[PRA](hardware/BFD000_PRA.md)|CIAB Peripheral Data Register A|
|BFD100|[PRB](hardware/BFD100_PRB.md)|CIAB Peripheral Data Register A|
|BFD200|[DDRA](hardware/BFD200_DDRA.md)|CIAB Data Direction Register A|
|BFD300|[DDRB](hardware/BFD300_DDRB.md)|CIAB Data Direction Register B|
|BFD400|[TALO](hardware/BFD400_TALO.md)|CIAB Timer A LOw register|
|BFD500|[TAHI](hardware/BFD500_TAHI.md)|CIAB Timer A HIgh register|
|BFD600|[TBLO](hardware/BFD600_TBLO.md)|CIAB Timer B LOw register|
|BFD700|[TBHI](hardware/BFD700_TBHI.md)|CIAB Timer B HIgh register|
|BFD800|[TODLOW](hardware/BFD800_TODLOW.md)|CIAB Event LSB|
|BFD900|[TODMID](hardware/BFD900_TODMID.md)|CIAB Event 8-15|
|BFDA00|[TODHI](hardware/BFDA00_TODHI.md)|CIAB Event MSB|
|BFDC00|[SDR](hardware/BFDC00_SDR.md)|CIAB Serial Data Register|
|BFDD00|[ICR](hardware/BFDD00_ICR.md)|CIAB Interrupt Control Register|
|BFDE00|[CRA](hardware/BFDE00_CRA.md)|CIAB Control register A|
|BFDF00|[CRB](hardware/BFDF00_CRB.md)|CIAB Control register B|
|BFE001|[PRA](hardware/BFE001_PRA.md)|CIAA Peripheral Data Register A|
|BFE101|[PRB](hardware/BFE101_PRB.md)|CIAA Peripheral Data Register B|
|BFE201|[DDRA](hardware/BFE201_DDRA.md)|CIAA Data Direction Register A|
|BFE301|[DDRB](hardware/BFE301_DDRB.md)|CIAA Data Direction Register B|
|BFE401|[TALO](hardware/BFE401_TALO.md)|CIAA Timer A LOw register|
|BFE501|[TAHI](hardware/BFE501_TAHI.md)|CIAA Timer A HIgh register|
|BFE601|[TBLO](hardware/BFE601_TBLO.md)|CIAA Timer B LOw register|
|BFE701|[TBHI](hardware/BFE701_TBHI.md)|CIAA Timer B HIgh register|
|BFE801|[TODLOW](hardware/BFE801_TODLOW.md)|CIAA Event LSB|
|BFE901|[TODMID](hardware/BFE901_TODMID.md)|CIAA Event 8-15|
|BFEA01|[TODHI](hardware/BFEA01_TODHI.md)|CIAA Event MSB|
|BFEC01|[SDR](hardware/BFEC01_SDR.md)|CIAA Serial Data Register|
|BFED01|[ICR](hardware/BFED01_ICR.md)|CIAA Interrupt Control Register|
|BFEE01|[CRA](hardware/BFEE01_CRA.md)|CIAA Control register A|
|BFEF01|[CRB](hardware/BFEF01_CRB.md)|CIAA Control register B|
|DFF000|[BLTDDAT](hardware/DFF000_BLTDDAT.md)|Blitter destination data register|
|DFF002|[DMACONR](hardware/DFF002_DMACONR.md)|DMA Control (and blitter status) read|
|DFF004|[VPOSR](hardware/DFF004_VPOSR.md)|Read vert most sig. bits (and frame flop)|
|DFF006|[VHPOSR](hardware/DFF006_VHPOSR.md)|Read vert and horiz position of beam, or lightpen|
|DFF008|[DSKDATR](hardware/DFF008_DSKDATR.md)|Disk DMA data read (early read dummy address)|
|DFF00A|[JOY0DAT](hardware/DFF00A_JOY0DAT.md)|Joystick-mouse 0 data (left vert, horiz)|
|DFF00C|[JOY1DAT](hardware/DFF00C_JOY1DAT.md)|Joystick-mouse 1 data (right vert, horiz)|
|DFF00E|[CLXDAT](hardware/DFF00E_CLXDAT.md)|Collision detection register (read and clear)|
|DFF010|[ADKCONR](hardware/DFF010_ADKCONR.md)|Audio, Disk, UART Control Read|
|DFF012|[POT0DAT](hardware/DFF012_POT0DAT.md)|Pot counter data left pair (vert, horiz)|
|DFF014|[POT1DAT](hardware/DFF014_POT1DAT.md)|Pot counter data right pair (vert, horiz)|
|DFF016|[POTINP](hardware/DFF016_POTINP.md)|Pot pin data read|
|DFF018|[SERDATR](hardware/DFF018_SERDATR.md)|Pot pin data read|
|DFF01A|[DSKBYTR](hardware/DFF01A_DSKBYTR.md)|Disk data byte and status read|
|DFF01C|[INTENAR](hardware/DFF01C_INTENAR.md)|Interrupt enable bits (read)|
|DFF01E|[INTREQR](hardware/DFF01E_INTREQR.md)|Interrupt request bits (read)|
|DFF020|[DSKPT](hardware/DFF020_DSKPT.md)|Disk Pointer (high 5 bits) (old-3 bits)|
|DFF020|[DSKPTH](hardware/DFF020_DSKPTH.md)|Disk Pointer (high 5 bits) (old-3 bits)|
|DFF022|[DSKPTL](hardware/DFF022_DSKPTL.md)|Disk Pointer (low 15 bits)|
|DFF024|[DSKLEN](hardware/DFF024_DSKLEN.md)|Disk length|
|DFF026|[DKSDAT](hardware/DFF026_DKSDAT.md)|Disk DMA data write|
|DFF028|[REFPTR](hardware/DFF028_REFPTR.md)|Refresh pointer|
|DFF02A|[VPOSW](hardware/DFF02A_VPOSW.md)|Write most sig. bits (and frame flop)|
|DFF02C|[VHPOSW](hardware/DFF02C_VHPOSW.md)|Write vert and horiz position of beam, or lightpen|
|DFF02E|[COPCON](hardware/DFF02E_COPCON.md)|Coprocessor control register|
|DFF030|[SERDAT](hardware/DFF030_SERDAT.md)|Serial port data and stop bits write|
|DFF032|[SERPER](hardware/DFF032_SERPER.md)|Serial port period and control|
|DFF034|[POTGO](hardware/DFF034_POTGO.md)|Pot port (4 bit) bi-direction and data and pot counter start|
|DFF036|[JOYTEST](hardware/DFF036_JOYTEST.md)|Write to all 4 joystick-mouse counters at once|
|DFF038|[STREQU](hardware/DFF038_STREQU.md)|Strobe for horiz sync with VB (vert blank) and EQU|
|DFF03A|[STRVBL](hardware/DFF03A_STRVBL.md)|Strobe for horiz sync with VB|
|DFF03C|[STRHOR](hardware/DFF03C_STRHOR.md)|Strobe for horiz sync|
|DFF03E|[STRLONG](hardware/DFF03E_STRLONG.md)|Strobe for identification of long horiz line (228CC)|
|DFF040|[BLTCON0](hardware/DFF040_BLTCON0.md)|Blitter control register 0|
|DFF042|[BLTCON1](hardware/DFF042_BLTCON1.md)|Blitter control register 0 (lower 8 bits) This is to speed up software - the upper bits are often the same.|
|DFF044|[BLTAFWM](hardware/DFF044_BLTAFWM.md)|Blitter first word mask for source A|
|DFF046|[BLTALWM](hardware/DFF046_BLTALWM.md)|Blitter last word mask for source A|
|DFF048|[BLTCPT](hardware/DFF048_BLTCPT.md)|Blitter pointer to source C (high 5 bits)|
|DFF048|[BLTCPTH](hardware/DFF048_BLTCPTH.md)|Blitter pointer to source C (high 5 bits)|
|DFF04A|[BLTCPTL](hardware/DFF04A_BLTCPTL.md)|Blitter pointer to source C (low 15 bits)|
|DFF04C|[BLTBPT](hardware/DFF04C_BLTBPT.md)|Blitter pointer to source B (high 5 bits)|
|DFF04C|[BLTBPTH](hardware/DFF04C_BLTBPTH.md)|Blitter pointer to source B (high 5 bits)|
|DFF04E|[BLTBPTL](hardware/DFF04E_BLTBPTL.md)|Blitter pointer to source B (low 15 bits)|
|DFF050|[BLTAPT](hardware/DFF050_BLTAPT.md)|Blitter pointer to source A (high 5 bits)|
|DFF050|[BLTAPTH](hardware/DFF050_BLTAPTH.md)|Blitter pointer to source A (high 5 bits)|
|DFF052|[BLTAPTL](hardware/DFF052_BLTAPTL.md)|Blitter pointer to source A (low 15 bits)|
|DFF054|[BLTDPT](hardware/DFF054_BLTDPT.md)|Blitter pointer to destination D (high 5 bits)|
|DFF054|[BLTDPTH](hardware/DFF054_BLTDPTH.md)|Blitter pointer to destination D (high 5 bits)|
|DFF056|[BLTDPTL](hardware/DFF056_BLTDPTL.md)|Blitter pointer to destination D (low 15 bits)|
|DFF058|[BLTSIZE](hardware/DFF058_BLTSIZE.md)|Blitter start and size (width, height)|
|DFF05A|[BLTCON0L](hardware/DFF05A_BLTCON0L.md)|Pot pin data read|
|DFF05C|[BLTSIZV](hardware/DFF05C_BLTSIZV.md)|Blitter vertical size (15 bit height)|
|DFF05E|[BLTSIZH](hardware/DFF05E_BLTSIZH.md)|Blitter horizontal size & start (11 bit width)|
|DFF060|[BLTCMOD](hardware/DFF060_BLTCMOD.md)|Blitter modulo for source C|
|DFF062|[BLTBMOD](hardware/DFF062_BLTBMOD.md)|Blitter modulo for source B|
|DFF064|[BLTAMOD](hardware/DFF064_BLTAMOD.md)|Blitter modulo for source A|
|DFF066|[BLTDMOD](hardware/DFF066_BLTDMOD.md)|Blitter modulo for destination D|
|DFF070|[BLTCDAT](hardware/DFF070_BLTCDAT.md)|Blitter source C data register|
|DFF072|[BLTBDAT](hardware/DFF072_BLTBDAT.md)|Blitter source B data register|
|DFF074|[BLTADAT](hardware/DFF074_BLTADAT.md)|Blitter source A data register|
|DFF078|[SPRHDAT](hardware/DFF078_SPRHDAT.md)|Ext. logic UltraHiRes sprite pointer and data|
|DFF07A|[BPLHDAT](hardware/DFF07A_BPLHDAT.md)|Ext. logic UHRES bit plane identifier|
|DFF07C|[DENISEID](hardware/DFF07C_DENISEID.md)|Denise/Lisa (video out chip) revision level|
|DFF07E|[DSKSYNC](hardware/DFF07E_DSKSYNC.md)|Disk sync register, the match code for disk read synchronization See ADKCON bit 10|
|DFF080|[COP1LC](hardware/DFF080_COP1LC.md)|Coprocessor first location register (high 5 bits) (old-3 bits)|
|DFF080|[COP1LCH](hardware/DFF080_COP1LCH.md)|Coprocessor first location register (high 5 bits) (old-3 bits)|
|DFF082|[COP1LCL](hardware/DFF082_COP1LCL.md)|Coprocessor first location register (low 15 bits)|
|DFF084|[COP2LC](hardware/DFF084_COP2LC.md)|Coprocessor second location register (high 5 bits) (old-3 bits)|
|DFF084|[COP2LCH](hardware/DFF084_COP2LCH.md)|Coprocessor second location register (high 5 bits) (old-3 bits)|
|DFF086|[COP2LCL](hardware/DFF086_COP2LCL.md)|Coprocessor second location register (low 15 bits)|
|DFF088|[COPJMP1](hardware/DFF088_COPJMP1.md)|Coprocessor restart at first location|
|DFF08A|[COPJMP2](hardware/DFF08A_COPJMP2.md)|Coprocessor restart at second location|
|DFF08C|[COPINS](hardware/DFF08C_COPINS.md)|Coprocessor instruction fetch identity|
|DFF08E|[DIWSTRT](hardware/DFF08E_DIWSTRT.md)|Display window start (upper left vertical-horizontal position)|
|DFF090|[DIWSTOP](hardware/DFF090_DIWSTOP.md)|Display window stop (lower right vertical-horizontal position)|
|DFF092|[DDFSTRT](hardware/DFF092_DDFSTRT.md)|Display data fetch start (horizontal position)|
|DFF094|[DDFSTOP](hardware/DFF094_DDFSTOP.md)|Display data fetch stop (horizontal position)|
|DFF096|[DMACON](hardware/DFF096_DMACON.md)|DMA Control write (clear or set)|
|DFF098|[CLXCON](hardware/DFF098_CLXCON.md)|Collision control|
|DFF09A|[INTENA](hardware/DFF09A_INTENA.md)|Interrupt enable bits (clear or set bits)|
|DFF09A|[POTINP](hardware/DFF09A_POTINP.md)|Interrupt enable bits (clear or set bits)|
|DFF09C|[INTREQ](hardware/DFF09C_INTREQ.md)|Interrupt request bits (clear or set)|
|DFF09E|[ADKCON](hardware/DFF09E_ADKCON.md)|Audio, Disk, UART Control Write|
|DFF0A0|[AUD0LC](hardware/DFF0A0_AUD0LC.md)|Audio Channel 0 Location (high 5 bits)|
|DFF0A0|[AUD0LCH](hardware/DFF0A0_AUD0LCH.md)|Audio Channel 0 Location (high 5 bits)|
|DFF0A2|[AUD0LCL](hardware/DFF0A2_AUD0LCL.md)|Audio Channel 0 Location (low 15 bits)|
|DFF0A4|[AUD0LEN](hardware/DFF0A4_AUD0LEN.md)|Audio Channel 0 length|
|DFF0A6|[AUD0PER](hardware/DFF0A6_AUD0PER.md)|Audio channel 0 period|
|DFF0A8|[AUD0VOL](hardware/DFF0A8_AUD0VOL.md)|Audio channel 0 volume|
|DFF0AA|[AUD0DAT](hardware/DFF0AA_AUD0DAT.md)|Audio Channel 0 data|
|DFF0B0|[AUD1LC](hardware/DFF0B0_AUD1LC.md)|Audio Channel 1 Location (high 5 bits)|
|DFF0B0|[AUD1LCH](hardware/DFF0B0_AUD1LCH.md)|Audio Channel 1 Location (high 5 bits)|
|DFF0B2|[AUD1LCL](hardware/DFF0B2_AUD1LCL.md)|Audio Channel 1 Location (low 15 bits)|
|DFF0B4|[AUD1LEN](hardware/DFF0B4_AUD1LEN.md)|Audio Channel 1 length|
|DFF0B6|[AUD1PER](hardware/DFF0B6_AUD1PER.md)|Audio channel 1 period|
|DFF0B8|[AUD1VOL](hardware/DFF0B8_AUD1VOL.md)|Audio channel 1 volume|
|DFF0BA|[AUD1DAT](hardware/DFF0BA_AUD1DAT.md)|Audio Channel 1 data|
|DFF0C0|[AUD2LC](hardware/DFF0C0_AUD2LC.md)|Audio Channel 2 Location (high 5 bits)|
|DFF0C0|[AUD2LCH](hardware/DFF0C0_AUD2LCH.md)|Audio Channel 2 Location (high 5 bits)|
|DFF0C2|[AUD2LCL](hardware/DFF0C2_AUD2LCL.md)|Audio Channel 2 Location (low 15 bits)|
|DFF0C4|[AUD2LEN](hardware/DFF0C4_AUD2LEN.md)|Audio Channel 2 length|
|DFF0C6|[AUD2PER](hardware/DFF0C6_AUD2PER.md)|Audio channel 2 period|
|DFF0C8|[AUD2VOL](hardware/DFF0C8_AUD2VOL.md)|Audio channel 2 volume|
|DFF0CA|[AUD2DAT](hardware/DFF0CA_AUD2DAT.md)|Audio Channel 2 data|
|DFF0D0|[AUD3LC](hardware/DFF0D0_AUD3LC.md)|Audio Channel 3 Location (high 5 bits)|
|DFF0D0|[AUD3LCH](hardware/DFF0D0_AUD3LCH.md)|Audio Channel 3 Location (high 5 bits)|
|DFF0D2|[AUD3LCL](hardware/DFF0D2_AUD3LCL.md)|Audio Channel 3 Location (low 15 bits)|
|DFF0D4|[AUD3LEN](hardware/DFF0D4_AUD3LEN.md)|Audio Channel 3 length|
|DFF0D6|[AUD3PER](hardware/DFF0D6_AUD3PER.md)|Audio channel 3 period|
|DFF0D8|[AUD3VOL](hardware/DFF0D8_AUD3VOL.md)|Audio channel 3 volume|
|DFF0DA|[AUD3DAT](hardware/DFF0DA_AUD3DAT.md)|Audio Channel 3 data|
|DFF0E0|[BPL1PT](hardware/DFF0E0_BPL1PT.md)|Bit plane 1 pointer (high 5 bits)|
|DFF0E0|[BPL1PTH](hardware/DFF0E0_BPL1PTH.md)|Bit plane 1 pointer (high 5 bits)|
|DFF0E2|[BPL1PTL](hardware/DFF0E2_BPL1PTL.md)|Bit plane 1 pointer (low 15 bits)|
|DFF0E4|[BPL2PT](hardware/DFF0E4_BPL2PT.md)|Bit plane 2 pointer (high 5 bits)|
|DFF0E4|[BPL2PTH](hardware/DFF0E4_BPL2PTH.md)|Bit plane 2 pointer (high 5 bits)|
|DFF0E6|[BPL2PTL](hardware/DFF0E6_BPL2PTL.md)|Bit plane 2 pointer (low 15 bits)|
|DFF0E8|[BPL3PT](hardware/DFF0E8_BPL3PT.md)|Bit plane 3 pointer (high 5 bits)|
|DFF0E8|[BPL3PTH](hardware/DFF0E8_BPL3PTH.md)|Bit plane 3 pointer (high 5 bits)|
|DFF0EA|[BPL3PTL](hardware/DFF0EA_BPL3PTL.md)|Bit plane 3 pointer (low 15 bits)|
|DFF0EC|[BPL4PT](hardware/DFF0EC_BPL4PT.md)|Bit plane 4 pointer (high 5 bits)|
|DFF0EC|[BPL4PTH](hardware/DFF0EC_BPL4PTH.md)|Bit plane 4 pointer (high 5 bits)|
|DFF0EE|[BPL4PTL](hardware/DFF0EE_BPL4PTL.md)|Bit plane 4 pointer (low 15 bits)|
|DFF0F0|[BPL5PT](hardware/DFF0F0_BPL5PT.md)|Bit plane 5 pointer (high 5 bits)|
|DFF0F0|[BPL5PTH](hardware/DFF0F0_BPL5PTH.md)|Bit plane 5 pointer (high 5 bits)|
|DFF0F2|[BPL5PTL](hardware/DFF0F2_BPL5PTL.md)|Bit plane 5 pointer (low 15 bits)|
|DFF0F4|[BPL6PT](hardware/DFF0F4_BPL6PT.md)|Bit plane 6 pointer (high 5 bits)|
|DFF0F4|[BPL6PTH](hardware/DFF0F4_BPL6PTH.md)|Bit plane 6 pointer (high 5 bits)|
|DFF0F6|[BPL6PTL](hardware/DFF0F6_BPL6PTL.md)|Bit plane 6 pointer (low 15 bits)|
|DFF0F8|[BPL7PT](hardware/DFF0F8_BPL7PT.md)|Bit plane 7 pointer (high 5 bits)|
|DFF0F8|[BPL7PTH](hardware/DFF0F8_BPL7PTH.md)|Bit plane 7 pointer (high 5 bits)|
|DFF0FA|[BPL7PTL](hardware/DFF0FA_BPL7PTL.md)|Bit plane 7 pointer (low 15 bits)|
|DFF0FC|[BPL8PT](hardware/DFF0FC_BPL8PT.md)|Bit plane 8 pointer (high 5 bits)|
|DFF0FC|[BPL8PTH](hardware/DFF0FC_BPL8PTH.md)|Bit plane 8 pointer (high 5 bits)|
|DFF0FE|[BPL8PTL](hardware/DFF0FE_BPL8PTL.md)|Bit plane 8 pointer (low 15 bits)|
|DFF100|[BPLCON0](hardware/DFF100_BPLCON0.md)|Bit Plane Control Register 0 (misc, control bits)|
|DFF102|[BPLCON1](hardware/DFF102_BPLCON1.md)|Bit Plane Control Register (horizontal, scroll counter)|
|DFF104|[BPLCON2](hardware/DFF104_BPLCON2.md)|Bit Plane Control Register (new control bits)|
|DFF106|[BPLCON3](hardware/DFF106_BPLCON3.md)|Bit Plane Control Register (enhanced bits)|
|DFF108|[BPL1MOD](hardware/DFF108_BPL1MOD.md)|Bit plane modulo (odd planes)|
|DFF10A|[BPL2MOD](hardware/DFF10A_BPL2MOD.md)|Bit plane modulo (even planes)|
|DFF10C|[BPLCON4](hardware/DFF10C_BPLCON4.md)|Bit Plane Control Register (display masks)|
|DFF10E|[CLXCON2](hardware/DFF10E_CLXCON2.md)|Extended Collision Control|
|DFF110|[BPL1DAT](hardware/DFF110_BPL1DAT.md)|Bit plane 1 data (parallel to serial convert)|
|DFF112|[BPL2DAT](hardware/DFF112_BPL2DAT.md)|Bit plane 2 data (parallel to serial convert)|
|DFF114|[BPL3DAT](hardware/DFF114_BPL3DAT.md)|Bit plane 3 data (parallel to serial convert)|
|DFF116|[BPL4DAT](hardware/DFF116_BPL4DAT.md)|Bit plane 4 data (parallel to serial convert)|
|DFF118|[BPL5DAT](hardware/DFF118_BPL5DAT.md)|Bit plane 5 data (parallel to serial convert)|
|DFF11A|[BPL6DAT](hardware/DFF11A_BPL6DAT.md)|Bit plane 6 data (parallel to serial convert)|
|DFF11C|[BPL7DAT](hardware/DFF11C_BPL7DAT.md)|Bit plane 7 data (parallel to serial convert)|
|DFF11E|[BPL8DAT](hardware/DFF11E_BPL8DAT.md)|Bit plane 8 data (parallel to serial convert)|
|DFF120|[SPR0PT](hardware/DFF120_SPR0PT.md)|Sprite 0 pointer (high 5 bits)|
|DFF120|[SPR0PTH](hardware/DFF120_SPR0PTH.md)|Sprite 0 pointer (high 5 bits)|
|DFF122|[SPR0PTL](hardware/DFF122_SPR0PTL.md)|Sprite 0 pointer (low 15 bits)|
|DFF124|[SPR1PT](hardware/DFF124_SPR1PT.md)|Sprite 1 pointer (high 5 bits)|
|DFF124|[SPR1PTH](hardware/DFF124_SPR1PTH.md)|Sprite 1 pointer (high 5 bits)|
|DFF126|[SPR1PTL](hardware/DFF126_SPR1PTL.md)|Sprite 1 pointer (low 15 bits)|
|DFF128|[SPR2PT](hardware/DFF128_SPR2PT.md)|Sprite 2 pointer (high 5 bits)|
|DFF128|[SPR2PTH](hardware/DFF128_SPR2PTH.md)|Sprite 2 pointer (high 5 bits)|
|DFF12A|[SPR2PTL](hardware/DFF12A_SPR2PTL.md)|Sprite 2 pointer (low 15 bits)|
|DFF12C|[SPR3PT](hardware/DFF12C_SPR3PT.md)|Sprite 3 pointer (high 5 bits)|
|DFF12C|[SPR3PTH](hardware/DFF12C_SPR3PTH.md)|Sprite 3 pointer (high 5 bits)|
|DFF12E|[SPR3PTL](hardware/DFF12E_SPR3PTL.md)|Sprite 3 pointer (low 15 bits)|
|DFF130|[SPR4PT](hardware/DFF130_SPR4PT.md)|Sprite 4 pointer (high 5 bits)|
|DFF130|[SPR4PTH](hardware/DFF130_SPR4PTH.md)|Sprite 4 pointer (high 5 bits)|
|DFF132|[SPR4PTL](hardware/DFF132_SPR4PTL.md)|Sprite 4 pointer (low 15 bits)|
|DFF134|[SPR5PT](hardware/DFF134_SPR5PT.md)|Sprite 5 pointer (high 5 bits)|
|DFF134|[SPR5PTH](hardware/DFF134_SPR5PTH.md)|Sprite 5 pointer (high 5 bits)|
|DFF136|[SPR5PTL](hardware/DFF136_SPR5PTL.md)|Sprite 5 pointer (low 15 bits)|
|DFF138|[SPR6PT](hardware/DFF138_SPR6PT.md)|Sprite 6 pointer (high 5 bits)|
|DFF138|[SPR6PTH](hardware/DFF138_SPR6PTH.md)|Sprite 6 pointer (high 5 bits)|
|DFF13A|[SPR6PTL](hardware/DFF13A_SPR6PTL.md)|Sprite 6 pointer (low 15 bits)|
|DFF13C|[SPR7PT](hardware/DFF13C_SPR7PT.md)|Sprite 7 pointer (high 5 bits)|
|DFF13C|[SPR7PTH](hardware/DFF13C_SPR7PTH.md)|Sprite 7 pointer (high 5 bits)|
|DFF13E|[SPR7PTL](hardware/DFF13E_SPR7PTL.md)|Sprite 7 pointer (low 15 bits)|
|DFF140|[SPR0POS](hardware/DFF140_SPR0POS.md)|Sprite 0 vertical & horizontal start positions data|
|DFF142|[SPR0CTL](hardware/DFF142_SPR0CTL.md)|Sprite 0 position and control data|
|DFF144|[SPR0DATA](hardware/DFF144_SPR0DATA.md)|Sprite 0 image data register A|
|DFF146|[SPR0DATB](hardware/DFF146_SPR0DATB.md)|Sprite 0 image data register B|
|DFF148|[SPR1POS](hardware/DFF148_SPR1POS.md)|Sprite 1 vertical & horizontal start positions data|
|DFF14A|[SPR1CTL](hardware/DFF14A_SPR1CTL.md)|Sprite 1 position and control data|
|DFF14C|[SPR1DATA](hardware/DFF14C_SPR1DATA.md)|Sprite 1 image data register A|
|DFF14E|[SPR1DATB](hardware/DFF14E_SPR1DATB.md)|Sprite 1 image data register B|
|DFF150|[SPR2POS](hardware/DFF150_SPR2POS.md)|Sprite 2 vertical & horizontal start positions data|
|DFF152|[SPR2CTL](hardware/DFF152_SPR2CTL.md)|Sprite 2 position and control data|
|DFF154|[SPR2DATA](hardware/DFF154_SPR2DATA.md)|Sprite 2 image data register A|
|DFF156|[SPR2DATB](hardware/DFF156_SPR2DATB.md)|Sprite 2 image data register B|
|DFF158|[SPR3POS](hardware/DFF158_SPR3POS.md)|Sprite 3 vertical & horizontal start positions data|
|DFF15A|[SPR3CTL](hardware/DFF15A_SPR3CTL.md)|Sprite 3 position and control data|
|DFF15C|[SPR3DATA](hardware/DFF15C_SPR3DATA.md)|Sprite 3 image data register A|
|DFF15E|[SPR3DATB](hardware/DFF15E_SPR3DATB.md)|Sprite 3 image data register B|
|DFF160|[SPR4POS](hardware/DFF160_SPR4POS.md)|Sprite 4 vertical & horizontal start positions data|
|DFF162|[SPR4CTL](hardware/DFF162_SPR4CTL.md)|Sprite 4 position and control data|
|DFF164|[SPR4DATA](hardware/DFF164_SPR4DATA.md)|Sprite 4 image data register A|
|DFF166|[SPR4DATB](hardware/DFF166_SPR4DATB.md)|Sprite 4 image data register B|
|DFF168|[SPR5POS](hardware/DFF168_SPR5POS.md)|Sprite 5 vertical & horizontal start positions data|
|DFF16A|[SPR5CTL](hardware/DFF16A_SPR5CTL.md)|Sprite 5 position and control data|
|DFF16C|[SPR5DATA](hardware/DFF16C_SPR5DATA.md)|Sprite 5 image data register A|
|DFF16E|[SPR5DATB](hardware/DFF16E_SPR5DATB.md)|Sprite 5 image data register B|
|DFF170|[SPR6POS](hardware/DFF170_SPR6POS.md)|Sprite 6 vertical & horizontal start positions data|
|DFF172|[SPR6CTL](hardware/DFF172_SPR6CTL.md)|Sprite 6 position and control data|
|DFF174|[SPR6DATA](hardware/DFF174_SPR6DATA.md)|Sprite 6 image data register A|
|DFF176|[SPR6DATB](hardware/DFF176_SPR6DATB.md)|Sprite 6 image data register B|
|DFF178|[SPR7POS](hardware/DFF178_SPR7POS.md)|Sprite 7 vertical & horizontal start positions data|
|DFF17A|[SPR7CTL](hardware/DFF17A_SPR7CTL.md)|Sprite 7 position and control data|
|DFF17C|[SPR7DATA](hardware/DFF17C_SPR7DATA.md)|Sprite 7 image data register A|
|DFF17E|[SPR7DATB](hardware/DFF17E_SPR7DATB.md)|Sprite 7 image data register B|
|DFF180|[COLOR00](hardware/DFF180_COLOR00.md)|Color 0|
|DFF182|[COLOR01](hardware/DFF182_COLOR01.md)|Color 1|
|DFF184|[COLOR02](hardware/DFF184_COLOR02.md)|Color 2|
|DFF186|[COLOR03](hardware/DFF186_COLOR03.md)|Color 3|
|DFF188|[COLOR04](hardware/DFF188_COLOR04.md)|Color 4|
|DFF18a|[COLOR05](hardware/DFF18a_COLOR05.md)|Color 5|
|DFF18c|[COLOR06](hardware/DFF18c_COLOR06.md)|Color 6|
|DFF18e|[COLOR07](hardware/DFF18e_COLOR07.md)|Color 7|
|DFF190|[COLOR08](hardware/DFF190_COLOR08.md)|Color 8|
|DFF192|[COLOR09](hardware/DFF192_COLOR09.md)|Color 9|
|DFF194|[COLOR10](hardware/DFF194_COLOR10.md)|Color 10|
|DFF196|[COLOR11](hardware/DFF196_COLOR11.md)|Color 11|
|DFF198|[COLOR12](hardware/DFF198_COLOR12.md)|Color 12|
|DFF19a|[COLOR13](hardware/DFF19a_COLOR13.md)|Color 13|
|DFF19c|[COLOR14](hardware/DFF19c_COLOR14.md)|Color 14|
|DFF19e|[COLOR15](hardware/DFF19e_COLOR15.md)|Color 15|
|DFF1a0|[COLOR16](hardware/DFF1a0_COLOR16.md)|Color 16|
|DFF1a2|[COLOR17](hardware/DFF1a2_COLOR17.md)|Color 17|
|DFF1a4|[COLOR18](hardware/DFF1a4_COLOR18.md)|Color 18|
|DFF1a6|[COLOR19](hardware/DFF1a6_COLOR19.md)|Color 19|
|DFF1a8|[COLOR20](hardware/DFF1a8_COLOR20.md)|Color 20|
|DFF1aa|[COLOR21](hardware/DFF1aa_COLOR21.md)|Color 21|
|DFF1ac|[COLOR22](hardware/DFF1ac_COLOR22.md)|Color 22|
|DFF1ae|[COLOR23](hardware/DFF1ae_COLOR23.md)|Color 23|
|DFF1b0|[COLOR24](hardware/DFF1b0_COLOR24.md)|Color 24|
|DFF1b2|[COLOR25](hardware/DFF1b2_COLOR25.md)|Color 25|
|DFF1b4|[COLOR26](hardware/DFF1b4_COLOR26.md)|Color 26|
|DFF1b6|[COLOR27](hardware/DFF1b6_COLOR27.md)|Color 27|
|DFF1b8|[COLOR28](hardware/DFF1b8_COLOR28.md)|Color 28|
|DFF1ba|[COLOR29](hardware/DFF1ba_COLOR29.md)|Color 29|
|DFF1bc|[COLOR30](hardware/DFF1bc_COLOR30.md)|Color 30|
|DFF1be|[COLOR31](hardware/DFF1be_COLOR31.md)|Color 31|
|DFF1C0|[HTOTAL](hardware/DFF1C0_HTOTAL.md)|Highest colour clock count in horizontal line|
|DFF1C2|[HSSTOP](hardware/DFF1C2_HSSTOP.md)|Horizontal line position for SYNC stop|
|DFF1C4|[HBSTRT](hardware/DFF1C4_HBSTRT.md)|Horizontal START position|
|DFF1C6|[HBSTOP](hardware/DFF1C6_HBSTOP.md)|Horizontal STOP position|
|DFF1C8|[VTOTAL](hardware/DFF1C8_VTOTAL.md)|Highest numbered vertical line (VERBEAMEN = 1)|
|DFF1CA|[VSSTOP](hardware/DFF1CA_VSSTOP.md)|Vertical position for VSYNC stop|
|DFF1CC|[VBSTRT](hardware/DFF1CC_VBSTRT.md)|Vertical line for VBLANK start|
|DFF1CE|[VBSTOP](hardware/DFF1CE_VBSTOP.md)|Vertical line for VBLANK stop|
|DFF1D0|[SPRHSTRT](hardware/DFF1D0_SPRHSTRT.md)|UHRES sprite vertical display start|
|DFF1D2|[SPRHSTOP](hardware/DFF1D2_SPRHSTOP.md)|UHRES sprite vertical display stop|
|DFF1D4|[BLTHSTRT](hardware/DFF1D4_BLTHSTRT.md)|UHRES bit plane vertical stop|
|DFF1D6|[BPLHSTOP](hardware/DFF1D6_BPLHSTOP.md)|UHRES bit plane vertical stop|
|DFF1D8|[HHPOSW](hardware/DFF1D8_HHPOSW.md)|DUAL mode hires Hbeam counter write|
|DFF1DA|[HHPOSR](hardware/DFF1DA_HHPOSR.md)|DUAL mode hires Hbeam counter read|
|DFF1DC|[BEAMCON0](hardware/DFF1DC_BEAMCON0.md)|Beam Counter Control Bits|
|DFF1DE|[HSSTRT](hardware/DFF1DE_HSSTRT.md)|Horiz line position for HSYNC stop|
|DFF1E0|[VSSTRT](hardware/DFF1E0_VSSTRT.md)|Vertical sync start (VARVSY)|
|DFF1E2|[HCENTER](hardware/DFF1E2_HCENTER.md)|Horizontal position (CCKs) of VSYNC on long field|
|DFF1E4|[DIWHIGH](hardware/DFF1E4_DIWHIGH.md)|Display window upper bits for start, stop|
|DFF1E6|[BPLHMOD](hardware/DFF1E6_BPLHMOD.md)|UHRES bit plane modulo|
|DFF1E8|[SPRHPT](hardware/DFF1E8_SPRHPT.md)|UHRES sprite pointer (high 5 bits)|
|DFF1E8|[SPRHPTH](hardware/DFF1E8_SPRHPTH.md)|UHRES sprite pointer (high 5 bits)|
|DFF1EA|[SPRHPTL](hardware/DFF1EA_SPRHPTL.md)|UHRES sprite pointer (low 15 bits)|
|DFF1EC|[BPLHPT](hardware/DFF1EC_BPLHPT.md)|UHRES (VRAM) bit plane pointer (high 5 bits)|
|DFF1EC|[BPLHPTH](hardware/DFF1EC_BPLHPTH.md)|UHRES (VRAM) bit plane pointer (high 5 bits)|
|DFF1EE|[BPLHPTL](hardware/DFF1EE_BPLHPTL.md)|UHRES (VRAM) bit plane pointer (low 15 bits)|
|DFF1FC|[FMODE](hardware/DFF1FC_FMODE.md)|Memory Fetch Mode|

## Amiga libraries

### diskfont

| Function | Description |
|:---|:---|
|[AvailFonts](libs/diskfont/AvailFonts.md)|Inquire available memory &#038; disk fonts.|
|[DisposeFontContents](libs/diskfont/DisposeFontContents.md)|Free the result from [NewFontContents](NewFontContents.md). (V34)|
|[NewFontContents](libs/diskfont/NewFontContents.md)|Create a [FontContents](_0102.md) image for a font. (V34)|
|[NewScaledDiskFont](libs/diskfont/NewScaledDiskFont.md)|Create a DiskFont scaled from another. (V36)|
|[OpenDiskFont](libs/diskfont/OpenDiskFont.md)|OpenDiskFont - load and get a pointer to a disk font.|

### dos

| Function | Description |
|:---|:---|
|[AbortPkt](libs/dos/AbortPkt.md)|Aborts an asynchronous packet, if possible. (V36)|
|[AddBuffers](libs/dos/AddBuffers.md)|Changes the number of buffers for a filesystem (V36)|
|[AddDosEntry](libs/dos/AddDosEntry.md)|Add a Dos [List](_007D.md) entry to the lists (V36)|
|[AddPart](libs/dos/AddPart.md)|Appends a file/dir to the end of a path (V36)|
|[AddSegment](libs/dos/AddSegment.md)|AddSegment - Adds a resident segment to the resident list (V36)|
|[AllocDosObject](libs/dos/AllocDosObject.md)|Creates a dos object (V36)|
|[AssignAdd](libs/dos/AssignAdd.md)|Adds a lock to an assign for multi-directory assigns (V36)|
|[AssignLate](libs/dos/AssignLate.md)|Creates an assignment to a specified path later (V36)|
|[AssignLock](libs/dos/AssignLock.md)|Creates an assignment to a locked object (V36)|
|[AssignPath](libs/dos/AssignPath.md)|Creates an assignment to a specified path (V36)|
|[AttemptLockDosList](libs/dos/AttemptLockDosList.md)|Attempt to lock the Dos Lists for use (V36)|
|[ChangeMode](libs/dos/ChangeMode.md)|ChangeMode - Change the current mode of a lock or filehandle (V36)|
|[CheckSignal](libs/dos/CheckSignal.md)|Checks for break signals (V36)|
|[Cli](libs/dos/Cli.md)|Returns a pointer to the CLI structure of the process (V36)|
|[CliInitNewcli](libs/dos/CliInitNewcli.md)|Set up a process to be a shell from initial packet|
|[CliInitRun](libs/dos/CliInitRun.md)|Set up a process to be a shell from initial packet|
|[Close](libs/dos/Close.md)|Close an open file|
|[CompareDates](libs/dos/CompareDates.md)|Compares two datestamps (V36)|
|[CreateDir](libs/dos/CreateDir.md)|Create a new directory|
|[CreateNewProc](libs/dos/CreateNewProc.md)|Create a new process (V36)|
|[CreateProc](libs/dos/CreateProc.md)|Create a new process|
|[CurrentDir](libs/dos/CurrentDir.md)|Make a directory lock the current directory|
|[DateStamp](libs/dos/DateStamp.md)|Obtain the date and time in internal format|
|[DateToStr](libs/dos/DateToStr.md)|Converts a [DateStamp](_0068.md) to a string (V36)|
|[Delay](libs/dos/Delay.md)|Delay a process for a specified time|
|[DeleteFile](libs/dos/DeleteFile.md)|Delete a file or directory|
|[DeleteVar](libs/dos/DeleteVar.md)|Deletes a local or environment variable (V36)|
|[DeviceProc](libs/dos/DeviceProc.md)|Return the process [MsgPort](_0099.md) of specific I/O handler|
|[DoPkt](libs/dos/DoPkt.md)|Send a dos packet and wait for reply (V36)|
|[DupLock](libs/dos/DupLock.md)|Duplicate a lock|
|[DupLockFromFH](libs/dos/DupLockFromFH.md)|Gets a lock on an open file (V36)|
|[EndNotify](libs/dos/EndNotify.md)|Ends a notification request (V36)|
|[ErrorReport](libs/dos/ErrorReport.md)|Displays a Retry/Cancel requester for an error (V36)|
|[ExAll](libs/dos/ExAll.md)|Examine an entire directory (V36)|
|[Examine](libs/dos/Examine.md)|Examine a directory or file associated with a lock|
|[ExamineFH](libs/dos/ExamineFH.md)|Gets information on an open file (V36)|
|[Execute](libs/dos/Execute.md)|Execute a CLI command|
|[Exit](libs/dos/Exit.md)|Exit from a program|
|[ExNext](libs/dos/ExNext.md)|Examine the next entry in a directory|
|[Fault](libs/dos/Fault.md)|Returns the text associated with a DOS error code (V36)|
|[FGetC](libs/dos/FGetC.md)|Read a character from the specified input (buffered) (V36)|
|[FGets](libs/dos/FGets.md)|Reads a line from the specified input (buffered) (V36)|
|[FilePart](libs/dos/FilePart.md)|Returns the last component of a path (V36)|
|[FindArg](libs/dos/FindArg.md)|FindArg - find a keyword in a template (V36)|
|[FindCliProc](libs/dos/FindCliProc.md)|returns a pointer to the requested CLI process (V36)|
|[FindDosEntry](libs/dos/FindDosEntry.md)|Finds a specific Dos [List](_007D.md) entry (V36)|
|[FindSegment](libs/dos/FindSegment.md)|FindSegment - Finds a segment on the resident list (V36)|
|[FindVar](libs/dos/FindVar.md)|Finds a local variable (V36)|
|[Flush](libs/dos/Flush.md)|Flushes buffers for a buffered filehandle (V36)|
|[Format](libs/dos/Format.md)|Causes a filesystem to initialize itself (V36)|
|[FPutC](libs/dos/FPutC.md)|Write a character to the specified output (buffered) (V36)|
|[FPuts](libs/dos/FPuts.md)|Writes a string the the specified output (buffered) (V36)|
|[FRead](libs/dos/FRead.md)|Reads a number of blocks from an input (buffered) (V36)|
|[FreeArgs](libs/dos/FreeArgs.md)|FreeArgs - Free allocated memory after [ReadArgs](ReadArgs.md) (V36)|
|[FreeDeviceProc](libs/dos/FreeDeviceProc.md)|Releases port returned by [GetDeviceProc](GetDeviceProc.md) (V36)|
|[FreeDosEntry](libs/dos/FreeDosEntry.md)|Frees an entry created by [MakeDosEntry](MakeDosEntry.md) (V36)|
|[FreeDosObject](libs/dos/FreeDosObject.md)|Frees an object allocated by [AllocDosObject](AllocDosObject.md) (V36)|
|[FWrite](libs/dos/FWrite.md)|Writes a number of blocks to an output (buffered) (V36)|
|[GetArgStr](libs/dos/GetArgStr.md)|Returns the arguments for the process (V36)|
|[GetConsoleTask](libs/dos/GetConsoleTask.md)|Returns the default console for the process (V36)|
|[GetCurrentDirName](libs/dos/GetCurrentDirName.md)|returns the current directory name (V36)|
|[GetDeviceProc](libs/dos/GetDeviceProc.md)|Finds a handler to send a message to (V36)|
|[GetFileSysTask](libs/dos/GetFileSysTask.md)|Returns the default filesystem for the process (V36)|
|[GetProgramDir](libs/dos/GetProgramDir.md)|Returns a lock on the directory the program was loadedfrom (V36)|
|[GetProgramName](libs/dos/GetProgramName.md)|Returns the current program name (V36)|
|[GetPrompt](libs/dos/GetPrompt.md)|Returns the prompt for the current process (V36)|
|[GetVar](libs/dos/GetVar.md)|Returns the value of a local or global variable (V36)|
|[Info](libs/dos/Info.md)|Returns information about the disk|
|[Inhibit](libs/dos/Inhibit.md)|Inhibits access to a filesystem (V36)|
|[Input](libs/dos/Input.md)|Identify the program's initial input file handle|
|[InternalLoadSeg](libs/dos/InternalLoadSeg.md)|Low-level load routine (V36)|
|[InternalUnLoadSeg](libs/dos/InternalUnLoadSeg.md)|Unloads a seglist loaded with [InternalLoadSeg](InternalLoadSeg.md)(V36)|
|[IoErr](libs/dos/IoErr.md)|Return extra information from the system|
|[IsFileSystem](libs/dos/IsFileSystem.md)|returns whether a Dos handler is a filesystem (V36)|
|[IsInteractive](libs/dos/IsInteractive.md)|Discover whether a file is &#034;interactive&#034;|
|[LoadSeg](libs/dos/LoadSeg.md)|Scatterload a loadable file into memory|
|[Lock](libs/dos/Lock.md)|Lock a directory or file|
|[LockDosList](libs/dos/LockDosList.md)|Locks the specified Dos Lists for use (V36)|
|[LockRecord](libs/dos/LockRecord.md)|Locks a portion of a file (V36)|
|[LockRecords](libs/dos/LockRecords.md)|Lock a series of records (V36)|
|[MakeDosEntry](libs/dos/MakeDosEntry.md)|Creates a [DosList](_0078.md) structure (V36)|
|[MakeLink](libs/dos/MakeLink.md)|Creates a filesystem link (V36)|
|[MatchEnd](libs/dos/MatchEnd.md)|Free storage allocated for MatchFirst()/MatchNext() (V36)|
|[MatchFirst](libs/dos/MatchFirst.md)|Finds file that matches pattern (V36)|
|[MatchNext](libs/dos/MatchNext.md)|MatchNext - Finds the next file or directory that matches pattern (V36)|
|[MatchPattern](libs/dos/MatchPattern.md)|Checks for a pattern match with a string (V36)|
|[MatchPatternNoCase](libs/dos/MatchPatternNoCase.md)|Checks for a pattern match with a string (V37)|
|[MaxCli](libs/dos/MaxCli.md)|returns the highest CLI process number possibly in use (V36)|
|[NameFromFH](libs/dos/NameFromFH.md)|Get the name of an open filehandle (V36)|
|[NameFromLock](libs/dos/NameFromLock.md)|Returns the name of a locked object (V36)|
|[NewLoadSeg](libs/dos/NewLoadSeg.md)|Improved version of [LoadSeg](LoadSeg.md) for stacksizes (V36)|
|[NextDosEntry](libs/dos/NextDosEntry.md)|Get the next Dos [List](_007D.md) entry (V36)|
|[Open](libs/dos/Open.md)|Open a file for input or output|
|[OpenFromLock](libs/dos/OpenFromLock.md)|Opens a file you have a lock on (V36)|
|[Output](libs/dos/Output.md)|Identify the programs' initial output file handle|
|[ParentDir](libs/dos/ParentDir.md)|Obtain the parent of a directory or file|
|[ParentOfFH](libs/dos/ParentOfFH.md)|returns a lock on the parent directory of a file (V36)|
|[ParsePattern](libs/dos/ParsePattern.md)|Create a tokenized string for [MatchPattern](MatchPattern.md) (V36)|
|[ParsePatternNoCase](libs/dos/ParsePatternNoCase.md)|Create a tokenized string for[MatchPatternNoCase](MatchPatternNoCase.md) (V37)|
|[PathPart](libs/dos/PathPart.md)|Returns a pointer to the end of the next-to-last (V36)component of a path.|
|[PrintFault](libs/dos/PrintFault.md)|Returns the text associated with a DOS error code (V36)|
|[PutStr](libs/dos/PutStr.md)|Writes a string the the default output (buffered) (V36)|
|[Read](libs/dos/Read.md)|Read bytes of data from a file|
|[ReadArgs](libs/dos/ReadArgs.md)|ReadArgs - Parse the command line input (V36)|
|[ReadItem](libs/dos/ReadItem.md)|ReadItem - reads a single argument/name from command line (V36)|
|[ReadLink](libs/dos/ReadLink.md)|Reads the path for a soft filesystem link (V36)|
|[Relabel](libs/dos/Relabel.md)|Change the volume name of a volume (V36)|
|[RemAssignList](libs/dos/RemAssignList.md)|Remove an entry from a multi-dir assign (V36)|
|[RemDosEntry](libs/dos/RemDosEntry.md)|Removes a Dos [List](_007D.md) entry from it's list (V36)|
|[RemSegment](libs/dos/RemSegment.md)|RemSegment - Removes a resident segment from the resident list (V36)|
|[Rename](libs/dos/Rename.md)|Rename a directory or file|
|[ReplyPkt](libs/dos/ReplyPkt.md)|replies a packet to the person who sent it to you (V36)|
|[RunCommand](libs/dos/RunCommand.md)|Runs a program using the current process (V36)|
|[SameDevice](libs/dos/SameDevice.md)|Are two locks are on partitions of the device? (V37)|
|[SameLock](libs/dos/SameLock.md)|returns whether two locks are on the same object (V36)|
|[Seek](libs/dos/Seek.md)|Set the current position for reading and writing|
|[SelectInput](libs/dos/SelectInput.md)|Select a filehandle as the default input channel (V36)|
|[SelectOutput](libs/dos/SelectOutput.md)|Select a filehandle as the default input channel (V36)|
|[SendPkt](libs/dos/SendPkt.md)|Sends a packet to a handler (V36)|
|[SetArgStr](libs/dos/SetArgStr.md)|Sets the arguments for the current process (V36)|
|[SetComment](libs/dos/SetComment.md)|Change a files' comment string|
|[SetConsoleTask](libs/dos/SetConsoleTask.md)|Sets the default console for the process (V36)|
|[SetCurrentDirName](libs/dos/SetCurrentDirName.md)|Sets the directory name for the process (V36)|
|[SetFileDate](libs/dos/SetFileDate.md)|Sets the modification date for a file or dir (V36)|
|[SetFileSize](libs/dos/SetFileSize.md)|Sets the size of a file (V36)|
|[SetFileSysTask](libs/dos/SetFileSysTask.md)|Sets the default filesystem for the process (V36)|
|[SetIoErr](libs/dos/SetIoErr.md)|Sets the value returned by [IoErr](IoErr.md) (V36)|
|[SetMode](libs/dos/SetMode.md)|SetMode - Set the current behavior of a handler (V36)|
|[SetProgramDir](libs/dos/SetProgramDir.md)|Sets the directory returned by [GetProgramDir](GetProgramDir.md) (V36)|
|[SetProgramName](libs/dos/SetProgramName.md)|Sets the name of the program being run (V36)|
|[SetPrompt](libs/dos/SetPrompt.md)|Sets the CLI/shell prompt for the current process (V36)|
|[SetProtection](libs/dos/SetProtection.md)|Set protection for a file or directory|
|[SetVar](libs/dos/SetVar.md)|Sets a local or environment variable (V36)|
|[SetVBuf](libs/dos/SetVBuf.md)|set buffering modes and size (V36)|
|[SplitName](libs/dos/SplitName.md)|splits out a component of a pathname into a buffer (V36)|
|[StartNotify](libs/dos/StartNotify.md)|Starts notification on a file or directory (V36)|
|[StrToDate](libs/dos/StrToDate.md)|Converts a string to a [DateStamp](_0068.md) (V36)|
|[StrToLong](libs/dos/StrToLong.md)|string to long value (decimal) (V36)|
|[SystemTagList](libs/dos/SystemTagList.md)|Have a shell execute a command line (V36)|
|[UnGetC](libs/dos/UnGetC.md)|Makes a char available for reading again. (buffered) (V36)|
|[UnLoadSeg](libs/dos/UnLoadSeg.md)|Unload a seglist previously loaded by [LoadSeg](LoadSeg.md)|
|[UnLock](libs/dos/UnLock.md)|Unlock a directory or file|
|[UnLockDosList](libs/dos/UnLockDosList.md)|Unlocks the Dos [List](_007D.md) (V36)|
|[UnLockRecord](libs/dos/UnLockRecord.md)|Unlock a record (V36)|
|[UnLockRecords](libs/dos/UnLockRecords.md)|Unlock a list of records (V36)|
|[VFPrintf](libs/dos/VFPrintf.md)|format and print a string to a file (buffered) (V36)|
|[VFWritef](libs/dos/VFWritef.md)|VFWritef - write a BCPL formatted string to a file (buffered) (V36)|
|[VPrintf](libs/dos/VPrintf.md)|format and print string (buffered) (V36)|
|[WaitForChar](libs/dos/WaitForChar.md)|Determine if chars arrive within a time limit|
|[WaitPkt](libs/dos/WaitPkt.md)|Waits for a packet to arrive at your pr_MsgPort (V36)|
|[Write](libs/dos/Write.md)|Write bytes of data to a file|
|[WriteChars](libs/dos/WriteChars.md)|Writes bytes to the the default output (buffered) (V36)|

### exec

| Function | Description |
|:---|:---|
|[AbortIO](libs/exec/AbortIO.md)|AbortIO - attempt to abort an in-progress I/O request|
|[AddDevice](libs/exec/AddDevice.md)|add a device to the system|
|[AddHead](libs/exec/AddHead.md)|insert node at the head of a list|
|[AddIntServer](libs/exec/AddIntServer.md)|add an interrupt server to a system server chain|
|[AddLibrary](libs/exec/AddLibrary.md)|add a library to the system|
|[AddMemList](libs/exec/AddMemList.md)|AddMemList - add memory to the system free pool|
|[AddPort](libs/exec/AddPort.md)|add a public message port to the system|
|[AddResource](libs/exec/AddResource.md)|add a resource to the system|
|[AddSemaphore](libs/exec/AddSemaphore.md)|initialize then add a signal semaphore to the system|
|[AddTail](libs/exec/AddTail.md)|append node to tail of a list|
|[AddTask](libs/exec/AddTask.md)|add a task to the system|
|[Alert](libs/exec/Alert.md)|alert the user of an error|
|[AllocAbs](libs/exec/AllocAbs.md)|allocate at a given location|
|[Allocate](libs/exec/Allocate.md)|Allocate - allocate a block of memory|
|[AllocEntry](libs/exec/AllocEntry.md)|allocate many regions of memory|
|[AllocMem](libs/exec/AllocMem.md)|allocate memory given certain requirements|
|[AllocSignal](libs/exec/AllocSignal.md)|allocate a signal bit|
|[AllocTrap](libs/exec/AllocTrap.md)|allocate a processor trap vector|
|[AllocVec](libs/exec/AllocVec.md)|allocate memory and keep track of the size  (V36)|
|[AttemptSemaphore](libs/exec/AttemptSemaphore.md)|try to obtain without blocking|
|[AvailMem](libs/exec/AvailMem.md)|memory available given certain requirements|
|[CacheClearE](libs/exec/CacheClearE.md)|CacheClearE - Cache clearing with extended control (V37)|
|[CacheClearU](libs/exec/CacheClearU.md)|CacheClearU - User callable simple cache clearing (V37)|
|[CacheControl](libs/exec/CacheControl.md)|CacheControl - Instruction &#038; data cache control|
|[CachePostDMA](libs/exec/CachePostDMA.md)|CachePostDMA - Take actions after to hardware DMA  (V37)|
|[CachePreDMA](libs/exec/CachePreDMA.md)|CachePreDMA - Take actions prior to hardware DMA  (V37)|
|[Cause](libs/exec/Cause.md)|cause a software interrupt|
|[CheckIO](libs/exec/CheckIO.md)|get the status of an [IORequest](_0094.md)|
|[CloseDevice](libs/exec/CloseDevice.md)|conclude access to a device|
|[CloseLibrary](libs/exec/CloseLibrary.md)|conclude access to a library|
|[ColdReboot](libs/exec/ColdReboot.md)|ColdReboot - reboot the Amiga (V36)|
|[CopyMem](libs/exec/CopyMem.md)|CopyMem - general purpose memory copy function|
|[CopyMemQuick](libs/exec/CopyMemQuick.md)|CopyMemQuick - optimized memory copy function|
|[CreateIORequest](libs/exec/CreateIORequest.md)|create an [IORequest](_0094.md) structure  (V36)|
|[CreateMsgPort](libs/exec/CreateMsgPort.md)|CreateMsgPort - Allocate and initialize a new message port  (V36)|
|[Deallocate](libs/exec/Deallocate.md)|deallocate a block of memory|
|[Debug](libs/exec/Debug.md)|run the system debugger|
|[DeleteIORequest](libs/exec/DeleteIORequest.md)|DeleteIORequest() - Free a request made by [CreateIORequest](CreateIORequest.md)  (V36)|
|[DeleteMsgPort](libs/exec/DeleteMsgPort.md)|DeleteMsgPort - Free a message port created by [CreateMsgPort](CreateMsgPort.md)  (V36)|
|[Disable](libs/exec/Disable.md)|disable interrupt processing.|
|[DoIO](libs/exec/DoIO.md)|perform an I/O command and wait for completion|
|[Enable](libs/exec/Enable.md)|permit system interrupts to resume.|
|[Enqueue](libs/exec/Enqueue.md)|insert or append node to a system queue|
|[FindName](libs/exec/FindName.md)|find a system list node with a given name|
|[FindPort](libs/exec/FindPort.md)|find a given system message port|
|[FindResident](libs/exec/FindResident.md)|FindResident - find a resident module by name|
|[FindSemaphore](libs/exec/FindSemaphore.md)|find a given system signal semaphore|
|[FindTask](libs/exec/FindTask.md)|find a task with the given name or find oneself|
|[Forbid](libs/exec/Forbid.md)|forbid task rescheduling.|
|[FreeEntry](libs/exec/FreeEntry.md)|free many regions of memory|
|[FreeMem](libs/exec/FreeMem.md)|deallocate with knowledge|
|[FreeSignal](libs/exec/FreeSignal.md)|free a signal bit|
|[FreeTrap](libs/exec/FreeTrap.md)|free a processor trap|
|[FreeVec](libs/exec/FreeVec.md)|return [AllocVec](AllocVec.md) memory to the system  (V36)|
|[GetCC](libs/exec/GetCC.md)|get condition codes in a 68010 compatible way.|
|[GetMsg](libs/exec/GetMsg.md)|get next message from a message port|
|[InitCode](libs/exec/InitCode.md)|InitCode - initialize resident code modules (internal function)|
|[InitResident](libs/exec/InitResident.md)|InitResident - initialize resident module|
|[InitSemaphore](libs/exec/InitSemaphore.md)|initialize a signal semaphore|
|[InitStruct](libs/exec/InitStruct.md)|InitStruct - initialize memory from a table|
|[Insert](libs/exec/Insert.md)|insert a node into a list|
|[MakeFunctions](libs/exec/MakeFunctions.md)|construct a function jump table|
|[MakeLibrary](libs/exec/MakeLibrary.md)|construct a library|
|[ObtainSemaphore](libs/exec/ObtainSemaphore.md)|gain exclusive access to a semaphore|
|[ObtainSemaphoreList](libs/exec/ObtainSemaphoreList.md)|get a list of semaphores.|
|[ObtainSemaphoreShared](libs/exec/ObtainSemaphoreShared.md)|gain shared access to a semaphore (V36)|
|[OldOpenLibrary](libs/exec/OldOpenLibrary.md)|obsolete [OpenLibrary](OpenLibrary.md)|
|[OpenDevice](libs/exec/OpenDevice.md)|gain access to a device|
|[OpenLibrary](libs/exec/OpenLibrary.md)|gain access to a library|
|[OpenResource](libs/exec/OpenResource.md)|gain access to a resource|
|[Permit](libs/exec/Permit.md)|permit task rescheduling.|
|[Procure](libs/exec/Procure.md)|bid for a message lock (semaphore)|
|[PutMsg](libs/exec/PutMsg.md)|put a message to a message port|
|[RawDoFmt](libs/exec/RawDoFmt.md)|format data into a character stream.|
|[ReleaseSemaphore](libs/exec/ReleaseSemaphore.md)|make signal semaphore available to others|
|[ReleaseSemaphoreList](libs/exec/ReleaseSemaphoreList.md)|make a list of semaphores available|
|[RemDevice](libs/exec/RemDevice.md)|remove a device from the system|
|[RemHead](libs/exec/RemHead.md)|remove the head node from a list|
|[RemIntServer](libs/exec/RemIntServer.md)|remove an interrupt server from a server chain|
|[RemLibrary](libs/exec/RemLibrary.md)|remove a library from the system|
|[Remove](libs/exec/Remove.md)|remove a node from a list|
|[RemPort](libs/exec/RemPort.md)|remove a message port from the system|
|[RemResource](libs/exec/RemResource.md)|remove a resource from the system|
|[RemSemaphore](libs/exec/RemSemaphore.md)|remove a signal semaphore from the system|
|[RemTail](libs/exec/RemTail.md)|remove the tail node from a list|
|[RemTask](libs/exec/RemTask.md)|remove a task from the system|
|[ReplyMsg](libs/exec/ReplyMsg.md)|put a message to its reply port|
|[SendIO](libs/exec/SendIO.md)|initiate an I/O command|
|[SetExcept](libs/exec/SetExcept.md)|define certain signals to cause exceptions|
|[SetFunction](libs/exec/SetFunction.md)|change a function vector in a library|
|[SetIntVector](libs/exec/SetIntVector.md)|set a new handler for a system interrupt vector|
|[SetSignal](libs/exec/SetSignal.md)|define the state of this task's signals|
|[SetSR](libs/exec/SetSR.md)|get and/or set processor status register|
|[SetTaskPri](libs/exec/SetTaskPri.md)|get and set the priority of a task|
|[Signal](libs/exec/Signal.md)|signal a task|
|[StackSwap](libs/exec/StackSwap.md)|StackSwap - EXEC supported method of replacing task's stack      (V37)|
|[SumKickData](libs/exec/SumKickData.md)|compute the checksum for the Kickstart delta list|
|[SumLibrary](libs/exec/SumLibrary.md)|compute and check the checksum on a library|
|[SuperState](libs/exec/SuperState.md)|enter supervisor state with user stack|
|[Supervisor](libs/exec/Supervisor.md)|trap to a short supervisor mode function|
|[TypeOfMem](libs/exec/TypeOfMem.md)|determine attributes of a given memory address|
|[UserState](libs/exec/UserState.md)|return to user state with user stack|
|[Vacate](libs/exec/Vacate.md)|release a message lock (semaphore)|
|[Wait](libs/exec/Wait.md)|wait for one or more signals|
|[WaitIO](libs/exec/WaitIO.md)|wait for completion of an I/O request|
|[WaitPort](libs/exec/WaitPort.md)|wait for a given port to be non-empty|

### graphics

| Function | Description |
|:---|:---|
|[AddAnimOb](libs/graphics/AddAnimOb.md)|Add an [AnimOb](_00C3.md) to the linked list of AnimObs.|
|[AddBob](libs/graphics/AddBob.md)|Adds a [Bob](_00C3.md) to current gel list.|
|[AddFont](libs/graphics/AddFont.md)|add a font to the system list|
|[AddVSprite](libs/graphics/AddVSprite.md)|Add a [VSprite](_00C3.md) to the current gel list.|
|[AllocRaster](libs/graphics/AllocRaster.md)|Allocate space for a bitplane.|
|[AndRectRegion](libs/graphics/AndRectRegion.md)|Perform 2d AND operation of rectanglewith region, leaving result in region.|
|[AndRegionRegion](libs/graphics/AndRegionRegion.md)|Perform 2d AND operation of one regionwith second region, leaving result in second region.|
|[Animate](libs/graphics/Animate.md)|Processes every [AnimOb](_00C3.md) in the current animation list.|
|[AreaCircle](libs/graphics/AreaCircle.md)|add a circle to areainfo list for areafill.|
|[AreaDraw](libs/graphics/AreaDraw.md)|Add a point to a list of end points for areafill.|
|[AreaEllipse](libs/graphics/AreaEllipse.md)|add a ellipse to areainfo list for areafill.|
|[AreaEnd](libs/graphics/AreaEnd.md)|[Process](_0078.md) table of vectors and ellipses and produce areafill.|
|[AreaMove](libs/graphics/AreaMove.md)|Define a new starting point for a newshape in the vector list.|
|[AskFont](libs/graphics/AskFont.md)|get the text attributes of the current font|
|[AskSoftStyle](libs/graphics/AskSoftStyle.md)|Get the soft style bits of the current font.|
|[AttemptLockLayerRom](libs/graphics/AttemptLockLayerRom.md)|Attempt to Lock [Layer](_00A1.md) structureby rom(gfx lib) code|
|[BitMapScale](libs/graphics/BitMapScale.md)|Perform raster scaling on a bit map. (V36)|
|[BltBitMap](libs/graphics/BltBitMap.md)|Move a rectangular region of bits in a [BitMap](_00A6.md).|
|[BltBitMapRastPort](libs/graphics/BltBitMapRastPort.md)|Blit from source bitmap to destination rastport.|
|[BltClear](libs/graphics/BltClear.md)|BltClear - Clear a block of memory words to zero.|
|[BltMaskBitMapRastPort](libs/graphics/BltMaskBitMapRastPort.md)|blit from source bitmap to destinationrastport with masking of source image.|
|[BltPattern](libs/graphics/BltPattern.md)|Using standard drawing rules for areafill,blit through a mask.|
|[BltTemplate](libs/graphics/BltTemplate.md)|Cookie cut a shape in a rectangle to the [RastPort](_00AF.md).|
|[CBump](libs/graphics/CBump.md)|increment user copper list pointer (bump to next positionin list).|
|[CEND](libs/graphics/CEND.md)|Terminate user copper list.|
|[ChangeSprite](libs/graphics/ChangeSprite.md)|Change the sprite image pointer.|
|[CINIT](libs/graphics/CINIT.md)|Initialize user copperlist to accept intermediateuser copper instructions.|
|[ClearEOL](libs/graphics/ClearEOL.md)|Clear from current position to end of line.|
|[ClearRectRegion](libs/graphics/ClearRectRegion.md)|Perform 2d CLEAR operation of rectanglewith region, leaving result in region.|
|[ClearRegion](libs/graphics/ClearRegion.md)|Remove all rectangles from region.|
|[ClearScreen](libs/graphics/ClearScreen.md)|Clear from current position to end of [RastPort](_00AF.md).|
|[ClipBlit](libs/graphics/ClipBlit.md)|Calls [BltBitMap](BltBitMap.md) after accounting for windows|
|[CloseFont](libs/graphics/CloseFont.md)|Release a pointer to a system font.|
|[CloseMonitor](libs/graphics/CloseMonitor.md)|close a [MonitorSpec](_00A7.md) (V36)|
|[CMOVE](libs/graphics/CMOVE.md)|append copper move instruction to user copper list.|
|[CopySBitMap](libs/graphics/CopySBitMap.md)|Syncronize [Layer](_00A1.md) window with contents ofSuper [BitMap](_00A6.md)|
|[CWAIT](libs/graphics/CWAIT.md)|Append copper wait instruction to user copper list.|
|[DisownBlitter](libs/graphics/DisownBlitter.md)|DisownBlitter - return blitter to free state.|
|[DisposeRegion](libs/graphics/DisposeRegion.md)|Return all space for this region to freememory pool.|
|[DoCollision](libs/graphics/DoCollision.md)|Test every gel in gel list for collisions.|
|[Draw](libs/graphics/Draw.md)|Draw a line between the current pen positionand the new x,y position.|
|[DrawEllipse](libs/graphics/DrawEllipse.md)|Draw an ellipse centered at cx,cy with verticaland horizontal radii of a,b respectively.|
|[DrawGList](libs/graphics/DrawGList.md)|[Process](_0078.md) the gel list, queueing VSprites, drawing Bobs.|
|[EraseRect](libs/graphics/EraseRect.md)|Fill a defined rectangular area using the currentBackFill hook. (V36)|
|[ExtendFont](libs/graphics/ExtendFont.md)|ensure tf_Extension has been built for a font (V36)|
|[FindDisplayInfo](libs/graphics/FindDisplayInfo.md)|search for a record identified by a specific key(V36)|
|[Flood](libs/graphics/Flood.md)|Flood rastport like areafill.|
|[FontExtent](libs/graphics/FontExtent.md)|get the font attributes of the current font (V36)|
|[FreeColorMap](libs/graphics/FreeColorMap.md)|Free the [ColorMap](_00B8.md) structure and return memoryto free memory pool.|
|[FreeCopList](libs/graphics/FreeCopList.md)|deallocate intermediate copper list|
|[FreeCprList](libs/graphics/FreeCprList.md)|deallocate hardware copper list|
|[FreeGBuffers](libs/graphics/FreeGBuffers.md)|Deallocate memory obtained by GetGBufers.|
|[FreeRaster](libs/graphics/FreeRaster.md)|Release an allocated area to the system free memory pool.|
|[FreeSprite](libs/graphics/FreeSprite.md)|Return sprite for use by others and virtualsprite machine.|
|[FreeVPortCopLists](libs/graphics/FreeVPortCopLists.md)|deallocate all intermediate copper lists andtheir headers from a viewport|
|[GetColorMap](libs/graphics/GetColorMap.md)|allocate and initialize Colormap|
|[GetDisplayInfoData](libs/graphics/GetDisplayInfoData.md)|query [DisplayInfo](_00BD.md) Record parameters (V36)|
|[GetGBuffers](libs/graphics/GetGBuffers.md)|Attempt to allocate ALL buffers of an entire [AnimOb](_00C3.md).|
|[GetRGB4](libs/graphics/GetRGB4.md)|Inquire value of entry in [ColorMap](_00B8.md).|
|[GetSprite](libs/graphics/GetSprite.md)|Attempt to get a sprite for the simple spritemanager.|
|[GetVPModeID](libs/graphics/GetVPModeID.md)|get the 32 bit DisplayID from a [ViewPort](_00B8.md). (V36)|
|[GfxAssociate](libs/graphics/GfxAssociate.md)|associate a graphics extended node with a given pointer(V36)|
|[GfxFree](libs/graphics/GfxFree.md)|free a graphics extended data structure (V36)|
|[GfxLookUP](libs/graphics/GfxLookUP.md)|find a graphics extended node associated with agiven pointer (V36)|
|[GfxNew](libs/graphics/GfxNew.md)|allocate a graphics extended data structure (V36)|
|[InitArea](libs/graphics/InitArea.md)|Initialize vector collection matrix|
|[InitBitMap](libs/graphics/InitBitMap.md)|Initialize bit map structure with input values.|
|[InitGels](libs/graphics/InitGels.md)|initialize a gel list; must be called before using gels.|
|[InitGMasks](libs/graphics/InitGMasks.md)|Initialize all of the masks of an [AnimOb](_00C3.md).|
|[InitMasks](libs/graphics/InitMasks.md)|Initialize the BorderLine and CollMask masks of a [VSprite](_00C3.md).|
|[InitRastPort](libs/graphics/InitRastPort.md)|Initialize raster port structure|
|[InitTmpRas](libs/graphics/InitTmpRas.md)|Initialize area of local memory for usage byareafill, floodfill, text.|
|[InitView](libs/graphics/InitView.md)|InitView - Initialize [View](_00B8.md) structure.|
|[InitVPort](libs/graphics/InitVPort.md)|InitVPort - Initialize [ViewPort](_00B8.md) structure.|
|[LoadRGB4](libs/graphics/LoadRGB4.md)|Load RGB color values from table.|
|[LoadView](libs/graphics/LoadView.md)|Use a (possibly freshly created) coprocessor instructionlist to create the current display.|
|[LockLayerRom](libs/graphics/LockLayerRom.md)|Lock [Layer](_00A1.md) structure by rom(gfx lib) code.|
|[MakeVPort](libs/graphics/MakeVPort.md)|generate display copper list for a viewport.|
|[ModeNotAvailable](libs/graphics/ModeNotAvailable.md)|check to see if a DisplayID isn't available. (V36)|
|[Move](libs/graphics/Move.md)|Move graphics pen position.|
|[MoveSprite](libs/graphics/MoveSprite.md)|Move sprite to a point relative to top of viewport.|
|[MrgCop](libs/graphics/MrgCop.md)|Merge together coprocessor instructions.|
|[NewRegion](libs/graphics/NewRegion.md)|Get an empty region.|
|[NextDisplayInfo](libs/graphics/NextDisplayInfo.md)|iterate current displayinfo identifiers (V36)|
|[OpenFont](libs/graphics/OpenFont.md)|Get a pointer to a system font.|
|[OpenMonitor](libs/graphics/OpenMonitor.md)|open a named [MonitorSpec](_00A7.md) (V36)|
|[OrRectRegion](libs/graphics/OrRectRegion.md)|Perform 2d OR operation of rectanglewith region, leaving result in region.|
|[OrRegionRegion](libs/graphics/OrRegionRegion.md)|Perform 2d OR operation of one regionwith second region, leaving result in second region|
|[OwnBlitter](libs/graphics/OwnBlitter.md)|get the blitter for private usage|
|[PolyDraw](libs/graphics/PolyDraw.md)|Draw lines from table of (x,y) values.|
|[QBlit](libs/graphics/QBlit.md)|Queue up a request for blitter usage|
|[QBSBlit](libs/graphics/QBSBlit.md)|Synchronize the blitter request with the video beam.|
|[ReadPixel](libs/graphics/ReadPixel.md)|read the pen number value of the pixel at aspecified x,y location within a certain [RastPort](_00AF.md).|
|[ReadPixelArray8](libs/graphics/ReadPixelArray8.md)|read the pen number value of a rectangular arrayof pixels starting at a specified x,y location and continuingthrough to another x,y location within a certain [RastPort](_00AF.md). (V36)|
|[ReadPixelLine8](libs/graphics/ReadPixelLine8.md)|read the pen number value of a horizontal lineof pixels starting at a specified x,y location and continuingright for count pixels. (V36)|
|[RectFill](libs/graphics/RectFill.md)|Fill a rectangular region in a [RastPort](_00AF.md).|
|[RemBob](libs/graphics/RemBob.md)|Macro to remove a [Bob](_00C3.md) from the gel list.|
|[RemFont](libs/graphics/RemFont.md)|Remove a font from the system list.|
|[RemIBob](libs/graphics/RemIBob.md)|Immediately remove a [Bob](_00C3.md) from the gel list and the [RastPort](_00AF.md).|
|[RemVSprite](libs/graphics/RemVSprite.md)|Remove a [VSprite](_00C3.md) from the current gel list.|
|[ScalerDiv](libs/graphics/ScalerDiv.md)|Get the scaling result that [BitMapScale](BitMapScale.md) would. (V36)|
|[ScrollRaster](libs/graphics/ScrollRaster.md)|Push bits in rectangle in raster around bydx,dy towards 0,0 inside rectangle.|
|[ScrollVPort](libs/graphics/ScrollVPort.md)|Reinterpret RasInfo information in [ViewPort](_00B8.md) to reflectthe current Offset values.|
|[SetAPen](libs/graphics/SetAPen.md)|Set the primary pen for a [RastPort](_00AF.md).|
|[SetBPen](libs/graphics/SetBPen.md)|Set secondary pen for a [RastPort](_00AF.md)|
|[SetCollision](libs/graphics/SetCollision.md)|Set a pointer to a user collision routine.|
|[SetDrMd](libs/graphics/SetDrMd.md)|Set drawing mode for a [RastPort](_00AF.md)|
|[SetFont](libs/graphics/SetFont.md)|Set the text font and attributes in a [RastPort](_00AF.md).|
|[SetOPen](libs/graphics/SetOPen.md)|Change the Area OutLine pen and turn on Outlinemode for areafills.|
|[SetRast](libs/graphics/SetRast.md)|SetRast - Set an entire drawing area to a specified color.|
|[SetRGB4](libs/graphics/SetRGB4.md)|Set one color register for this viewport.|
|[SetRGB4CM](libs/graphics/SetRGB4CM.md)|Set one color register for this [ColorMap](_00B8.md).|
|[SetSoftStyle](libs/graphics/SetSoftStyle.md)|Set the soft style of the current font.|
|[SortGList](libs/graphics/SortGList.md)|Sort the current gel list, ordering its y,x coordinates.|
|[StripFont](libs/graphics/StripFont.md)|remove the tf_Extension from a font (V36)|
|[SyncSBitMap](libs/graphics/SyncSBitMap.md)|Syncronize Super [BitMap](_00A6.md) with whatever isin the standard [Layer](_00A1.md) bounds.|
|[Text](libs/graphics/Text.md)|Write text characters (no formatting).|
|[TextExtent](libs/graphics/TextExtent.md)|Determine raster extent of text data. (V36)|
|[TextFit](libs/graphics/TextFit.md)|TextFit - count characters that will fit in a given extent (V36)|
|[TextLength](libs/graphics/TextLength.md)|Determine raster length of text data.|
|[UnlockLayerRom](libs/graphics/UnlockLayerRom.md)|Unlock [Layer](_00A1.md) structure by rom(gfx lib) code.|
|[VBeamPos](libs/graphics/VBeamPos.md)|Get vertical beam position at this instant.|
|[VideoControl](libs/graphics/VideoControl.md)|Modify the operation of a ViewPort's [ColorMap](_00B8.md) (V36)|
|[WaitBlit](libs/graphics/WaitBlit.md)|Wait for the blitter to be finished before proceedingwith anything else.|
|[WaitBOVP](libs/graphics/WaitBOVP.md)|Wait till vertical beam reached bottom ofthis viewport.|
|[WaitTOF](libs/graphics/WaitTOF.md)|Wait for the top of the next video frame.|
|[WeighTAMatch](libs/graphics/WeighTAMatch.md)|Get a measure of how well two fonts match. (V36)|
|[WritePixel](libs/graphics/WritePixel.md)|Change the pen num of one specific pixel in aspecified [RastPort](_00AF.md).|
|[WritePixelArray8](libs/graphics/WritePixelArray8.md)|write the pen number value of a rectangular arrayof pixels starting at a specified x,y location and continuingthrough to another x,y location within a certain [RastPort](_00AF.md). (V36)|
|[WritePixelLine8](libs/graphics/WritePixelLine8.md)|write the pen number value of a horizontal lineof pixels starting at a specified x,y location and continuingright for count pixels. (V36)|
|[XorRectRegion](libs/graphics/XorRectRegion.md)|Perform 2d XOR operation of rectanglewith region, leaving result in region|
|[XorRegionRegion](libs/graphics/XorRegionRegion.md)|Perform 2d XOR operation of one regionwith second region, leaving result in second region|

### intuition

| Function | Description |
|:---|:---|
|[ActivateGadget](libs/intuition/ActivateGadget.md)|Activate a (string or custom) gadget.|
|[ActivateWindow](libs/intuition/ActivateWindow.md)|Activate an Intuition window.|
|[AddClass](libs/intuition/AddClass.md)|Make a public class available (V36)|
|[AddGadget](libs/intuition/AddGadget.md)|Add a gadget to the gadget list of a window.|
|[AddGList](libs/intuition/AddGList.md)|Add a linked list of gadgets to a window or requester.|
|[AllocRemember](libs/intuition/AllocRemember.md)|[AllocMem](../exec/AllocMem.md) with tracking to make freeing easy.|
|[AutoRequest](libs/intuition/AutoRequest.md)|Automatically build and get response from a requester.|
|[BeginRefresh](libs/intuition/BeginRefresh.md)|Sets up a window for optimized refreshing.|
|[BuildEasyRequestArgs](libs/intuition/BuildEasyRequestArgs.md)|Simple creation of system request. (V36)BuildEasyRequest -- Varargs stub for BuildEasyRequestArgs(). (V36)|
|[BuildSysRequest](libs/intuition/BuildSysRequest.md)|Build and display a system requester.|
|[ChangeWindowBox](libs/intuition/ChangeWindowBox.md)|Change window position and dimensions. (V36)|
|[ClearDMRequest](libs/intuition/ClearDMRequest.md)|Clear (detaches) the DMRequest of the window.|
|[ClearMenuStrip](libs/intuition/ClearMenuStrip.md)|Clear (detach) the menu strip from the window.|
|[ClearPointer](libs/intuition/ClearPointer.md)|Clear the mouse pointer definition from a window.|
|[CloseScreen](libs/intuition/CloseScreen.md)|Close an Intuition screen.|
|[CloseWindow](libs/intuition/CloseWindow.md)|Close an Intuition window.|
|[CloseWorkBench](libs/intuition/CloseWorkBench.md)|Closes the Workbench screen.|
|[CurrentTime](libs/intuition/CurrentTime.md)|Get the current time values.|
|[DisplayAlert](libs/intuition/DisplayAlert.md)|Create the display of an alert message.|
|[DisplayBeep](libs/intuition/DisplayBeep.md)|Flash the video display.|
|[DisposeObject](libs/intuition/DisposeObject.md)|Deletes a 'boopsi' object. (V36)|
|[DoubleClick](libs/intuition/DoubleClick.md)|Test two time values for double-click timing.|
|[DrawBorder](libs/intuition/DrawBorder.md)|Draw the specified [Border](_00D4.md) structure into a [RastPort](_00AF.md).|
|[DrawImage](libs/intuition/DrawImage.md)|Draw the specified [Image](_00D4.md) structure into a [RastPort](_00AF.md).|
|[DrawImageState](libs/intuition/DrawImageState.md)|Draw an (extended) Intuition [Image](_00D4.md) withspecial visual state. (V36)|
|[EasyRequestArgs](libs/intuition/EasyRequestArgs.md)|Easy alternative to [AutoRequest](AutoRequest.md). (V36)EasyRequest -- Varargs stub for EasyRequestArgs(). (V36)|
|[EndRefresh](libs/intuition/EndRefresh.md)|End the optimized refresh state of the window.|
|[EndRequest](libs/intuition/EndRequest.md)|Remove a currently active requester.|
|[EraseImage](libs/intuition/EraseImage.md)|Erases an [Image](_00D4.md). (V36)|
|[FreeClass](libs/intuition/FreeClass.md)|Frees a boopsi class created by [MakeClass](MakeClass.md). (V36)|
|[FreeRemember](libs/intuition/FreeRemember.md)|Free memory allocated by calls to [AllocRemember](AllocRemember.md).|
|[FreeScreenDrawInfo](libs/intuition/FreeScreenDrawInfo.md)|Finish using a [DrawInfo](_00DD.md) structure. (V36)|
|[FreeSysRequest](libs/intuition/FreeSysRequest.md)|Free resources gotten by a call to [BuildSysRequest](BuildSysRequest.md).|
|[GadgetMouse](libs/intuition/GadgetMouse.md)|Calculate gadget-relative mouse position. (V36)|
|[GetAttr](libs/intuition/GetAttr.md)|Inquire the value of some attribute of an object. (V36)|
|[GetDefaultPubScreen](libs/intuition/GetDefaultPubScreen.md)|Get name of default public screen. (V36)|
|[GetDefPrefs](libs/intuition/GetDefPrefs.md)|Get a copy of the the Intuition default [Preferences](_00D5.md).|
|[GetPrefs](libs/intuition/GetPrefs.md)|Get the current Intuition [Preferences](_00D5.md) structure.|
|[GetScreenData](libs/intuition/GetScreenData.md)|Get copy of a screen data structure.|
|[GetScreenDrawInfo](libs/intuition/GetScreenDrawInfo.md)|Get pointer to rendering information. (V36)|
|[InitRequester](libs/intuition/InitRequester.md)|Initialize a [Requester](_00D4.md) structure.|
|[IntuiTextLength](libs/intuition/IntuiTextLength.md)|Return the length (pixel-width) of an [IntuiText](_00D4.md).|
|[ItemAddress](libs/intuition/ItemAddress.md)|Returns the address of the specified [MenuItem](_00D4.md).|
|[LockIBase](libs/intuition/LockIBase.md)|Invoke semaphore arbitration of [IntuitionBase](_00DC.md).|
|[LockPubScreen](libs/intuition/LockPubScreen.md)|Prevent a public screen from closing. (V36)|
|[LockPubScreenList](libs/intuition/LockPubScreenList.md)|Prevent changes to the system list. (V36)|
|[MakeClass](libs/intuition/MakeClass.md)|Create and initialize a boopsi class. (V36)|
|[MakeScreen](libs/intuition/MakeScreen.md)|Do an Intuition-integrated [MakeVPort](../graphics/MakeVPort.md) of a screen.|
|[ModifyIDCMP](libs/intuition/ModifyIDCMP.md)|Modify the state of a window's IDCMPFlags.|
|[ModifyProp](libs/intuition/ModifyProp.md)|Modify the current parameters of a proportional gadget.|
|[MoveScreen](libs/intuition/MoveScreen.md)|Attempt to move the screen by the increments provided.|
|[MoveWindow](libs/intuition/MoveWindow.md)|Ask Intuition to move a window.|
|[MoveWindowInFrontOf](libs/intuition/MoveWindowInFrontOf.md)|Arrange the relative depth of a window. (V36)|
|[NewModifyProp](libs/intuition/NewModifyProp.md)|[ModifyProp](ModifyProp.md), but with selective refresh.|
|[NewObject](libs/intuition/NewObject.md)|Create an object from a class. (V36)NewObject -- Varargs stub for NewObjectA(). (V36)|
|[NextObject](libs/intuition/NextObject.md)|iterate through the object on an Exec list. (V36)|
|[NextPubScreen](libs/intuition/NextPubScreen.md)|Identify next public screen in the cycle. (V36)|
|[ObtainGIRPort](libs/intuition/ObtainGIRPort.md)|Set up a [RastPort](_00AF.md) for a custom gadget. (V36)|
|[OffGadget](libs/intuition/OffGadget.md)|Disable the specified gadget.|
|[OffMenu](libs/intuition/OffMenu.md)|Disable the given menu or menu item.|
|[OnGadget](libs/intuition/OnGadget.md)|Enable the specified gadget.|
|[OnMenu](libs/intuition/OnMenu.md)|Enable the given menu or menu item.|
|[OpenScreen](libs/intuition/OpenScreen.md)|Open an Intuition screen.|
|[OpenScreenTagList](libs/intuition/OpenScreenTagList.md)|[OpenScreen](OpenScreen.md) with [TagItem](_012E.md) extension array. (V36)OpenScreenTags -- Varargs stub for OpenScreenTagList. (V36)|
|[OpenWindow](libs/intuition/OpenWindow.md)|Open an Intuition window.|
|[OpenWindowTagList](libs/intuition/OpenWindowTagList.md)|[OpenWindow](OpenWindow.md) with [TagItem](_012E.md) extension. (V36)OpenWindowTags -- Varargs stub for OpenWindowTagList (V36)|
|[OpenWorkBench](libs/intuition/OpenWorkBench.md)|Open the Workbench screen.|
|[PointInImage](libs/intuition/PointInImage.md)|Tests whether an image &#034;contains&#034; a point. (V36)|
|[PrintIText](libs/intuition/PrintIText.md)|Print text described by the [IntuiText](_00D4.md) argument.|
|[PubScreenStatus](libs/intuition/PubScreenStatus.md)|Change status flags for a public screen. (V36)|
|[QueryOverscan](libs/intuition/QueryOverscan.md)|Inquire about a standard overscan region. (V36)|
|[RefreshGadgets](libs/intuition/RefreshGadgets.md)|Refresh (redraw) the gadget display.|
|[RefreshGList](libs/intuition/RefreshGList.md)|Refresh (redraw) a chosen number of gadgets.|
|[RefreshWindowFrame](libs/intuition/RefreshWindowFrame.md)|Ask Intuition to redraw your window border.|
|[ReleaseGIRPort](libs/intuition/ReleaseGIRPort.md)|Release a custom gadget [RastPort](_00AF.md). (V36)|
|[RemakeDisplay](libs/intuition/RemakeDisplay.md)|Remake the entire Intuition display.|
|[RemoveClass](libs/intuition/RemoveClass.md)|Make a public boopsi class unavailable. (V36)|
|[RemoveGadget](libs/intuition/RemoveGadget.md)|Remove a gadget from a window.|
|[RemoveGList](libs/intuition/RemoveGList.md)|Remove a sublist of gadgets from a window.|
|[ReportMouse](libs/intuition/ReportMouse.md)|Tell Intuition whether to report mouse movement.|
|[Request](libs/intuition/Request.md)|Activate a requester.|
|[ResetMenuStrip](libs/intuition/ResetMenuStrip.md)|Re-attach a menu strip to a window. (V36)|
|[RethinkDisplay](libs/intuition/RethinkDisplay.md)|Grand manipulation of the entire Intuition display.|
|[ScreenToBack](libs/intuition/ScreenToBack.md)|Send the specified screen to the back of the display.|
|[ScreenToFront](libs/intuition/ScreenToFront.md)|Make the specified screen the frontmost.|
|[SetAttrsA](libs/intuition/SetAttrsA.md)|Specify attribute values for an object. (V36)SetAttrs -- Varargs stub for SetAttrsA(). (V36)|
|[SetDefaultPubScreen](libs/intuition/SetDefaultPubScreen.md)|Choose a new default public screen. (V36)|
|[SetDMRequest](libs/intuition/SetDMRequest.md)|Set the DMRequest of a window.|
|[SetEditHook](libs/intuition/SetEditHook.md)|Set global processing for string gadgets. (V36)|
|[SetGadgetAttrsA](libs/intuition/SetGadgetAttrsA.md)|Specify attribute values for a boopsi gadget. (V36)SetGadgetAttrs -- Varargs stub for SetGadgetAttrsA(). (V36)|
|[SetMenuStrip](libs/intuition/SetMenuStrip.md)|Attach a menu strip to a window.|
|[SetMouseQueue](libs/intuition/SetMouseQueue.md)|Change limit on pending mouse messages. (V36)|
|[SetPointer](libs/intuition/SetPointer.md)|Specify a pointer sprite image for a window.|
|[SetPrefs](libs/intuition/SetPrefs.md)|Set Intuition preferences data.|
|[SetPubScreenModes](libs/intuition/SetPubScreenModes.md)|Establish global public screen behavior. (V36)|
|[SetWindowTitles](libs/intuition/SetWindowTitles.md)|Set the window's titles for both window and screen.|
|[ShowTitle](libs/intuition/ShowTitle.md)|Set the screen title bar display mode.|
|[SizeWindow](libs/intuition/SizeWindow.md)|Ask Intuition to size a window.|
|[SysReqHandler](libs/intuition/SysReqHandler.md)|Handle system requester input. (V36)|
|[UnlockIBase](libs/intuition/UnlockIBase.md)|Surrender an Intuition lock gotten by [LockIBase](LockIBase.md).|
|[UnlockPubScreen](libs/intuition/UnlockPubScreen.md)|Release lock on a public screen. (V36)|
|[UnlockPubScreenList](libs/intuition/UnlockPubScreenList.md)|Release public screen list semaphore. (V36)|
|[ViewAddress](libs/intuition/ViewAddress.md)|Return the address of the Intuition [View](_00B8.md) structure.|
|[ViewPortAddress](libs/intuition/ViewPortAddress.md)|Return the address of a window's viewport.|
|[WBenchToBack](libs/intuition/WBenchToBack.md)|Send the Workbench screen in back of all screens.|
|[WBenchToFront](libs/intuition/WBenchToFront.md)|Bring the Workbench screen in front of all screens.|
|[WindowLimits](libs/intuition/WindowLimits.md)|Set the minimum and maximum limits of a window.|
|[WindowToBack](libs/intuition/WindowToBack.md)|Ask Intuition to send a window behind others.|
|[WindowToFront](libs/intuition/WindowToFront.md)|Ask Intuition to bring a window to the front.|
|[ZipWindow](libs/intuition/ZipWindow.md)|Change window to &#034;alternate&#034; position anddimensions. (V36)|

Source: [Amiga Developer Docs from elowar](http://amigadev.elowar.com/)

## Licenses

The amiga libraries ara part of development tools of Commodore Amiga Incorporated licensed by [Cloanto Coporation](https://cloanto.com)
These files are made available here free of charge for learning purposes and without the intention of doing any harm.
Please contact the extension developer to discuss any issues.

The source of the instructions documentation is from [MOTOROLA M68000 FAMILY Programmer's reference manual](https://www.nxp.com/files-static/archives/doc/ref_manual/M68000PRM.pdf) and [Instruction set digest](http://www.tigernt.com/onlineDoc/68000.pdf). Copyright 1992 by Motorola Inc./[NXP](https://www.nxp.com). Adapted with permission.
