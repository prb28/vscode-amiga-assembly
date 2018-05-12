#  Motorola 68000 Instruction Set
|Instruction|Description|Assembler Syntax|Data Size|X N Z V C|
| ----------|---------- | -------------- | ------- | ------- |
|ADD|ADD binary|Dx,Dy|BWL|\* \* \* \* \*|
|||Dn,\<ea\>|||
|||\<ea\>,Dn|||
|ADDA|ADD binary to An|Rn,An|-WL|- - - - -|
|||\<ea\>,An|||
|ADDI|ADD Immediate|#x,Dn|BWL|\* \* \* \* \*|
|||#x,\<ea\>|||
|||#x,An|-W|- - - - -|
|ADDQ|ADD 3-bit immediate|#<1-8>,Dn|BWL|\* \* \* \* \*|
|||#<1-8>,\<ea\>|||
|||#<1-8>,An|-WL|- - - - -|
|ADDX|ADD eXtended|Dy,Dx|BWL|\* \* \* \* \*|
|||-(Ay),-(Ax)|||
|AND|Bit-wise AND|Dx,Dy|BWL|- \* \* 0 0|
|||\<ea\>,Dn|||
|||Dn,\<ea\>|||
|ANDI|Bit-wise AND with Immediate|#<data>,Dn|BWL|- \* \* 0 0|
|||#<data>,\<ea\>|||
|ASL|Arithmetic Shift Left|#<1-8>,Dy|BWL|\* \* \* \* \*|
|||Dx,Dy|||
|||\<ea\>|||
|ASR|Arithmetic Shift Right|...|BWL|\* \* \* \* \*|
|Bcc|Conditional Branch|Bcc.B <label>|BW-|- - - - -|
|||Bcc.W <label>|||
|BCHG|Test a Bit and CHanGe|Dn,\<ea\>|B-L|- - \* - -|
|||#<data>,\<ea\>|||
|BCLR|Test a Bit and CLeaR|...|B-L|- - \* - -|
|BSET|Test a Bit and SET|...|B-L|- - \* - -|
|BSR|Branch to SubRoutine|BSR.S <label>|BW-|- - - - -|
|||BSR.W <label>|||
|BTST|Bit TeST|Dn,\<ea\>|B-L|- - \* - -|
|||#<data>,\<ea\>|||
|CHK|CHecK Dn Against Bounds|\<ea\>,Dn|-W-|- \* U U U|
|CLR|CLeaR|\<ea\>|BWL|- 0 1 0 0|
|||Dn|||
|CMP|CoMPare|Dx,Dy|BWL|- \* \* \* \*|
|||\<ea\>,Dn|||
|CMPA|CoMPare Address|Rn,An|-WL|- \* \* \* \*|
|||\<ea\>,An|||
|||#<data>,An|||
|CMPI|CoMPare Immediate|#<data>,Dn|BWL|- \* \* \* \*|
|||#<data>,\<ea\>|||
|CMPM|CoMPare Memory|(Ay)+,(Ax)+|BWL|- \* \* \* \*|
|DBcc|Looping Instruction|DBcc Dn,<label>|-W-|- - - - -|
|DIVS|DIVide Signed|Dx,Dy|-W-|- \* \* \* 0|
|||\<ea\>,Dn|||
|||#<data>,Dn|||
|DIVU|DIVide Unsigned|Dx,Dy|-W-|- \* \* \* 0|
|||\<ea\>,Dn|||
|||#<data>,Dn|||
|EOR|Exclusive OR|Dx,Dy|BWL|- \* \* 0 0|
|||Dn,\<ea\>|||
|EORI|Exclusive OR Immediate|#<data>,Dn|BWL|- \* \* 0 0|
|||#<data>,\<ea\>|||
|EXG|Exchange any two registers|Rx,Ry|--L|- - - - -|
|EXT|Sign EXTend|Dn|-WL|- \* \* 0 0|
|JMP|JuMP to Affective Address|\<ea\>|- - - - -|
|JSR|Jump to SubRoutine|\<ea\>|- - - - -|
|LEA|Load Effective Address|\<ea\>,An|--L|- - - - -|
|LSL|Logical Shift Left|Dx,Dy|BWL|\* \* \* 0 \*|
|||#<1-8>,Dy|||
|||\<ea\>|||
|LSR|Logical Shift Right|...|BWL|\* \* \* 0 \*|
|MOVE|Copy value|Dx,Dy|BWL|- \* \* 0 0|
|||Rn,Dy|-WL|- \* \* 0 0|
|||Dn,\<ea\>|BWL|- \* \* 0 0|
|||\<ea\>,Dn|BWL|- \* \* 0 0|
|||\<ea\>,\<ea\>|BWL|- \* \* 0 0|
|||#<data>,Dn|BWL|- \* \* 0 0|
|||#<data>,\<ea\> BWL|- \* \* 0 0|
|MOVEA|MOVE Address|Dn,An|-WL|- - - - -|
|||\<ea\>,An|||
|||An,\<ea\>|||
|||#<data>,An|||
|MOVE|To CCR|\<ea\>,CCR|-W-|I I I I I|
|MOVE|To SR|\<ea\>,SR|-W-|I I I I I|
|MOVE|From SR|SR,\<ea\>|-W-|- - - - -|
|MOVE|USP to/from Address Register|USP,An|--L|- - - - -|
|||An,USP|||
|MOVEM|MOVE Multiple|<register list>,\<ea\> -WL|- - - - -|
|||\<ea\>,<register list>|||
|MOVEQ|MOVE 8-bit immediate|#<-128.+127>,Dn|--L|- \* \* 0 0|
|MULS|MULtiply Signed|Dx,Dy|-W-|- \* \* 0 0|
|||\<ea\>,Dn|||
|||#<data>,Dn|||
|MULU|MULtiply Unsigned|Dx,Dy|-W-|- \* \* 0 0|
|||\<ea\>,Dn|||
|||#<data>,Dn|||
|NEG|NEGate|Dn|BWL|\* \* \* \* \*|
|||\<ea\>|||
|NEGX|NEGate with eXtend|Dn|BWL|\* \* \* \* \*|
|||\<ea\>|||
|NOP|No OPeration|NOP||- - - - -|
|NOT|Form one's complement|Dn|BWL|- \* \* 0 0|
|||\<ea\>|||
|OR|Bit-wise OR|\<ea\>,Dn|BWL|- \* \* 0 0|
|||Dn,\<ea\>|||
|||Dx,Dy|||
|ORI|Bit-wise OR with Immediate|#<data>,\<ea\>|BWL|- \* \* 0 0|
|||#<data>,Dn|||
|ROL|ROtate Left|#<1-8>,Dy|BWL|- \* \* 0 \*|
|||Dx,Dy|||
|||\<ea\>|||
|ROR|ROtate Right|...|BWL|- \* \* 0 \*|
|ROXL|ROtate Left with eXtend|...|BWL|\* \* \* 0 \*|
|ROXR|ROtate Right with eXtend|...|BWL|\* \* \* 0 \*|
|RTE|ReTurn from Exception|RTE|I I I I I|
|RTR|ReTurn and Restore|RTR|I I I I I|
|RTS|ReTurn from Subroutine|RTS|- - - - -|
|SUBtract SAME as ADDITION||
|SWAP|SWAP words of Dn|Dn|-W-|- \* \* 0 0|
|TRAP|Execute TRAP Exception|#<vector>|- - - - -|
|TRAPV|TRAPV Exception if V-bit Set|TRAPV|- - - - -|
|TST|TeST for negative or zero|\<ea\>|BWL|- \* \* 0 0|
|||Dn|||

