;---------------------------------------------
; 68K for Amiga OS
;----------------------------------------------
         include    "exec/types.i"                         ; this is a good include
         include    "exec/funcdef.i"                       
         include    "exec/exec.i"                          
         include    "libraries/dos_lib.i"                  
         include    "libraries/dos.i"                      

         section    code,code                              
start
         lea        dosname,a1                             
         moveq      #0,d0                                  ; comment my comment
         move.l     4,a6                                   
         jsr        _LVOOpenLibrary(a6)                    
         move.l     d0,a6                                  
         tst.l      d0                                     
         beq        error                                  
         jsr        _LVOOutput(a6)                         
         move.l     d0,d1                                  
         move.l     #Message,d2                            
         moveq      #MessageEnd-Message,d3                 ; comment 1
         jsr        _LVOWrite(a6)                          
         move.l     a6,a1                                  
         move.l     4,a6                                   
         jsr        _LVOCloseLibrary(a6)                   
         moveq      #0,d0                                  
         rts                                               
error    moveq      #-1,d0                                 
         rts                                               

         section    data,data                              
dosname  dc.b       'dos.library',0                        
Message  dc.b       'Hello world!',10,0                    
MessageEnd

         SECTION    MyDemoData,DATA_C                      
Spr:
         dc.b       $95,$40,$a5,$00                        ;Vstart.b,Hstart/2.b,Vstop.b,%A0000SEH
         dc.w       %0000011111000000,%0000000000000000    
         dc.w       %0001111111110000,%0000000000000000    
         dc.w       %0011111111111000,%0000000000000000    
         dc.w       %0111111111111100,%0000000000000000    
         dc.w       %0110011111001100,%0001100000110000    
         dc.w       %1110011111001110,%0001100000110000    
         dc.w       %1111111111111110,%0000000000000000    
         dc.w       %1111111111111110,%0000000000000000    
         dc.w       %1111111111111110,%0010000000001000    
         dc.w       %1111111111111110,%0001100000110000    
         dc.w       %0111111111111100,%0000011111000000    
         dc.w       %0111111111111100,%0000000000000000    
         dc.w       %0011111111111000,%0000000000000000    
         dc.w       %0001111111110000,%0000000000000000    
         dc.w       %0000011111000000,%0000000000000000    
         dc.w       %0000000000000000,%0000000000000000    
         dc.w       0,0                                    
