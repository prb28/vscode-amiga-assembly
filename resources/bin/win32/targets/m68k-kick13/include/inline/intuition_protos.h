#ifndef _VBCCINLINE_INTUITION_H
#define _VBCCINLINE_INTUITION_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __OpenIntuition(__reg("a6") void *)="\tjsr\t-30(a6)";
#define OpenIntuition() __OpenIntuition(IntuitionBase)

VOID __Intuition(__reg("a6") void *, __reg("a0") struct InputEvent * iEvent)="\tjsr\t-36(a6)";
#define Intuition(iEvent) __Intuition(IntuitionBase, (iEvent))

UWORD __AddGadget(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Gadget * gadget, __reg("d0") ULONG position)="\tjsr\t-42(a6)";
#define AddGadget(window, gadget, position) __AddGadget(IntuitionBase, (window), (gadget), (position))

BOOL __ClearDMRequest(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-48(a6)";
#define ClearDMRequest(window) __ClearDMRequest(IntuitionBase, (window))

VOID __ClearMenuStrip(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-54(a6)";
#define ClearMenuStrip(window) __ClearMenuStrip(IntuitionBase, (window))

VOID __ClearPointer(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-60(a6)";
#define ClearPointer(window) __ClearPointer(IntuitionBase, (window))

BOOL __CloseScreen(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-66(a6)";
#define CloseScreen(screen) __CloseScreen(IntuitionBase, (screen))

VOID __CloseWindow(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-72(a6)";
#define CloseWindow(window) __CloseWindow(IntuitionBase, (window))

LONG __CloseWorkBench(__reg("a6") void *)="\tjsr\t-78(a6)";
#define CloseWorkBench() __CloseWorkBench(IntuitionBase)

VOID __CurrentTime(__reg("a6") void *, __reg("a0") ULONG * seconds, __reg("a1") ULONG * micros)="\tjsr\t-84(a6)";
#define CurrentTime(seconds, micros) __CurrentTime(IntuitionBase, (seconds), (micros))

BOOL __DisplayAlert(__reg("a6") void *, __reg("d0") ULONG alertNumber, __reg("a0") const STRPTR string, __reg("d1") ULONG height)="\tjsr\t-90(a6)";
#define DisplayAlert(alertNumber, string, height) __DisplayAlert(IntuitionBase, (alertNumber), (string), (height))

VOID __DisplayBeep(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-96(a6)";
#define DisplayBeep(screen) __DisplayBeep(IntuitionBase, (screen))

BOOL __DoubleClick(__reg("a6") void *, __reg("d0") ULONG sSeconds, __reg("d1") ULONG sMicros, __reg("d2") ULONG cSeconds, __reg("d3") ULONG cMicros)="\tjsr\t-102(a6)";
#define DoubleClick(sSeconds, sMicros, cSeconds, cMicros) __DoubleClick(IntuitionBase, (sSeconds), (sMicros), (cSeconds), (cMicros))

VOID __DrawBorder(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") const struct Border * border, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset)="\tjsr\t-108(a6)";
#define DrawBorder(rp, border, leftOffset, topOffset) __DrawBorder(IntuitionBase, (rp), (border), (leftOffset), (topOffset))

VOID __DrawImage(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct Image * image, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset)="\tjsr\t-114(a6)";
#define DrawImage(rp, image, leftOffset, topOffset) __DrawImage(IntuitionBase, (rp), (image), (leftOffset), (topOffset))

VOID __EndRequest(__reg("a6") void *, __reg("a0") struct Requester * requester, __reg("a1") struct Window * window)="\tjsr\t-120(a6)";
#define EndRequest(requester, window) __EndRequest(IntuitionBase, (requester), (window))

struct Preferences * __GetDefPrefs(__reg("a6") void *, __reg("a0") struct Preferences * preferences, __reg("d0") LONG size)="\tjsr\t-126(a6)";
#define GetDefPrefs(preferences, size) __GetDefPrefs(IntuitionBase, (preferences), (size))

struct Preferences * __GetPrefs(__reg("a6") void *, __reg("a0") struct Preferences * preferences, __reg("d0") LONG size)="\tjsr\t-132(a6)";
#define GetPrefs(preferences, size) __GetPrefs(IntuitionBase, (preferences), (size))

VOID __InitRequester(__reg("a6") void *, __reg("a0") struct Requester * requester)="\tjsr\t-138(a6)";
#define InitRequester(requester) __InitRequester(IntuitionBase, (requester))

struct MenuItem * __ItemAddress(__reg("a6") void *, __reg("a0") const struct Menu * menuStrip, __reg("d0") ULONG menuNumber)="\tjsr\t-144(a6)";
#define ItemAddress(menuStrip, menuNumber) __ItemAddress(IntuitionBase, (menuStrip), (menuNumber))

BOOL __ModifyIDCMP(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") ULONG flags)="\tjsr\t-150(a6)";
#define ModifyIDCMP(window, flags) __ModifyIDCMP(IntuitionBase, (window), (flags))

VOID __ModifyProp(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester, __reg("d0") ULONG flags, __reg("d1") ULONG horizPot, __reg("d2") ULONG vertPot, __reg("d3") ULONG horizBody, __reg("d4") ULONG vertBody)="\tjsr\t-156(a6)";
#define ModifyProp(gadget, window, requester, flags, horizPot, vertPot, horizBody, vertBody) __ModifyProp(IntuitionBase, (gadget), (window), (requester), (flags), (horizPot), (vertPot), (horizBody), (vertBody))

VOID __MoveScreen(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-162(a6)";
#define MoveScreen(screen, dx, dy) __MoveScreen(IntuitionBase, (screen), (dx), (dy))

VOID __MoveWindow(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-168(a6)";
#define MoveWindow(window, dx, dy) __MoveWindow(IntuitionBase, (window), (dx), (dy))

VOID __OffGadget(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester)="\tjsr\t-174(a6)";
#define OffGadget(gadget, window, requester) __OffGadget(IntuitionBase, (gadget), (window), (requester))

VOID __OffMenu(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") ULONG menuNumber)="\tjsr\t-180(a6)";
#define OffMenu(window, menuNumber) __OffMenu(IntuitionBase, (window), (menuNumber))

VOID __OnGadget(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester)="\tjsr\t-186(a6)";
#define OnGadget(gadget, window, requester) __OnGadget(IntuitionBase, (gadget), (window), (requester))

VOID __OnMenu(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") ULONG menuNumber)="\tjsr\t-192(a6)";
#define OnMenu(window, menuNumber) __OnMenu(IntuitionBase, (window), (menuNumber))

struct Screen * __OpenScreen(__reg("a6") void *, __reg("a0") const struct NewScreen * newScreen)="\tjsr\t-198(a6)";
#define OpenScreen(newScreen) __OpenScreen(IntuitionBase, (newScreen))

struct Window * __OpenWindow(__reg("a6") void *, __reg("a0") const struct NewWindow * newWindow)="\tjsr\t-204(a6)";
#define OpenWindow(newWindow) __OpenWindow(IntuitionBase, (newWindow))

ULONG __OpenWorkBench(__reg("a6") void *)="\tjsr\t-210(a6)";
#define OpenWorkBench() __OpenWorkBench(IntuitionBase)

VOID __PrintIText(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") const struct IntuiText * iText, __reg("d0") LONG left, __reg("d1") LONG top)="\tjsr\t-216(a6)";
#define PrintIText(rp, iText, left, top) __PrintIText(IntuitionBase, (rp), (iText), (left), (top))

VOID __RefreshGadgets(__reg("a6") void *, __reg("a0") struct Gadget * gadgets, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester)="\tjsr\t-222(a6)";
#define RefreshGadgets(gadgets, window, requester) __RefreshGadgets(IntuitionBase, (gadgets), (window), (requester))

UWORD __RemoveGadget(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Gadget * gadget)="\tjsr\t-228(a6)";
#define RemoveGadget(window, gadget) __RemoveGadget(IntuitionBase, (window), (gadget))

VOID __ReportMouse(__reg("a6") void *, __reg("d0") LONG flag, __reg("a0") struct Window * window)="\tjsr\t-234(a6)";
#define ReportMouse(flag, window) __ReportMouse(IntuitionBase, (flag), (window))

#define ReportMouse1(flag, window) __ReportMouse(IntuitionBase, (flag), (window))

BOOL __Request(__reg("a6") void *, __reg("a0") struct Requester * requester, __reg("a1") struct Window * window)="\tjsr\t-240(a6)";
#define Request(requester, window) __Request(IntuitionBase, (requester), (window))

VOID __ScreenToBack(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-246(a6)";
#define ScreenToBack(screen) __ScreenToBack(IntuitionBase, (screen))

VOID __ScreenToFront(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-252(a6)";
#define ScreenToFront(screen) __ScreenToFront(IntuitionBase, (screen))

BOOL __SetDMRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Requester * requester)="\tjsr\t-258(a6)";
#define SetDMRequest(window, requester) __SetDMRequest(IntuitionBase, (window), (requester))

BOOL __SetMenuStrip(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Menu * menu)="\tjsr\t-264(a6)";
#define SetMenuStrip(window, menu) __SetMenuStrip(IntuitionBase, (window), (menu))

VOID __SetPointer(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") UWORD * pointer, __reg("d0") LONG height, __reg("d1") LONG width, __reg("d2") LONG xOffset, __reg("d3") LONG yOffset)="\tjsr\t-270(a6)";
#define SetPointer(window, pointer, height, width, xOffset, yOffset) __SetPointer(IntuitionBase, (window), (pointer), (height), (width), (xOffset), (yOffset))

VOID __SetWindowTitles(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") const STRPTR windowTitle, __reg("a2") const STRPTR screenTitle)="\tjsr\t-276(a6)";
#define SetWindowTitles(window, windowTitle, screenTitle) __SetWindowTitles(IntuitionBase, (window), (windowTitle), (screenTitle))

VOID __ShowTitle(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") LONG showIt)="\tjsr\t-282(a6)";
#define ShowTitle(screen, showIt) __ShowTitle(IntuitionBase, (screen), (showIt))

VOID __SizeWindow(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-288(a6)";
#define SizeWindow(window, dx, dy) __SizeWindow(IntuitionBase, (window), (dx), (dy))

struct View * __ViewAddress(__reg("a6") void *)="\tjsr\t-294(a6)";
#define ViewAddress() __ViewAddress(IntuitionBase)

struct ViewPort * __ViewPortAddress(__reg("a6") void *, __reg("a0") const struct Window * window)="\tjsr\t-300(a6)";
#define ViewPortAddress(window) __ViewPortAddress(IntuitionBase, (window))

VOID __WindowToBack(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-306(a6)";
#define WindowToBack(window) __WindowToBack(IntuitionBase, (window))

VOID __WindowToFront(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-312(a6)";
#define WindowToFront(window) __WindowToFront(IntuitionBase, (window))

BOOL __WindowLimits(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG widthMin, __reg("d1") LONG heightMin, __reg("d2") ULONG widthMax, __reg("d3") ULONG heightMax)="\tjsr\t-318(a6)";
#define WindowLimits(window, widthMin, heightMin, widthMax, heightMax) __WindowLimits(IntuitionBase, (window), (widthMin), (heightMin), (widthMax), (heightMax))

struct Preferences  * __SetPrefs(__reg("a6") void *, __reg("a0") const struct Preferences * preferences, __reg("d0") LONG size, __reg("d1") LONG inform)="\tjsr\t-324(a6)";
#define SetPrefs(preferences, size, inform) __SetPrefs(IntuitionBase, (preferences), (size), (inform))

LONG __IntuiTextLength(__reg("a6") void *, __reg("a0") const struct IntuiText * iText)="\tjsr\t-330(a6)";
#define IntuiTextLength(iText) __IntuiTextLength(IntuitionBase, (iText))

BOOL __WBenchToBack(__reg("a6") void *)="\tjsr\t-336(a6)";
#define WBenchToBack() __WBenchToBack(IntuitionBase)

BOOL __WBenchToFront(__reg("a6") void *)="\tjsr\t-342(a6)";
#define WBenchToFront() __WBenchToFront(IntuitionBase)

BOOL __AutoRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") const struct IntuiText * body, __reg("a2") const struct IntuiText * posText, __reg("a3") const struct IntuiText * negText, __reg("d0") ULONG pFlag, __reg("d1") ULONG nFlag, __reg("d2") ULONG width, __reg("d3") ULONG height)="\tjsr\t-348(a6)";
#define AutoRequest(window, body, posText, negText, pFlag, nFlag, width, height) __AutoRequest(IntuitionBase, (window), (body), (posText), (negText), (pFlag), (nFlag), (width), (height))

VOID __BeginRefresh(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-354(a6)";
#define BeginRefresh(window) __BeginRefresh(IntuitionBase, (window))

struct Window * __BuildSysRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") const struct IntuiText * body, __reg("a2") const struct IntuiText * posText, __reg("a3") const struct IntuiText * negText, __reg("d0") ULONG flags, __reg("d1") ULONG width, __reg("d2") ULONG height)="\tjsr\t-360(a6)";
#define BuildSysRequest(window, body, posText, negText, flags, width, height) __BuildSysRequest(IntuitionBase, (window), (body), (posText), (negText), (flags), (width), (height))

VOID __EndRefresh(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG complete)="\tjsr\t-366(a6)";
#define EndRefresh(window, complete) __EndRefresh(IntuitionBase, (window), (complete))

VOID __FreeSysRequest(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-372(a6)";
#define FreeSysRequest(window) __FreeSysRequest(IntuitionBase, (window))

VOID __MakeScreen(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-378(a6)";
#define MakeScreen(screen) __MakeScreen(IntuitionBase, (screen))

VOID __RemakeDisplay(__reg("a6") void *)="\tjsr\t-384(a6)";
#define RemakeDisplay() __RemakeDisplay(IntuitionBase)

VOID __RethinkDisplay(__reg("a6") void *)="\tjsr\t-390(a6)";
#define RethinkDisplay() __RethinkDisplay(IntuitionBase)

void * __AllocRemember(__reg("a6") void *, __reg("a0") struct Remember ** rememberKey, __reg("d0") ULONG size, __reg("d1") ULONG flags)="\tjsr\t-396(a6)";
#define AllocRemember(rememberKey, size, flags) __AllocRemember(IntuitionBase, (rememberKey), (size), (flags))

VOID __FreeRemember(__reg("a6") void *, __reg("a0") struct Remember ** rememberKey, __reg("d0") LONG reallyForget)="\tjsr\t-408(a6)";
#define FreeRemember(rememberKey, reallyForget) __FreeRemember(IntuitionBase, (rememberKey), (reallyForget))

ULONG __LockIBase(__reg("a6") void *, __reg("d0") ULONG dontknow)="\tjsr\t-414(a6)";
#define LockIBase(dontknow) __LockIBase(IntuitionBase, (dontknow))

VOID __UnlockIBase(__reg("a6") void *, __reg("a0") void * ibLock)="\tjsr\t-420(a6)";
#define UnlockIBase(ibLock) __UnlockIBase(IntuitionBase, (void *)(ibLock))

LONG __GetScreenData(__reg("a6") void *, __reg("a0") void * buffer, __reg("d0") ULONG size, __reg("d1") ULONG type, __reg("a1") const struct Screen * screen)="\tjsr\t-426(a6)";
#define GetScreenData(buffer, size, type, screen) __GetScreenData(IntuitionBase, (buffer), (size), (type), (screen))

VOID __RefreshGList(__reg("a6") void *, __reg("a0") struct Gadget * gadgets, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester, __reg("d0") LONG numGad)="\tjsr\t-432(a6)";
#define RefreshGList(gadgets, window, requester, numGad) __RefreshGList(IntuitionBase, (gadgets), (window), (requester), (numGad))

UWORD __AddGList(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Gadget * gadget, __reg("d0") ULONG position, __reg("d1") LONG numGad, __reg("a2") struct Requester * requester)="\tjsr\t-438(a6)";
#define AddGList(window, gadget, position, numGad, requester) __AddGList(IntuitionBase, (window), (gadget), (position), (numGad), (requester))

UWORD __RemoveGList(__reg("a6") void *, __reg("a0") struct Window * remPtr, __reg("a1") struct Gadget * gadget, __reg("d0") LONG numGad)="\tjsr\t-444(a6)";
#define RemoveGList(remPtr, gadget, numGad) __RemoveGList(IntuitionBase, (remPtr), (gadget), (numGad))

VOID __ActivateWindow(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-450(a6)";
#define ActivateWindow(window) __ActivateWindow(IntuitionBase, (window))

VOID __RefreshWindowFrame(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-456(a6)";
#define RefreshWindowFrame(window) __RefreshWindowFrame(IntuitionBase, (window))

BOOL __ActivateGadget(__reg("a6") void *, __reg("a0") struct Gadget * gadgets, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester)="\tjsr\t-462(a6)";
#define ActivateGadget(gadgets, window, requester) __ActivateGadget(IntuitionBase, (gadgets), (window), (requester))

VOID __NewModifyProp(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester, __reg("d0") ULONG flags, __reg("d1") ULONG horizPot, __reg("d2") ULONG vertPot, __reg("d3") ULONG horizBody, __reg("d4") ULONG vertBody, __reg("d5") LONG numGad)="\tjsr\t-468(a6)";
#define NewModifyProp(gadget, window, requester, flags, horizPot, vertPot, horizBody, vertBody, numGad) __NewModifyProp(IntuitionBase, (gadget), (window), (requester), (flags), (horizPot), (vertPot), (horizBody), (vertBody), (numGad))

#endif /*  _VBCCINLINE_INTUITION_H  */