move.l #228,d7	To STOP Execution
trap   #14

# Symbols
|Symbol|Meaning|
| ----:|:----- |
|\*    |Set according to result of operation|
|\-    |Not affected|
|0     |Cleared|
|1     |Set|
|U     |Outcome (state after operation) undefined|
|I     |Set by immediate data|


# Keyword legents
|Keyword|Legend|details|
| -----:|:----:|:----- |
|   Dn  |  Data Register     |   (n is 0-7)|
|   An  |  Address Register  |   (n is 0-7)|
|    b  |  08-bit constant|
|    w  |  16-bit constant|
|    l  |  32-bit constant|
|    x  |  8-, 16-, 32-bit constant|
|   Rn  |  Any Register, An or Dn|

# Condition Codes for Bcc and DBcc Instructions
## Condition Codes set after CMP D0,D1 Instruction.

|Relationship   |   Unsigned                      |   Signed
|:-------------:|:------------------------------- |:----------------------------- |
|D1 <  D0       |   CS - Carry Bit Set            |   LT - Less Than|
|D1 <= D0       |   LS - Lower or Same            |   LE - Less than or Equal|
|D1  = D0       |   EQ - Equal (Z-bit Set)        |   EQ - Equal (Z-bit Set)|
|D1 != D0       |  NE - Not Equal (Z-bit Clear)   |  NE - Not Equal (Z-bit Clear)|
|D1 >  D0       |   HI - HIgher than              |   GT - Greater Than|
|D1 >= D0       |   CC - Carry Bit Clear          |   GE - Greater than or Equal|
|               |                                 ||
|               |   PL - PLus (N-bit Clear)       |   MI - Minus (N-bit Set)|
|               |   VC - V-bit Clear (No Overflow)|   VS - V-bit Set (Overflow)|
|               |   RA - BRanch Always||
|               |||
|DBcc Only      |   F - Never Terminate (DBRA is an alternate to DBF)||
|               |   T - Always Terminate||

**Source : http://users.encs.concordia.ca/~aagarwal/coen311/motorola68000.txt**
