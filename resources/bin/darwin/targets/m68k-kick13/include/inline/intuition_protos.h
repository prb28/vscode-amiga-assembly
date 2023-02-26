#ifndef _VBCCINLINE_INTUITION_H
#define _VBCCINLINE_INTUITION_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

void __OpenIntuition(__reg("a6") void *)="\tjsr\t-30(a6)";
#define OpenIntuition() __OpenIntuition(IntuitionBase)

void __Intuition(__reg("a6") void *, __reg("a0") void * ievent)="\tjsr\t-36(a6)";
#define Intuition(ievent) __Intuition(IntuitionBase, (void *)(ievent))

long __AddGadget(__reg("a6") void *, __reg("a0") struct Window * AddPtr, __reg("a1") struct Gadget * Gadget, __reg("d0") long Position)="\tjsr\t-42(a6)";
#define AddGadget(AddPtr, Gadget, Position) __AddGadget(IntuitionBase, (AddPtr), (Gadget), (Position))

long __ClearDMRequest(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-48(a6)";
#define ClearDMRequest(Window) __ClearDMRequest(IntuitionBase, (Window))

void __ClearMenuStrip(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-54(a6)";
#define ClearMenuStrip(Window) __ClearMenuStrip(IntuitionBase, (Window))

void __ClearPointer(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-60(a6)";
#define ClearPointer(Window) __ClearPointer(IntuitionBase, (Window))

void __CloseScreen(__reg("a6") void *, __reg("a0") struct Screen * Screen)="\tjsr\t-66(a6)";
#define CloseScreen(Screen) __CloseScreen(IntuitionBase, (Screen))

void __CloseWindow(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-72(a6)";
#define CloseWindow(Window) __CloseWindow(IntuitionBase, (Window))

long __CloseWorkBench(__reg("a6") void *)="\tjsr\t-78(a6)";
#define CloseWorkBench() __CloseWorkBench(IntuitionBase)

void __CurrentTime(__reg("a6") void *, __reg("a0") long * Seconds, __reg("a1") long * Micros)="\tjsr\t-84(a6)";
#define CurrentTime(Seconds, Micros) __CurrentTime(IntuitionBase, (Seconds), (Micros))

long __DisplayAlert(__reg("a6") void *, __reg("d0") long AlertNumber, __reg("a0") char * String, __reg("d1") long Height)="\tjsr\t-90(a6)";
#define DisplayAlert(AlertNumber, String, Height) __DisplayAlert(IntuitionBase, (AlertNumber), (String), (Height))

void __DisplayBeep(__reg("a6") void *, __reg("a0") struct Screen * Screen)="\tjsr\t-96(a6)";
#define DisplayBeep(Screen) __DisplayBeep(IntuitionBase, (Screen))

long __DoubleClick(__reg("a6") void *, __reg("d0") long sseconds, __reg("d1") long smicros, __reg("d2") long cseconds, __reg("d3") long cmicros)="\tjsr\t-102(a6)";
#define DoubleClick(sseconds, smicros, cseconds, cmicros) __DoubleClick(IntuitionBase, (sseconds), (smicros), (cseconds), (cmicros))

void __DrawBorder(__reg("a6") void *, __reg("a0") struct RastPort * RPort, __reg("a1") struct Border * Border, __reg("d0") long LeftOffset, __reg("d1") long TopOffset)="\tjsr\t-108(a6)";
#define DrawBorder(RPort, Border, LeftOffset, TopOffset) __DrawBorder(IntuitionBase, (RPort), (Border), (LeftOffset), (TopOffset))

void __DrawImage(__reg("a6") void *, __reg("a0") struct RastPort * RPort, __reg("a1") struct Image * Image, __reg("d0") long LeftOffset, __reg("d1") long TopOffset)="\tjsr\t-114(a6)";
#define DrawImage(RPort, Image, LeftOffset, TopOffset) __DrawImage(IntuitionBase, (RPort), (Image), (LeftOffset), (TopOffset))

void __EndRequest(__reg("a6") void *, __reg("a0") struct Requester * requester, __reg("a1") struct Window * window)="\tjsr\t-120(a6)";
#define EndRequest(requester, window) __EndRequest(IntuitionBase, (requester), (window))

struct Preferences * __GetDefPrefs(__reg("a6") void *, __reg("a0") struct Preferences * preferences, __reg("d0") long size)="\tjsr\t-126(a6)";
#define GetDefPrefs(preferences, size) __GetDefPrefs(IntuitionBase, (preferences), (size))

struct Preferences * __GetPrefs(__reg("a6") void *, __reg("a0") struct Preferences * preferences, __reg("d0") long size)="\tjsr\t-132(a6)";
#define GetPrefs(preferences, size) __GetPrefs(IntuitionBase, (preferences), (size))

void __InitRequester(__reg("a6") void *, __reg("a0") struct Requester * req)="\tjsr\t-138(a6)";
#define InitRequester(req) __InitRequester(IntuitionBase, (req))

struct MenuItem * __ItemAddress(__reg("a6") void *, __reg("a0") struct Menu * MenuStrip, __reg("d0") long MenuNumber)="\tjsr\t-144(a6)";
#define ItemAddress(MenuStrip, MenuNumber) __ItemAddress(IntuitionBase, (MenuStrip), (MenuNumber))

void __ModifyIDCMP(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("d0") long Flags)="\tjsr\t-150(a6)";
#define ModifyIDCMP(Window, Flags) __ModifyIDCMP(IntuitionBase, (Window), (Flags))

void __ModifyProp(__reg("a6") void *, __reg("a0") struct Gadget * Gadget, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req, __reg("d0") long Flags, __reg("d1") long HPos, __reg("d2") long VPos, __reg("d3") long HBody, __reg("d4") long VBody)="\tjsr\t-156(a6)";
#define ModifyProp(Gadget, Ptr, Req, Flags, HPos, VPos, HBody, VBody) __ModifyProp(IntuitionBase, (Gadget), (Ptr), (Req), (Flags), (HPos), (VPos), (HBody), (VBody))

void __MoveScreen(__reg("a6") void *, __reg("a0") struct Screen * Screen, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-162(a6)";
#define MoveScreen(Screen, dx, dy) __MoveScreen(IntuitionBase, (Screen), (dx), (dy))

void __MoveWindow(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-168(a6)";
#define MoveWindow(window, dx, dy) __MoveWindow(IntuitionBase, (window), (dx), (dy))

void __OffGadget(__reg("a6") void *, __reg("a0") struct Gadget * Gadget, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req)="\tjsr\t-174(a6)";
#define OffGadget(Gadget, Ptr, Req) __OffGadget(IntuitionBase, (Gadget), (Ptr), (Req))

void __OffMenu(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("d0") long MenuNumber)="\tjsr\t-180(a6)";
#define OffMenu(Window, MenuNumber) __OffMenu(IntuitionBase, (Window), (MenuNumber))

void __OnGadget(__reg("a6") void *, __reg("a0") struct Gadget * Gadget, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req)="\tjsr\t-186(a6)";
#define OnGadget(Gadget, Ptr, Req) __OnGadget(IntuitionBase, (Gadget), (Ptr), (Req))

void __OnMenu(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("d0") long MenuNumber)="\tjsr\t-192(a6)";
#define OnMenu(Window, MenuNumber) __OnMenu(IntuitionBase, (Window), (MenuNumber))

struct Screen * __OpenScreen(__reg("a6") void *, __reg("a0") struct NewScreen * OSargs)="\tjsr\t-198(a6)";
#define OpenScreen(OSargs) __OpenScreen(IntuitionBase, (OSargs))

struct Window * __OpenWindow(__reg("a6") void *, __reg("a0") struct NewWindow * OWargs)="\tjsr\t-204(a6)";
#define OpenWindow(OWargs) __OpenWindow(IntuitionBase, (OWargs))

long __OpenWorkBench(__reg("a6") void *)="\tjsr\t-210(a6)";
#define OpenWorkBench() __OpenWorkBench(IntuitionBase)

void __PrintIText(__reg("a6") void *, __reg("a0") struct RastPort * rp, __reg("a1") struct IntuiText * itext, __reg("d0") long left, __reg("d1") long top)="\tjsr\t-216(a6)";
#define PrintIText(rp, itext, left, top) __PrintIText(IntuitionBase, (rp), (itext), (left), (top))

void __RefreshGadgets(__reg("a6") void *, __reg("a0") struct Gadget * Gadgets, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req)="\tjsr\t-222(a6)";
#define RefreshGadgets(Gadgets, Ptr, Req) __RefreshGadgets(IntuitionBase, (Gadgets), (Ptr), (Req))

long __RemoveGadget(__reg("a6") void *, __reg("a0") struct Window * RemPtr, __reg("a1") struct Gadget * Gadget)="\tjsr\t-228(a6)";
#define RemoveGadget(RemPtr, Gadget) __RemoveGadget(IntuitionBase, (RemPtr), (Gadget))

void __ReportMouse(__reg("a6") void *, __reg("d0") struct Window * Boolean, __reg("a0") void * Window)="\tjsr\t-234(a6)";
#define ReportMouse(Boolean, Window) __ReportMouse(IntuitionBase, (Boolean), (void *)(Window))

long __Request(__reg("a6") void *, __reg("a0") struct Requester * Requester, __reg("a1") struct Window * Window)="\tjsr\t-240(a6)";
#define Request(Requester, Window) __Request(IntuitionBase, (Requester), (Window))

void __ScreenToBack(__reg("a6") void *, __reg("a0") struct Screen * Screen)="\tjsr\t-246(a6)";
#define ScreenToBack(Screen) __ScreenToBack(IntuitionBase, (Screen))

void __ScreenToFront(__reg("a6") void *, __reg("a0") struct Screen * Screen)="\tjsr\t-252(a6)";
#define ScreenToFront(Screen) __ScreenToFront(IntuitionBase, (Screen))

long __SetDMRequest(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("a1") struct Requester * req)="\tjsr\t-258(a6)";
#define SetDMRequest(Window, req) __SetDMRequest(IntuitionBase, (Window), (req))

void __SetMenuStrip(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("a1") struct Menu * Menu)="\tjsr\t-264(a6)";
#define SetMenuStrip(Window, Menu) __SetMenuStrip(IntuitionBase, (Window), (Menu))

void __SetPointer(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("a1") short * Pointer, __reg("d0") long Height, __reg("d1") long Width, __reg("d2") long Xoffset, __reg("d3") long Yoffset)="\tjsr\t-270(a6)";
#define SetPointer(Window, Pointer, Height, Width, Xoffset, Yoffset) __SetPointer(IntuitionBase, (Window), (Pointer), (Height), (Width), (Xoffset), (Yoffset))

void __SetWindowTitles(__reg("a6") void *, __reg("a0") struct Window * window, __reg("a1") char * windowtitle, __reg("a2") char * screentitle)="\tjsr\t-276(a6)";
#define SetWindowTitles(window, windowtitle, screentitle) __SetWindowTitles(IntuitionBase, (window), (windowtitle), (screentitle))

void __ShowTitle(__reg("a6") void *, __reg("a0") struct Screen * Screen, __reg("d0") long ShowIt)="\tjsr\t-282(a6)";
#define ShowTitle(Screen, ShowIt) __ShowTitle(IntuitionBase, (Screen), (ShowIt))

void __SizeWindow(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") long dx, __reg("d1") long dy)="\tjsr\t-288(a6)";
#define SizeWindow(window, dx, dy) __SizeWindow(IntuitionBase, (window), (dx), (dy))

struct View * __ViewAddress(__reg("a6") void *)="\tjsr\t-294(a6)";
#define ViewAddress() __ViewAddress(IntuitionBase)

struct ViewPort * __ViewPortAddress(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-300(a6)";
#define ViewPortAddress(window) __ViewPortAddress(IntuitionBase, (window))

void __WindowToBack(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-306(a6)";
#define WindowToBack(window) __WindowToBack(IntuitionBase, (window))

void __WindowToFront(__reg("a6") void *, __reg("a0") struct Window * window)="\tjsr\t-312(a6)";
#define WindowToFront(window) __WindowToFront(IntuitionBase, (window))

long __WindowLimits(__reg("a6") void *, __reg("a0") struct Window * window, __reg("d0") long minwidth, __reg("d1") long minheight, __reg("d2") long maxwidth, __reg("d3") long maxheight)="\tjsr\t-318(a6)";
#define WindowLimits(window, minwidth, minheight, maxwidth, maxheight) __WindowLimits(IntuitionBase, (window), (minwidth), (minheight), (maxwidth), (maxheight))

void __SetPrefs(__reg("a6") void *, __reg("a0") struct Preferences * preferences, __reg("d0") long size, __reg("d1") long flag)="\tjsr\t-324(a6)";
#define SetPrefs(preferences, size, flag) __SetPrefs(IntuitionBase, (preferences), (size), (flag))

long __IntuiTextLength(__reg("a6") void *, __reg("a0") struct IntuiText * itext)="\tjsr\t-330(a6)";
#define IntuiTextLength(itext) __IntuiTextLength(IntuitionBase, (itext))

long __WBenchToBack(__reg("a6") void *)="\tjsr\t-336(a6)";
#define WBenchToBack() __WBenchToBack(IntuitionBase)

long __WBenchToFront(__reg("a6") void *)="\tjsr\t-342(a6)";
#define WBenchToFront() __WBenchToFront(IntuitionBase)

long __AutoRequest(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("a1") struct IntuiText * Body, __reg("a2") struct IntuiText * PText, __reg("a3") struct IntuiText * NText, __reg("d0") long PFlag, __reg("d1") long NFlag, __reg("d2") long W, __reg("d3") long H)="\tjsr\t-348(a6)";
#define AutoRequest(Window, Body, PText, NText, PFlag, NFlag, W, H) __AutoRequest(IntuitionBase, (Window), (Body), (PText), (NText), (PFlag), (NFlag), (W), (H))

void __BeginRefresh(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-354(a6)";
#define BeginRefresh(Window) __BeginRefresh(IntuitionBase, (Window))

struct Window * __BuildSysRequest(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("a1") struct IntuiText * Body, __reg("a2") struct IntuiText * PosText, __reg("a3") struct IntuiText * NegText, __reg("d0") long Flags, __reg("d1") long W, __reg("d2") long H)="\tjsr\t-360(a6)";
#define BuildSysRequest(Window, Body, PosText, NegText, Flags, W, H) __BuildSysRequest(IntuitionBase, (Window), (Body), (PosText), (NegText), (Flags), (W), (H))

void __EndRefresh(__reg("a6") void *, __reg("a0") struct Window * Window, __reg("d0") long Complete)="\tjsr\t-366(a6)";
#define EndRefresh(Window, Complete) __EndRefresh(IntuitionBase, (Window), (Complete))

void __FreeSysRequest(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-372(a6)";
#define FreeSysRequest(Window) __FreeSysRequest(IntuitionBase, (Window))

void __MakeScreen(__reg("a6") void *, __reg("a0") struct Screen * Screen)="\tjsr\t-378(a6)";
#define MakeScreen(Screen) __MakeScreen(IntuitionBase, (Screen))

void __RemakeDisplay(__reg("a6") void *)="\tjsr\t-384(a6)";
#define RemakeDisplay() __RemakeDisplay(IntuitionBase)

void __RethinkDisplay(__reg("a6") void *)="\tjsr\t-390(a6)";
#define RethinkDisplay() __RethinkDisplay(IntuitionBase)

char * __AllocRemember(__reg("a6") void *, __reg("a0") struct Remember ** RememberKey, __reg("d0") long Size, __reg("d1") long Flags)="\tjsr\t-396(a6)";
#define AllocRemember(RememberKey, Size, Flags) __AllocRemember(IntuitionBase, (RememberKey), (Size), (Flags))

void __AlohaWorkbench(__reg("a6") void *, __reg("a0") void * wbport)="\tjsr\t-402(a6)";
#define AlohaWorkbench(wbport) __AlohaWorkbench(IntuitionBase, (void *)(wbport))

void __FreeRemember(__reg("a6") void *, __reg("a0") struct Remember ** RememberKey, __reg("d0") long ReallyForget)="\tjsr\t-408(a6)";
#define FreeRemember(RememberKey, ReallyForget) __FreeRemember(IntuitionBase, (RememberKey), (ReallyForget))

long __LockIBase(__reg("a6") void *, __reg("d0") long dontknow)="\tjsr\t-414(a6)";
#define LockIBase(dontknow) __LockIBase(IntuitionBase, (dontknow))

void __UnlockIBase(__reg("a6") void *, __reg("a0") void * IBLock)="\tjsr\t-420(a6)";
#define UnlockIBase(IBLock) __UnlockIBase(IntuitionBase, (void *)(IBLock))

long __GetScreenData(__reg("a6") void *, __reg("a0") char * buffer, __reg("d0") long size, __reg("d1") long type, __reg("a1") struct Screen * screen)="\tjsr\t-426(a6)";
#define GetScreenData(buffer, size, type, screen) __GetScreenData(IntuitionBase, (buffer), (size), (type), (screen))

void __RefreshGList(__reg("a6") void *, __reg("a0") struct Gadget * Gadgets, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req, __reg("d0") long NumGad)="\tjsr\t-432(a6)";
#define RefreshGList(Gadgets, Ptr, Req, NumGad) __RefreshGList(IntuitionBase, (Gadgets), (Ptr), (Req), (NumGad))

long __AddGList(__reg("a6") void *, __reg("a0") struct Window * AddPtr, __reg("a1") struct Gadget * Gadget, __reg("d0") long Position, __reg("d1") long NumGad, __reg("a2") struct Requester * Requester)="\tjsr\t-438(a6)";
#define AddGList(AddPtr, Gadget, Position, NumGad, Requester) __AddGList(IntuitionBase, (AddPtr), (Gadget), (Position), (NumGad), (Requester))

long __RemoveGList(__reg("a6") void *, __reg("a0") struct Window * RemPtr, __reg("a1") struct Gadget * Gadget, __reg("d0") long NumGad)="\tjsr\t-444(a6)";
#define RemoveGList(RemPtr, Gadget, NumGad) __RemoveGList(IntuitionBase, (RemPtr), (Gadget), (NumGad))

void __ActivateWindow(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-450(a6)";
#define ActivateWindow(Window) __ActivateWindow(IntuitionBase, (Window))

void __RefreshWindowFrame(__reg("a6") void *, __reg("a0") struct Window * Window)="\tjsr\t-456(a6)";
#define RefreshWindowFrame(Window) __RefreshWindowFrame(IntuitionBase, (Window))

long __ActivateGadget(__reg("a6") void *, __reg("a0") struct Gadget * Gadgets, __reg("a1") struct Window * Window, __reg("a2") struct Requester * Req)="\tjsr\t-462(a6)";
#define ActivateGadget(Gadgets, Window, Req) __ActivateGadget(IntuitionBase, (Gadgets), (Window), (Req))

void __NewModifyProp(__reg("a6") void *, __reg("a0") struct Gadget * Gadget, __reg("a1") struct Window * Ptr, __reg("a2") struct Requester * Req, __reg("d0") long Flags, __reg("d1") long HPos, __reg("d2") long VPos, __reg("d3") long HBody, __reg("d4") long VBody, __reg("d5") long NumGad)="\tjsr\t-468(a6)";
#define NewModifyProp(Gadget, Ptr, Req, Flags, HPos, VPos, HBody, VBody, NumGad) __NewModifyProp(IntuitionBase, (Gadget), (Ptr), (Req), (Flags), (HPos), (VPos), (HBody), (VBody), (NumGad))

#endif /*  _VBCCINLINE_INTUITION_H  */
