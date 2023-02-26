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

BOOL __DisplayAlert(__reg("a6") void *, __reg("d0") ULONG alertNumber, __reg("a0") CONST_STRPTR string, __reg("d1") ULONG height)="\tjsr\t-90(a6)";
#define DisplayAlert(alertNumber, string, height) __DisplayAlert(IntuitionBase, (alertNumber), (string), (height))

VOID __DisplayBeep(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-96(a6)";
#define DisplayBeep(screen) __DisplayBeep(IntuitionBase, (screen))

BOOL __DoubleClick(__reg("a6") void *, __reg("d0") ULONG sSeconds, __reg("d1") ULONG sMicros, __reg("d2") ULONG cSeconds, __reg("d3") ULONG cMicros)="\tjsr\t-102(a6)";
#define DoubleClick(sSeconds, sMicros, cSeconds, cMicros) __DoubleClick(IntuitionBase, (sSeconds), (sMicros), (cSeconds), (cMicros))

VOID __DrawBorder(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct Border * border, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset)="\tjsr\t-108(a6)";
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

struct MenuItem * __ItemAddress(__reg("a6") void *, __reg("a0") CONST struct Menu * menuStrip, __reg("d0") ULONG menuNumber)="\tjsr\t-144(a6)";
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

struct Screen * __OpenScreen(__reg("a6") void *, __reg("a0") CONST struct NewScreen * newScreen)="\tjsr\t-198(a6)";
#define OpenScreen(newScreen) __OpenScreen(IntuitionBase, (newScreen))

struct Window * __OpenWindow(__reg("a6") void *, __reg("a0") CONST struct NewWindow * newWindow)="\tjsr\t-204(a6)";
#define OpenWindow(newWindow) __OpenWindow(IntuitionBase, (newWindow))

ULONG __OpenWorkBench(__reg("a6") void *)="\tjsr\t-210(a6)";
#define OpenWorkBench() __OpenWorkBench(IntuitionBase)

VOID __PrintIText(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") CONST struct IntuiText * iText, __reg("d0") LONG left, __reg("d1") LONG top)="\tjsr\t-216(a6)";
#define PrintIText(rp, iText, left, top) __PrintIText(IntuitionBase, (rp), (iText), (left), (top))

VOID __RefreshGadgets(__reg("a6") void *, __reg("a0") struct Gadget * gadgets, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester)="\tjsr\t-222(a6)";
#define RefreshGadgets(gadgets, window, requester) __RefreshGadgets(IntuitionBase, (gadgets), (window), (requester))

UWORD __RemoveGadget(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Gadget * gadget)="\tjsr\t-228(a6)";
#define RemoveGadget(window, gadget) __RemoveGadget(IntuitionBase, (window), (gadget))

VOID __ReportMouse(__reg("a6") void *, __reg("d0") LONG flag, __reg("a0") struct Window * window)="\tjsr\t-234(a6)";
#define ReportMouse(flag, window) __ReportMouse(IntuitionBase, (flag), (window))

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

VOID __SetWindowTitles(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST_STRPTR windowTitle, __reg("a2") CONST_STRPTR screenTitle)="\tjsr\t-276(a6)";
#define SetWindowTitles(window, windowTitle, screenTitle) __SetWindowTitles(IntuitionBase, (window), (windowTitle), (screenTitle))

VOID __ShowTitle(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") LONG showIt)="\tjsr\t-282(a6)";
#define ShowTitle(screen, showIt) __ShowTitle(IntuitionBase, (screen), (showIt))

VOID __SizeWindow(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG dx, __reg("d1") LONG dy)="\tjsr\t-288(a6)";
#define SizeWindow(window, dx, dy) __SizeWindow(IntuitionBase, (window), (dx), (dy))

struct View * __ViewAddress(__reg("a6") void *)="\tjsr\t-294(a6)";
#define ViewAddress() __ViewAddress(IntuitionBase)

struct ViewPort * __ViewPortAddress(__reg("a6") void *, __reg("a0") CONST struct Window * window)="\tjsr\t-300(a6)";
#define ViewPortAddress(window) __ViewPortAddress(IntuitionBase, (window))

VOID __WindowToBack(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-306(a6)";
#define WindowToBack(window) __WindowToBack(IntuitionBase, (window))

VOID __WindowToFront(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-312(a6)";
#define WindowToFront(window) __WindowToFront(IntuitionBase, (window))

BOOL __WindowLimits(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG widthMin, __reg("d1") LONG heightMin, __reg("d2") ULONG widthMax, __reg("d3") ULONG heightMax)="\tjsr\t-318(a6)";
#define WindowLimits(window, widthMin, heightMin, widthMax, heightMax) __WindowLimits(IntuitionBase, (window), (widthMin), (heightMin), (widthMax), (heightMax))

struct Preferences * __SetPrefs(__reg("a6") void *, __reg("a0") CONST struct Preferences * preferences, __reg("d0") LONG size, __reg("d1") LONG inform)="\tjsr\t-324(a6)";
#define SetPrefs(preferences, size, inform) __SetPrefs(IntuitionBase, (preferences), (size), (inform))

LONG __IntuiTextLength(__reg("a6") void *, __reg("a0") CONST struct IntuiText * iText)="\tjsr\t-330(a6)";
#define IntuiTextLength(iText) __IntuiTextLength(IntuitionBase, (iText))

BOOL __WBenchToBack(__reg("a6") void *)="\tjsr\t-336(a6)";
#define WBenchToBack() __WBenchToBack(IntuitionBase)

BOOL __WBenchToFront(__reg("a6") void *)="\tjsr\t-342(a6)";
#define WBenchToFront() __WBenchToFront(IntuitionBase)

BOOL __AutoRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct IntuiText * body, __reg("a2") CONST struct IntuiText * posText, __reg("a3") CONST struct IntuiText * negText, __reg("d0") ULONG pFlag, __reg("d1") ULONG nFlag, __reg("d2") ULONG width, __reg("d3") ULONG height)="\tjsr\t-348(a6)";
#define AutoRequest(window, body, posText, negText, pFlag, nFlag, width, height) __AutoRequest(IntuitionBase, (window), (body), (posText), (negText), (pFlag), (nFlag), (width), (height))

VOID __BeginRefresh(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-354(a6)";
#define BeginRefresh(window) __BeginRefresh(IntuitionBase, (window))

struct Window * __BuildSysRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct IntuiText * body, __reg("a2") CONST struct IntuiText * posText, __reg("a3") CONST struct IntuiText * negText, __reg("d0") ULONG flags, __reg("d1") ULONG width, __reg("d2") ULONG height)="\tjsr\t-360(a6)";
#define BuildSysRequest(window, body, posText, negText, flags, width, height) __BuildSysRequest(IntuitionBase, (window), (body), (posText), (negText), (flags), (width), (height))

VOID __EndRefresh(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG complete)="\tjsr\t-366(a6)";
#define EndRefresh(window, complete) __EndRefresh(IntuitionBase, (window), (complete))

VOID __FreeSysRequest(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-372(a6)";
#define FreeSysRequest(window) __FreeSysRequest(IntuitionBase, (window))

LONG __MakeScreen(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-378(a6)";
#define MakeScreen(screen) __MakeScreen(IntuitionBase, (screen))

LONG __RemakeDisplay(__reg("a6") void *)="\tjsr\t-384(a6)";
#define RemakeDisplay() __RemakeDisplay(IntuitionBase)

LONG __RethinkDisplay(__reg("a6") void *)="\tjsr\t-390(a6)";
#define RethinkDisplay() __RethinkDisplay(IntuitionBase)

APTR __AllocRemember(__reg("a6") void *, __reg("a0") struct Remember ** rememberKey, __reg("d0") ULONG size, __reg("d1") ULONG flags)="\tjsr\t-396(a6)";
#define AllocRemember(rememberKey, size, flags) __AllocRemember(IntuitionBase, (rememberKey), (size), (flags))

VOID __FreeRemember(__reg("a6") void *, __reg("a0") struct Remember ** rememberKey, __reg("d0") LONG reallyForget)="\tjsr\t-408(a6)";
#define FreeRemember(rememberKey, reallyForget) __FreeRemember(IntuitionBase, (rememberKey), (reallyForget))

ULONG __LockIBase(__reg("a6") void *, __reg("d0") ULONG dontknow)="\tjsr\t-414(a6)";
#define LockIBase(dontknow) __LockIBase(IntuitionBase, (dontknow))

VOID __UnlockIBase(__reg("a6") void *, __reg("a0") void * ibLock)="\tjsr\t-420(a6)";
#define UnlockIBase(ibLock) __UnlockIBase(IntuitionBase, (void *)(ibLock))

LONG __GetScreenData(__reg("a6") void *, __reg("a0") APTR buffer, __reg("d0") ULONG size, __reg("d1") ULONG type, __reg("a1") CONST struct Screen * screen)="\tjsr\t-426(a6)";
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

LONG __QueryOverscan(__reg("a6") void *, __reg("a0") void * displayID, __reg("a1") struct Rectangle * rect, __reg("d0") LONG oScanType)="\tjsr\t-474(a6)";
#define QueryOverscan(displayID, rect, oScanType) __QueryOverscan(IntuitionBase, (void *)(displayID), (rect), (oScanType))

VOID __MoveWindowInFrontOf(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Window * behindWindow)="\tjsr\t-480(a6)";
#define MoveWindowInFrontOf(window, behindWindow) __MoveWindowInFrontOf(IntuitionBase, (window), (behindWindow))

VOID __ChangeWindowBox(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") LONG left, __reg("d1") LONG top, __reg("d2") LONG width, __reg("d3") LONG height)="\tjsr\t-486(a6)";
#define ChangeWindowBox(window, left, top, width, height) __ChangeWindowBox(IntuitionBase, (window), (left), (top), (width), (height))

struct Hook * __SetEditHook(__reg("a6") void *, __reg("a0") struct Hook * hook)="\tjsr\t-492(a6)";
#define SetEditHook(hook) __SetEditHook(IntuitionBase, (hook))

LONG __SetMouseQueue(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") ULONG queueLength)="\tjsr\t-498(a6)";
#define SetMouseQueue(window, queueLength) __SetMouseQueue(IntuitionBase, (window), (queueLength))

VOID __ZipWindow(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-504(a6)";
#define ZipWindow(window) __ZipWindow(IntuitionBase, (window))

struct Screen * __LockPubScreen(__reg("a6") void *, __reg("a0") CONST_STRPTR name)="\tjsr\t-510(a6)";
#define LockPubScreen(name) __LockPubScreen(IntuitionBase, (name))

VOID __UnlockPubScreen(__reg("a6") void *, __reg("a0") CONST_STRPTR name, __reg("a1") struct Screen * screen)="\tjsr\t-516(a6)";
#define UnlockPubScreen(name, screen) __UnlockPubScreen(IntuitionBase, (name), (screen))

struct List * __LockPubScreenList(__reg("a6") void *)="\tjsr\t-522(a6)";
#define LockPubScreenList() __LockPubScreenList(IntuitionBase)

VOID __UnlockPubScreenList(__reg("a6") void *)="\tjsr\t-528(a6)";
#define UnlockPubScreenList() __UnlockPubScreenList(IntuitionBase)

STRPTR __NextPubScreen(__reg("a6") void *, __reg("a0") CONST struct Screen * screen, __reg("a1") STRPTR namebuf)="\tjsr\t-534(a6)";
#define NextPubScreen(screen, namebuf) __NextPubScreen(IntuitionBase, (screen), (namebuf))

VOID __SetDefaultPubScreen(__reg("a6") void *, __reg("a0") CONST_STRPTR name)="\tjsr\t-540(a6)";
#define SetDefaultPubScreen(name) __SetDefaultPubScreen(IntuitionBase, (name))

UWORD __SetPubScreenModes(__reg("a6") void *, __reg("d0") ULONG modes)="\tjsr\t-546(a6)";
#define SetPubScreenModes(modes) __SetPubScreenModes(IntuitionBase, (modes))

UWORD __PubScreenStatus(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") ULONG statusFlags)="\tjsr\t-552(a6)";
#define PubScreenStatus(screen, statusFlags) __PubScreenStatus(IntuitionBase, (screen), (statusFlags))

struct RastPort * __ObtainGIRPort(__reg("a6") void *, __reg("a0") struct GadgetInfo * gInfo)="\tjsr\t-558(a6)";
#define ObtainGIRPort(gInfo) __ObtainGIRPort(IntuitionBase, (gInfo))

VOID __ReleaseGIRPort(__reg("a6") void *, __reg("a0") struct RastPort * rp)="\tjsr\t-564(a6)";
#define ReleaseGIRPort(rp) __ReleaseGIRPort(IntuitionBase, (rp))

VOID __GadgetMouse(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct GadgetInfo * gInfo, __reg("a2") WORD * mousePoint)="\tjsr\t-570(a6)";
#define GadgetMouse(gadget, gInfo, mousePoint) __GadgetMouse(IntuitionBase, (gadget), (gInfo), (mousePoint))

VOID __GetDefaultPubScreen(__reg("a6") void *, __reg("a0") STRPTR nameBuffer)="\tjsr\t-582(a6)";
#define GetDefaultPubScreen(nameBuffer) __GetDefaultPubScreen(IntuitionBase, (nameBuffer))

LONG __EasyRequestArgs(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct EasyStruct * easyStruct, __reg("a2") ULONG * idcmpPtr, __reg("a3") CONST APTR args)="\tjsr\t-588(a6)";
#define EasyRequestArgs(window, easyStruct, idcmpPtr, args) __EasyRequestArgs(IntuitionBase, (window), (easyStruct), (idcmpPtr), (args))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __EasyRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct EasyStruct * easyStruct, __reg("a2") ULONG * idcmpPtr, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-588(a6)\n\tmovea.l\t(a7)+,a3";
#define EasyRequest(window, easyStruct, ...) __EasyRequest(IntuitionBase, (window), (easyStruct), __VA_ARGS__)
#endif

struct Window * __BuildEasyRequestArgs(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct EasyStruct * easyStruct, __reg("d0") ULONG idcmp, __reg("a3") CONST APTR args)="\tjsr\t-594(a6)";
#define BuildEasyRequestArgs(window, easyStruct, idcmp, args) __BuildEasyRequestArgs(IntuitionBase, (window), (easyStruct), (idcmp), (args))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Window * __BuildEasyRequest(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") CONST struct EasyStruct * easyStruct, __reg("d0") ULONG idcmp, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-594(a6)\n\tmovea.l\t(a7)+,a3";
#define BuildEasyRequest(window, easyStruct, ...) __BuildEasyRequest(IntuitionBase, (window), (easyStruct), __VA_ARGS__)
#endif

LONG __SysReqHandler(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") ULONG * idcmpPtr, __reg("d0") LONG waitInput)="\tjsr\t-600(a6)";
#define SysReqHandler(window, idcmpPtr, waitInput) __SysReqHandler(IntuitionBase, (window), (idcmpPtr), (waitInput))

struct Window * __OpenWindowTagList(__reg("a6") void *, __reg("a0") CONST struct NewWindow * newWindow, __reg("a1") CONST struct TagItem * tagList)="\tjsr\t-606(a6)";
#define OpenWindowTagList(newWindow, tagList) __OpenWindowTagList(IntuitionBase, (newWindow), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Window * __OpenWindowTags(__reg("a6") void *, __reg("a0") CONST struct NewWindow * newWindow, ULONG tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-606(a6)\n\tmovea.l\t(a7)+,a1";
#define OpenWindowTags(newWindow, ...) __OpenWindowTags(IntuitionBase, (newWindow), __VA_ARGS__)
#endif

struct Screen * __OpenScreenTagList(__reg("a6") void *, __reg("a0") CONST struct NewScreen * newScreen, __reg("a1") CONST struct TagItem * tagList)="\tjsr\t-612(a6)";
#define OpenScreenTagList(newScreen, tagList) __OpenScreenTagList(IntuitionBase, (newScreen), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Screen * __OpenScreenTags(__reg("a6") void *, __reg("a0") CONST struct NewScreen * newScreen, ULONG tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-612(a6)\n\tmovea.l\t(a7)+,a1";
#define OpenScreenTags(newScreen, ...) __OpenScreenTags(IntuitionBase, (newScreen), __VA_ARGS__)
#endif

VOID __DrawImageState(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct Image * image, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset, __reg("d2") ULONG state, __reg("a2") CONST struct DrawInfo * drawInfo)="\tjsr\t-618(a6)";
#define DrawImageState(rp, image, leftOffset, topOffset, state, drawInfo) __DrawImageState(IntuitionBase, (rp), (image), (leftOffset), (topOffset), (state), (drawInfo))

BOOL __PointInImage(__reg("a6") void *, __reg("d0") ULONG point, __reg("a0") struct Image * image)="\tjsr\t-624(a6)";
#define PointInImage(point, image) __PointInImage(IntuitionBase, (point), (image))

VOID __EraseImage(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct Image * image, __reg("d0") LONG leftOffset, __reg("d1") LONG topOffset)="\tjsr\t-630(a6)";
#define EraseImage(rp, image, leftOffset, topOffset) __EraseImage(IntuitionBase, (rp), (image), (leftOffset), (topOffset))

APTR __NewObjectA(__reg("a6") void *, __reg("a0") struct IClass * classPtr, __reg("a1") CONST_STRPTR classID, __reg("a2") CONST struct TagItem * tagList)="\tjsr\t-636(a6)";
#define NewObjectA(classPtr, classID, tagList) __NewObjectA(IntuitionBase, (classPtr), (classID), (tagList))

VOID __DisposeObject(__reg("a6") void *, __reg("a0") APTR object)="\tjsr\t-642(a6)";
#define DisposeObject(object) __DisposeObject(IntuitionBase, (object))

ULONG __SetAttrsA(__reg("a6") void *, __reg("a0") APTR object, __reg("a1") CONST struct TagItem * tagList)="\tjsr\t-648(a6)";
#define SetAttrsA(object, tagList) __SetAttrsA(IntuitionBase, (object), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetAttrs(__reg("a6") void *, __reg("a0") APTR object, ULONG tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-648(a6)\n\tmovea.l\t(a7)+,a1";
#define SetAttrs(object, ...) __SetAttrs(IntuitionBase, (object), __VA_ARGS__)
#endif

ULONG __GetAttr(__reg("a6") void *, __reg("d0") ULONG attrID, __reg("a0") APTR object, __reg("a1") ULONG * storagePtr)="\tjsr\t-654(a6)";
#define GetAttr(attrID, object, storagePtr) __GetAttr(IntuitionBase, (attrID), (object), (storagePtr))

ULONG __SetGadgetAttrsA(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester, __reg("a3") CONST struct TagItem * tagList)="\tjsr\t-660(a6)";
#define SetGadgetAttrsA(gadget, window, requester, tagList) __SetGadgetAttrsA(IntuitionBase, (gadget), (window), (requester), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetGadgetAttrs(__reg("a6") void *, __reg("a0") struct Gadget * gadget, __reg("a1") struct Window * window, __reg("a2") struct Requester * requester, ULONG tagList, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-660(a6)\n\tmovea.l\t(a7)+,a3";
#define SetGadgetAttrs(gadget, window, requester, ...) __SetGadgetAttrs(IntuitionBase, (gadget), (window), (requester), __VA_ARGS__)
#endif

APTR __NextObject(__reg("a6") void *, __reg("a0") APTR objectPtrPtr)="\tjsr\t-666(a6)";
#define NextObject(objectPtrPtr) __NextObject(IntuitionBase, (objectPtrPtr))

struct IClass * __MakeClass(__reg("a6") void *, __reg("a0") CONST_STRPTR classID, __reg("a1") CONST_STRPTR superClassID, __reg("a2") CONST struct IClass * superClassPtr, __reg("d0") ULONG instanceSize, __reg("d1") ULONG flags)="\tjsr\t-678(a6)";
#define MakeClass(classID, superClassID, superClassPtr, instanceSize, flags) __MakeClass(IntuitionBase, (classID), (superClassID), (superClassPtr), (instanceSize), (flags))

VOID __AddClass(__reg("a6") void *, __reg("a0") struct IClass * classPtr)="\tjsr\t-684(a6)";
#define AddClass(classPtr) __AddClass(IntuitionBase, (classPtr))

struct DrawInfo * __GetScreenDrawInfo(__reg("a6") void *, __reg("a0") struct Screen * screen)="\tjsr\t-690(a6)";
#define GetScreenDrawInfo(screen) __GetScreenDrawInfo(IntuitionBase, (screen))

VOID __FreeScreenDrawInfo(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("a1") struct DrawInfo * drawInfo)="\tjsr\t-696(a6)";
#define FreeScreenDrawInfo(screen, drawInfo) __FreeScreenDrawInfo(IntuitionBase, (screen), (drawInfo))

BOOL __ResetMenuStrip(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") struct Menu * menu)="\tjsr\t-702(a6)";
#define ResetMenuStrip(window, menu) __ResetMenuStrip(IntuitionBase, (window), (menu))

VOID __RemoveClass(__reg("a6") void *, __reg("a0") struct IClass * classPtr)="\tjsr\t-708(a6)";
#define RemoveClass(classPtr) __RemoveClass(IntuitionBase, (classPtr))

BOOL __FreeClass(__reg("a6") void *, __reg("a0") struct IClass * classPtr)="\tjsr\t-714(a6)";
#define FreeClass(classPtr) __FreeClass(IntuitionBase, (classPtr))

struct ScreenBuffer * __AllocScreenBuffer(__reg("a6") void *, __reg("a0") struct Screen * sc, __reg("a1") struct BitMap * bm, __reg("d0") ULONG flags)="\tjsr\t-768(a6)";
#define AllocScreenBuffer(sc, bm, flags) __AllocScreenBuffer(IntuitionBase, (sc), (bm), (flags))

VOID __FreeScreenBuffer(__reg("a6") void *, __reg("a0") struct Screen * sc, __reg("a1") struct ScreenBuffer * sb)="\tjsr\t-774(a6)";
#define FreeScreenBuffer(sc, sb) __FreeScreenBuffer(IntuitionBase, (sc), (sb))

ULONG __ChangeScreenBuffer(__reg("a6") void *, __reg("a0") struct Screen * sc, __reg("a1") struct ScreenBuffer * sb)="\tjsr\t-780(a6)";
#define ChangeScreenBuffer(sc, sb) __ChangeScreenBuffer(IntuitionBase, (sc), (sb))

VOID __ScreenDepth(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") ULONG flags, __reg("a1") APTR reserved)="\tjsr\t-786(a6)";
#define ScreenDepth(screen, flags, reserved) __ScreenDepth(IntuitionBase, (screen), (flags), (reserved))

VOID __ScreenPosition(__reg("a6") void *, __reg("a0") struct Screen * screen, __reg("d0") ULONG flags, __reg("d1") LONG x1, __reg("d2") LONG y1, __reg("d3") LONG x2, __reg("d4") LONG y2)="\tjsr\t-792(a6)";
#define ScreenPosition(screen, flags, x1, y1, x2, y2) __ScreenPosition(IntuitionBase, (screen), (flags), (x1), (y1), (x2), (y2))

VOID __ScrollWindowRaster(__reg("a6") void *, __reg("a1") struct Window * win, __reg("d0") LONG dx, __reg("d1") LONG dy, __reg("d2") LONG xMin, __reg("d3") LONG yMin, __reg("d4") LONG xMax, __reg("d5") LONG yMax)="\tjsr\t-798(a6)";
#define ScrollWindowRaster(win, dx, dy, xMin, yMin, xMax, yMax) __ScrollWindowRaster(IntuitionBase, (win), (dx), (dy), (xMin), (yMin), (xMax), (yMax))

VOID __LendMenus(__reg("a6") void *, __reg("a0") struct Window * fromwindow, __reg("a1") struct Window * towindow)="\tjsr\t-804(a6)";
#define LendMenus(fromwindow, towindow) __LendMenus(IntuitionBase, (fromwindow), (towindow))

ULONG __DoGadgetMethodA(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, __reg("a3") Msg message)="\tjsr\t-810(a6)";
#define DoGadgetMethodA(gad, win, req, message) __DoGadgetMethodA(IntuitionBase, (gad), (win), (req), (message))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __DoGadgetMethod(__reg("a6") void *, __reg("a0") struct Gadget * gad, __reg("a1") struct Window * win, __reg("a2") struct Requester * req, ULONG message, ...)="\tmove.l\ta3,-(a7)\n\tlea\t4(a7),a3\n\tjsr\t-810(a6)\n\tmovea.l\t(a7)+,a3";
#define DoGadgetMethod(gad, win, req, ...) __DoGadgetMethod(IntuitionBase, (gad), (win), (req), __VA_ARGS__)
#endif

VOID __SetWindowPointerA(__reg("a6") void *, __reg("a0") struct Window * win, __reg("a1") CONST struct TagItem * taglist)="\tjsr\t-816(a6)";
#define SetWindowPointerA(win, taglist) __SetWindowPointerA(IntuitionBase, (win), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
VOID __SetWindowPointer(__reg("a6") void *, __reg("a0") struct Window * win, ULONG taglist, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-816(a6)\n\tmovea.l\t(a7)+,a1";
#define SetWindowPointer(win, ...) __SetWindowPointer(IntuitionBase, (win), __VA_ARGS__)
#endif

BOOL __TimedDisplayAlert(__reg("a6") void *, __reg("d0") ULONG alertNumber, __reg("a0") CONST_STRPTR string, __reg("d1") ULONG height, __reg("a1") void * time)="\tjsr\t-822(a6)";
#define TimedDisplayAlert(alertNumber, string, height, time) __TimedDisplayAlert(IntuitionBase, (alertNumber), (string), (height), (void *)(time))

VOID __HelpControl(__reg("a6") void *, __reg("a0") struct Window * win, __reg("d0") ULONG flags)="\tjsr\t-828(a6)";
#define HelpControl(win, flags) __HelpControl(IntuitionBase, (win), (flags))

#endif /*  _VBCCINLINE_INTUITION_H  */
