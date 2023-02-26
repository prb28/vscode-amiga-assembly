;------------------------------
; Example inspired by Photon's Tutorial:
;  https://www.youtube.com/user/ScoopexUs
;
;---------- Includes ----------
              INCDIR      "include"
              INCLUDE     "hw.i"
              INCLUDE     "funcdef.i"
              INCLUDE     "exec/exec_lib.i"
              INCLUDE     "graphics/graphics_lib.i"
              INCLUDE     "hardware/cia.i"
;---------- Const ----------

CIAA            = $00bfe001
COPPERLIST_SIZE = 1000                                   ;Size of the copperlist
LINE            = 100                                    ;<= 255

init:
              movem.l     d0-a6,-(sp)
              move.l      4.w,a6                         ; execbase
              clr.l       d0                      

	; Allocation of chip memory

              move.l      #COPPERLIST_SIZE,d0
              move.l      #$10002,d1
              movea.l     $4,a6                          ; This call could be replaced by
              jsr         _LVOAllocMem(a6)               ; CALLEXEC AllocMem
              move.l      d0,copperlist


              move.l      #gfxname,a1                    ; librairy name
              jsr         _LVOOldOpenLibrary(a6) 
              move.l      d0,a1                   
              move.l      38(a1),d4                      ; copper list pointer to save
              move.l      d4,CopperSave
              jsr         _LVOCloseLibrary(a6)
 
              move.b      #$80,d7                        ; y position
              move        #-1,d6                         ; step

              lea         CUSTOM,a6                      ; adresse de base
              move.w      INTENAR(a6),INTENARSave        ; Copie de la valeur des interruptions 
              move.w      DMACONR(a6),DMACONSave         ; sauvegarde du dmacon 
              move.w      #$138,d0                       ; wait for eoframe paramètre pour la routine de WaitRaster - position à attendre
              bsr.w       WaitRaster                     ; Appel de la routine wait raster - bsr = jmp,mais pour des adresses moins distantes
              move.w      #$7fff,INTENA(a6)              ; désactivation de toutes les interruptions bits : valeur + masque sur 7b
              move.w      #$7fff,INTREQ(a6)              ; disable all bits in INTREQ
              move.w      #$7fff,INTREQ(a6)              ; disable all bits in INTREQ
              move.w      #$7fff,DMACON(a6)              ; disable all bits in DMACON
              move.w      #$87e0,DMACON(a6)              ; Activation classique pour démo

;---------- Copper list ----------
              movea.l     copperlist,a0
              move.w      #$1fc,(a0)+   
              move.w      #0,(a0)+                       ;slow fetch mode for AGA compatibility
              move.w      #$100,(a0)+
              move.w      #$0200,(a0)+                   ; wait for screen start

              move.w      #COLOR00,(a0)+
              move.w      #$349,(a0)+

              move.w      #$2b07,(a0)+
              move.w      #COPPER_HALT,(a0)+           
              move.w      #COLOR00,(a0)+
              move.w      #$56c,(a0)+
              move.w      #$2c07,(a0)+
              move.w      #COPPER_HALT,(a0)+           

              move.w      #COLOR00,(a0)+
              move.w      #$113,(a0)+

;Copy copper bar
              move        #9,d0 
              move        #$050,d1
              move        #$8007,d3
              move.l      a0,waitras1
loopbar:
              move.w      d3,(a0)+
              move.w      #COPPER_HALT,(a0)+       
              move.w      #COLOR00,(a0)+
              move.w      d1,(a0)+        
              add         #$0100,d3
              add         #$010,d1
              dbra        d0,loopbar                     ; loop until -1

              move        #9,d0                          ; loop of 10
loopbar2:
              move.w      d3,(a0)+
              move.w      #COPPER_HALT,(a0)+   
              move.w      #COLOR00,(a0)+
              move.w      d1,(a0)+  
              add         #$0100,d3
              sub         #$010,d1
              dbra        d0,loopbar2 

              move.l      a0,waitras2
              move.w      d3,(a0)+
              move.w      #COPPER_HALT,(a0)+ 
              move.w      #COLOR00,(a0)+
              move.w      #$113,(a0)+  

; End of copper bar
              move.w      #$ffdf,(a0)+
              move.w      #COPPER_HALT,(a0)+ 
              move.w      #$2c07,(a0)+
              move.w      #COPPER_HALT,(a0)+ 
              move.w      #COLOR00,(a0)+
              move.w      #$56c,(a0)+                    ; background color
              move.w      #$2d07,(a0)+
              move.w      #COPPER_HALT,(a0)+ 
              move.w      #COLOR00,(a0)+
              move.w      #$349,(a0)+
;End
              move.l      #COPPER_HALT,(a0)

; Activate Copper list
              move.l      copperlist,COP1LC(a6)
              move.w      d0,COPJMP1(a6)

resetcount:
              moveq       #$50,d2                        ; cycle duration
              neg         d6

******************************************************************	
mainloop:
		; Wait for vertical blank
              move.w      #$0c,d0                        ;No buffering, so wait until raster
              bsr.w       WaitRaster                     ;is below the Display Window.

;----------- main loop ------------------
              add         d6,d7                          ; Increment
              dbf         d2,continue   
              jmp         resetcount 

continue: ; 200A8 - 20116
              move        #19,d0 
              move        d7,d3
              move.l      waitras1,a3
moveloop: ; 200A8 - 20116
              move.b      d3,(a3)
              add         #1,d3
              add         #6,a3
              add         #2,a3
              dbra        d0,moveloop

              move.l      waitras2,a3
              move.b      d3,(a3)
;----------- end main loop ------------------

checkmouse:
              btst        #CIAB_GAMEPORT0,CIAA+ciapra
              bne.b       mainloop

exit:
              move.w      #$7fff,DMACON(a6)              ; disable all bits in DMACON
              or.w        #$8200,(DMACONSave)            ; Bit mask inversion for activation
              move.w      (DMACONSave),DMACON(a6)        ; Restore values
              move.l      (CopperSave),COP1LC(a6)        ; Restore values
              or          #$c000,(INTENARSave)         
              move        (INTENARSave),INTENA(a6)       ; interruptions reactivation
              movem.l     (sp)+,d0-a6
              clr         d0                             ; Return code of the program
              rts                                        ; End
	
WaitRaster:				              ;Wait for scanline d0. Trashes d1.
.l:           move.l      $dff004,d1
              lsr.l       #1,d1
              lsr.w       #7,d1
              cmp.w       d0,d1
              bne.s       .l                             ;wait until it matches (eq)
              rts
******************************************************************	
gfxname:
              GRAFNAME                                   ; inserts the graphics library name

              EVEN

DMACONSave:   DC.w        1
CopperSave:   DC.l        1
INTENARSave:  DC.w        1
waitras1:     DC.L        0
waitras2:     DC.L        0
copperlist:   DC.L        0

