#ifndef CLIB_INTUITION_PROTOS_H
#define CLIB_INTUITION_PROTOS_H


/*
**	$VER: intuition_protos.h 34.106 (03.10.2019)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2019 
**	All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

VOID OpenIntuition(void);
VOID Intuition(struct InputEvent * iEvent);
UWORD AddGadget(struct Window * window, struct Gadget * gadget, ULONG position);
BOOL ClearDMRequest(struct Window * window);
VOID ClearMenuStrip(struct Window * window);
VOID ClearPointer(struct Window * window);
BOOL CloseScreen(struct Screen * screen);
VOID CloseWindow(struct Window * window);
LONG CloseWorkBench(void);
VOID CurrentTime(ULONG * seconds, ULONG * micros);
BOOL DisplayAlert(ULONG alertNumber, const STRPTR string, ULONG height);
VOID DisplayBeep(struct Screen * screen);
BOOL DoubleClick(ULONG sSeconds, ULONG sMicros, ULONG cSeconds, ULONG cMicros);
VOID DrawBorder(struct RastPort * rp, const struct Border * border, LONG leftOffset,
	LONG topOffset);
VOID DrawImage(struct RastPort * rp, struct Image * image, LONG leftOffset,
	LONG topOffset);
VOID EndRequest(struct Requester * requester, struct Window * window);
struct Preferences * GetDefPrefs(struct Preferences * preferences, LONG size);
struct Preferences * GetPrefs(struct Preferences * preferences, LONG size);
VOID InitRequester(struct Requester * requester);
struct MenuItem * ItemAddress(const struct Menu * menuStrip, ULONG menuNumber);
BOOL ModifyIDCMP(struct Window * window, ULONG flags);
VOID ModifyProp(struct Gadget * gadget, struct Window * window,
	struct Requester * requester, ULONG flags, ULONG horizPot,
	ULONG vertPot, ULONG horizBody, ULONG vertBody);
VOID MoveScreen(struct Screen * screen, LONG dx, LONG dy);
VOID MoveWindow(struct Window * window, LONG dx, LONG dy);
VOID OffGadget(struct Gadget * gadget, struct Window * window,
	struct Requester * requester);
VOID OffMenu(struct Window * window, ULONG menuNumber);
VOID OnGadget(struct Gadget * gadget, struct Window * window,
	struct Requester * requester);
VOID OnMenu(struct Window * window, ULONG menuNumber);
struct Screen * OpenScreen(const struct NewScreen * newScreen);
struct Window * OpenWindow(const struct NewWindow * newWindow);
ULONG OpenWorkBench(void);
VOID PrintIText(struct RastPort * rp, const struct IntuiText * iText, LONG left,
	LONG top);
VOID RefreshGadgets(struct Gadget * gadgets, struct Window * window,
	struct Requester * requester);
UWORD RemoveGadget(struct Window * window, struct Gadget * gadget);
VOID ReportMouse(LONG flag, struct Window * window);
VOID ReportMouse1(struct Window * flag, LONG window);
BOOL Request(struct Requester * requester, struct Window * window);
VOID ScreenToBack(struct Screen * screen);
VOID ScreenToFront(struct Screen * screen);
BOOL SetDMRequest(struct Window * window, struct Requester * requester);
BOOL SetMenuStrip(struct Window * window, struct Menu * menu);
VOID SetPointer(struct Window * window, UWORD * pointer, LONG height, LONG width,
	LONG xOffset, LONG yOffset);
VOID SetWindowTitles(struct Window * window, const STRPTR windowTitle,
	const STRPTR screenTitle);
VOID ShowTitle(struct Screen * screen, LONG showIt);
VOID SizeWindow(struct Window * window, LONG dx, LONG dy);
struct View * ViewAddress(void);
struct ViewPort * ViewPortAddress(const struct Window * window);
VOID WindowToBack(struct Window * window);
VOID WindowToFront(struct Window * window);
BOOL WindowLimits(struct Window * window, LONG widthMin, LONG heightMin, ULONG widthMax,
	ULONG heightMax);
struct Preferences  * SetPrefs(const struct Preferences * preferences, LONG size,
	LONG inform);
LONG IntuiTextLength(const struct IntuiText * iText);
BOOL WBenchToBack(void);
BOOL WBenchToFront(void);
BOOL AutoRequest(struct Window * window, const struct IntuiText * body,
	const struct IntuiText * posText, const struct IntuiText * negText,
	ULONG pFlag, ULONG nFlag, ULONG width, ULONG height);
VOID BeginRefresh(struct Window * window);
struct Window * BuildSysRequest(struct Window * window, const struct IntuiText * body,
	const struct IntuiText * posText, const struct IntuiText * negText,
	ULONG flags, ULONG width, ULONG height);
VOID EndRefresh(struct Window * window, LONG complete);
VOID FreeSysRequest(struct Window * window);
VOID MakeScreen(struct Screen * screen);
VOID RemakeDisplay(void);
VOID RethinkDisplay(void);
void * AllocRemember(struct Remember ** rememberKey, ULONG size, ULONG flags);
VOID FreeRemember(struct Remember ** rememberKey, LONG reallyForget);
ULONG LockIBase(ULONG dontknow);
VOID UnlockIBase(ULONG ibLock);
LONG GetScreenData(void * buffer, ULONG size, ULONG type, const struct Screen * screen);
VOID RefreshGList(struct Gadget * gadgets, struct Window * window,
	struct Requester * requester, LONG numGad);
UWORD AddGList(struct Window * window, struct Gadget * gadget, ULONG position,
	LONG numGad, struct Requester * requester);
UWORD RemoveGList(struct Window * remPtr, struct Gadget * gadget, LONG numGad);
VOID ActivateWindow(struct Window * window);
VOID RefreshWindowFrame(struct Window * window);
BOOL ActivateGadget(struct Gadget * gadgets, struct Window * window,
	struct Requester * requester);
VOID NewModifyProp(struct Gadget * gadget, struct Window * window,
	struct Requester * requester, ULONG flags, ULONG horizPot,
	ULONG vertPot, ULONG horizBody, ULONG vertBody, LONG numGad);

#endif	/*  CLIB_INTUITION_PROTOS_H  */
