/* struct IntuitionBase */
#ifndef INTUITION_INTUITIONBASE_H 
#include <intuition/intuitionbase.h>
#endif

/* struct Screen, struct NewScreen */
#ifndef INTUITION_SCREENS_H 
#include <intuition/screens.h>
#endif

/* struct Border, struct Image, struct Gadget, struct IntuiText, 
   struct Menu, struct MenuItem, struct Remember, struct Requester,
   struct Window, struct NewWindow */
#ifndef INTUITION_INTUITION_H 
#include <intuition/intuition.h>
#endif

/* struct InputEvent */
#ifndef DEVICES_INPUTEVENT_H 
#include <devices/inputevent.h>
#endif

/* struct Preferences */
#ifndef INTUITION_PREFERENCES_H 
#include <intuition/preferences.h>
#endif

/* struct RastPort */
#ifndef GRAPHICS_RASTPORT_H 
#include <graphics/rastport.h>
#endif 

/* struct View, struct ViewPort */
#ifndef GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif 

extern struct IntuitionBase *IntuitionBase;
void OpenIntuition(void);
void Intuition(struct InputEvent);
long AddGadget(struct Window *, struct Gadget *, long);
long ClearDMRequest(struct Window *);
void ClearMenuStrip(struct Window *);
void ClearPointer(struct Window *);
void CloseScreen(struct Screen *);
void CloseWindow(struct Window *);
long CloseWorkBench(void);
void CurrentTime(long *, long *);
long DisplayAlert(long, char *, long);
void DisplayBeep(struct Screen *);
long DoubleClick(long, long, long, long);
void DrawBorder(struct RastPort *, struct Border *, long, long);
void DrawImage(struct RastPort *, struct Image *, long, long);
void EndRequest(struct Requester *, struct Window *);
struct Preferences *GetDefPrefs(struct Preferences *, long);
struct Preferences *GetPrefs(struct Preferences *, long);
void InitRequester(struct Requester *);
struct MenuItem *ItemAddress(struct Menu *, long);
void ModifyIDCMP(struct Window *, long);
void ModifyProp(struct Gadget *, struct Window *, struct Requester *, long, long, long, long, long);
void MoveScreen(struct Screen *, long, long);
void MoveWindow(struct Window *, long, long);
void OffGadget(struct Gadget *, struct Window *, struct Requester *);
void OffMenu(struct Window *, long);
void OnGadget(struct Gadget *, struct Window *, struct Requester *);
void OnMenu(struct Window *, long);
struct Screen *OpenScreen(struct NewScreen *);
struct Window *OpenWindow(struct NewWindow *);
long OpenWorkBench(void);
void PrintIText(struct RastPort *, struct IntuiText *, long, long);
void RefreshGadgets(struct Gadget *, struct Window *, struct Requester *);
long RemoveGadget(struct Window *, struct Gadget *);
void ReportMouse(struct Window *, long);
long Request(struct Requester *, struct Window *);
void ScreenToBack(struct Screen *);
void ScreenToFront(struct Screen *);
long SetDMRequest(struct Window *, struct Requester *);
void SetMenuStrip(struct Window *, struct Menu *);
void SetPointer(struct Window *, short *, long, long, long, long);
void SetWindowTitles(struct Window *, char *, char *);
void ShowTitle(struct Screen *, long);
void SizeWindow(struct Window *, long, long);
struct View *ViewAddress(void);
struct ViewPort *ViewPortAddress(struct Window *);
void WindowToBack(struct Window *);
void WindowToFront(struct Window *);
long WindowLimits(struct Window *, long, long, long, long);
/*--- start of next generation of names ---------------------------------------*/
void SetPrefs(struct Preferences *, long, long);
/*--- start of next next generation of names ----------------------------------*/
long IntuiTextLength(struct IntuiText *);
long WBenchToBack(void);
long WBenchToFront(void);
/*--- start of next next next generation of names -----------------------------*/
long AutoRequest(struct Window *, struct IntuiText *, struct IntuiText *, struct IntuiText *, long, long, long, long);
void BeginRefresh(struct Window *);
struct Window *BuildSysRequest(struct Window *, struct IntuiText *, struct IntuiText *, struct IntuiText *, long, long, long);
void EndRefresh(struct Window *, long);
void FreeSysRequest(struct Window *);
void MakeScreen(struct Screen *);
void RemakeDisplay(void);
void RethinkDisplay(void);
/*--- start of next next next next generation of names ------------------------*/
char *AllocRemember(struct Remember **, long, long);
void AlohaWorkbench(long);
void FreeRemember(struct Remember **, long);
/*--- start of 15 Nov 85 names ------------------------*/
long  LockIBase(long);
void UnlockIBase(long);
/*--- start of post-1.1 names ----*/
long GetScreenData(char *, long, long, struct Screen *);
void RefreshGList(struct Gadget *, struct Window *, struct Requester *, long);
long AddGList(struct Window *, struct Gadget *, long, long, struct Requester *);
long RemoveGList(struct Window *, struct Gadget *, long);
void ActivateWindow(struct Window *);
void RefreshWindowFrame(struct Window *);
long ActivateGadget(struct Gadget *, struct Window *, struct Requester *);
void NewModifyProp(struct Gadget *, struct Window *, struct Requester *, long, long, long, long, long, long);
