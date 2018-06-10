              ;ORG        $20000
              ;LOAD       $20000
              ;JUMPPTR    init 

;---------- Constantes ----------

;Registres

INTENA=$09A
INTENAR=$01C
INTREQ=$09C
INTREQR=$01E
DMACON=$096
DMACONR=$002
COLOR00=$dff180
C_COLOR00=$180
COP1LCH=$dff080
COP1LCL=$dff082
COPJMP1=$dff088
VPOSR=$dff004

;Programme

COPPERLIST_SIZE=1000		;Arbitraire, on se dit que tout tiendra
LINE=100			;<= 255

init:




              move.l     4.w,a6                  ; execbase - le .w permet de ne garde qu'un octe pour l'adresse - diminution de taille de la commande
              clr.l      d0                      ; les registres sont des long - il faut les nettoyer avec un .l

	;Allouer de la mémoire en CHIP mise à 0 pour la Copper list

              move.l     #COPPERLIST_SIZE,d0
              move.l     #$10002,d1
              movea.l    $4,a6
              jsr        -198(a6)
              move.l     d0,copperlist


              move.l     #gfxname,a1             ; nom de la librairie
              jsr        -408(a6)                ; oldopenlibrary()
              move.l     d0,a1                   ; récupération de l'adresse de chargement de la lib
              move.l     38(a1),d4               ; pointeur du copper originel
              jsr        -414(a6)                ; closelibrary()
 
              move.b     #$80,d7                 ; position y
              move       #-1,d6                  ; incrément
              move       $dff01c,d5              ; Copie de la valeur des interruptions dans d5 
              move       #$7fff,$dff09a          ; désactivation de toutes les interruptions bits : valeur + masque sur 7b

;	move.l #copper, $dff080 ; Mise en place de la copperlist
     
;---------- Copper list ----------
              movea.l    copperlist,a0
;Attendre le début visible ($3E) de la ligne (<= 255)
              move.w     #$1fc,(a0)+   
              move.w     #0,(a0)+                ;slow fetch mode for AGA compatibility : ? garder en début de copperlist
              move.w     #$100,(a0)+
              move.w     #$0200,(a0)+            ; attente du début de l'écran

              move.w     #C_COLOR00,(a0)+
              move.w     #$349,(a0)+

              move.w     #$2b07,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     #$56c,(a0)+
              move.w     #$2c07,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne

              move.w     #C_COLOR00,(a0)+
              move.w     #$113,(a0)+

;Copier la copper bar
              move       #9,d0                   ; ça fait une boulc de 10
              move       #$050,d1
              move       #$8007,d3
              move.l     a0,waitras1
loopbar:
              move.w     d3,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     d1,(a0)+                ; couleur de ligne
              add        #$0100,d3
              add        #$010,d1
              dbra       d0,loopbar              ; boucle - jusqu'à -1

              move       #9,d0                   ; ça fait une boulc de 10
loopbar2:
              move.w     d3,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     d1,(a0)+                ; couleur de ligne
              add        #$0100,d3
              sub        #$010,d1
              dbra       d0,loopbar2             ; boucle - jusqu'à -1

              move.l     a0,waitras2
              move.w     d3,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     #$113,(a0)+             ; couleur de fond

; Fin de copper bar
              move.w     #$ffdf,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #$2c07,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     #$56c,(a0)+             ; couleur de fond
              move.w     #$2d07,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne
              move.w     #C_COLOR00,(a0)+
              move.w     #$349,(a0)+             ; couleur de fond

              move.w     #$ffdf,(a0)+
              move.w     #$fffe,(a0)+            ; attente de ligne

;Fin

              move.l     #$FFFFFFFE,(a0)

;Activer la Copper list

              move.l     copperlist,$dff080
              clr.w      COPJMP1

resetcount:
              moveq      #$50,d2                 ; durée d'un cycle
              neg        d6

******************************************************************	
mainloop:
	
		;Attendre un blanc vertical
              move.w     #$0c,d0                 ;No buffering, so wait until raster
              bsr.w      WaitRaster              ;is below the Display Window.

;----------- main loop ------------------
              add        d6,d7                   ; Ajout de l'incrément
              dbf        d2,continue             ; teste si on est a zero, sinon décrémente et pat dans watiras1
              jmp        resetcount              ; le compteur d2 est arrivé ? -1

continue: ; 200A8 - 20116
              move       #19,d0                  ; ça fait une boulc de 10
              move       d7,d3
              move.l     waitras1,a3
	;move d2, d5		; décalage de couleur
	;mulu.w #2, d4
moveloop: ; 200A8 - 20116
              move.b     d3,(a3)
              add        #1,d3
              add        #6,a3
	;add #$111,(a3)
              add        #2,a3
              dbra       d0,moveloop

              move.l     waitras2,a3
              move.b     d3,(a3)
	; modifcation de la couleur
	;move d2, d0
	;mulu.w #2, d0
	;move.l colorcpline,a0
	;move.w d0,(a0)
;----------- end main loop ------------------

checkmouse:
              btst       #6,$bfe001
              bne.b      mainloop

exit:
              move.l     d4,$dff080              ; réadressage de la copperlist
              or         #$c000,d5               ; Inversion du masque d'activation sur la partie de valeur ? associer
              move       d5,$dff09a              ; réactivation des interruptions
              rts
	
WaitRaster:				;Wait for scanline d0. Trashes d1.
.l:           move.l     $dff004,d1
              lsr.l      #1,d1
              lsr.w      #7,d1
              cmp.w      d0,d1
              bne.s      .l                      ;wait until it matches (eq)
              rts
******************************************************************	
gfxname:
              dc.b       "graphics.library",0


              EVEN

waitras1:     DC.L       0
colorcpline:  DC.L       0
waitras2:     DC.L       0
copperlist:   DC.L       0
;copperlist:		DS.b 200


