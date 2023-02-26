#ifndef _VBCCINLINE_AHI_H
#define _VBCCINLINE_AHI_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct AHIAudioCtrl * __AHI_AllocAudioA(__reg("a6") void *, __reg("a1") struct TagItem * tagList)="\tjsr\t-42(a6)";
#define AHI_AllocAudioA(tagList) __AHI_AllocAudioA(AHIBase, (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct AHIAudioCtrl * __AHI_AllocAudio(__reg("a6") void *, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-42(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_AllocAudio(...) __AHI_AllocAudio(AHIBase, __VA_ARGS__)
#endif

void __AHI_FreeAudio(__reg("a6") void *, __reg("a2") struct AHIAudioCtrl * AudioCtrl)="\tjsr\t-48(a6)";
#define AHI_FreeAudio(AudioCtrl) __AHI_FreeAudio(AHIBase, (AudioCtrl))

void __AHI_KillAudio(__reg("a6") void *)="\tjsr\t-54(a6)";
#define AHI_KillAudio() __AHI_KillAudio(AHIBase)

ULONG __AHI_ControlAudioA(__reg("a6") void *, __reg("a2") struct AHIAudioCtrl * AudioCtrl, __reg("a1") struct TagItem * tagList)="\tjsr\t-60(a6)";
#define AHI_ControlAudioA(AudioCtrl, tagList) __AHI_ControlAudioA(AHIBase, (AudioCtrl), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __AHI_ControlAudio(__reg("a6") void *, __reg("a2") struct AHIAudioCtrl * AudioCtrl, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-60(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_ControlAudio(AudioCtrl, ...) __AHI_ControlAudio(AHIBase, (AudioCtrl), __VA_ARGS__)
#endif

void __AHI_SetVol(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") Fixed Volume, __reg("d2") sposition Pan, __reg("a2") struct AHIAudioCtrl * AudioCtrl, __reg("d3") ULONG Flags)="\tjsr\t-66(a6)";
#define AHI_SetVol(Channel, Volume, Pan, AudioCtrl, Flags) __AHI_SetVol(AHIBase, (Channel), (Volume), (Pan), (AudioCtrl), (Flags))

void __AHI_SetFreq(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") ULONG Freq, __reg("a2") struct AHIAudioCtrl * AudioCtrl, __reg("d2") ULONG Flags)="\tjsr\t-72(a6)";
#define AHI_SetFreq(Channel, Freq, AudioCtrl, Flags) __AHI_SetFreq(AHIBase, (Channel), (Freq), (AudioCtrl), (Flags))

void __AHI_SetSound(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") UWORD Sound, __reg("d2") ULONG Offset, __reg("d3") LONG Length, __reg("a2") struct AHIAudioCtrl * AudioCtrl, __reg("d4") ULONG Flags)="\tjsr\t-78(a6)";
#define AHI_SetSound(Channel, Sound, Offset, Length, AudioCtrl, Flags) __AHI_SetSound(AHIBase, (Channel), (Sound), (Offset), (Length), (AudioCtrl), (Flags))

ULONG __AHI_SetEffect(__reg("a6") void *, __reg("a0") APTR Effect, __reg("a2") struct AHIAudioCtrl * AudioCtrl)="\tjsr\t-84(a6)";
#define AHI_SetEffect(Effect, AudioCtrl) __AHI_SetEffect(AHIBase, (Effect), (AudioCtrl))

ULONG __AHI_LoadSound(__reg("a6") void *, __reg("d0") UWORD Sound, __reg("d1") ULONG Type, __reg("a0") APTR Info, __reg("a2") struct AHIAudioCtrl * AudioCtrl)="\tjsr\t-90(a6)";
#define AHI_LoadSound(Sound, Type, Info, AudioCtrl) __AHI_LoadSound(AHIBase, (Sound), (Type), (Info), (AudioCtrl))

void __AHI_UnloadSound(__reg("a6") void *, __reg("d0") UWORD Sound, __reg("a2") struct AHIAudioCtrl * Audioctrl)="\tjsr\t-96(a6)";
#define AHI_UnloadSound(Sound, Audioctrl) __AHI_UnloadSound(AHIBase, (Sound), (Audioctrl))

ULONG __AHI_NextAudioID(__reg("a6") void *, __reg("d0") ULONG Last_ID)="\tjsr\t-102(a6)";
#define AHI_NextAudioID(Last_ID) __AHI_NextAudioID(AHIBase, (Last_ID))

BOOL __AHI_GetAudioAttrsA(__reg("a6") void *, __reg("d0") ULONG ID, __reg("a2") struct AHIAudioCtrl * Audioctrl, __reg("a1") struct TagItem * tagList)="\tjsr\t-108(a6)";
#define AHI_GetAudioAttrsA(ID, Audioctrl, tagList) __AHI_GetAudioAttrsA(AHIBase, (ID), (Audioctrl), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __AHI_GetAudioAttrs(__reg("a6") void *, __reg("d0") ULONG ID, __reg("a2") struct AHIAudioCtrl * Audioctrl, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-108(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_GetAudioAttrs(ID, Audioctrl, ...) __AHI_GetAudioAttrs(AHIBase, (ID), (Audioctrl), __VA_ARGS__)
#endif

ULONG __AHI_BestAudioIDA(__reg("a6") void *, __reg("a1") struct TagItem * tagList)="\tjsr\t-114(a6)";
#define AHI_BestAudioIDA(tagList) __AHI_BestAudioIDA(AHIBase, (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __AHI_BestAudioID(__reg("a6") void *, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-114(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_BestAudioID(...) __AHI_BestAudioID(AHIBase, __VA_ARGS__)
#endif

struct AHIAudioModeRequester * __AHI_AllocAudioRequestA(__reg("a6") void *, __reg("a0") struct TagItem * tagList)="\tjsr\t-120(a6)";
#define AHI_AllocAudioRequestA(tagList) __AHI_AllocAudioRequestA(AHIBase, (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct AHIAudioModeRequester * __AHI_AllocAudioRequest(__reg("a6") void *, Tag tagList, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-120(a6)\n\tmovea.l\t(a7)+,a0";
#define AHI_AllocAudioRequest(...) __AHI_AllocAudioRequest(AHIBase, __VA_ARGS__)
#endif

BOOL __AHI_AudioRequestA(__reg("a6") void *, __reg("a0") struct AHIAudioModeRequester * Requester, __reg("a1") struct TagItem * tagList)="\tjsr\t-126(a6)";
#define AHI_AudioRequestA(Requester, tagList) __AHI_AudioRequestA(AHIBase, (Requester), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __AHI_AudioRequest(__reg("a6") void *, __reg("a0") struct AHIAudioModeRequester * Requester, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-126(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_AudioRequest(Requester, ...) __AHI_AudioRequest(AHIBase, (Requester), __VA_ARGS__)
#endif

void __AHI_FreeAudioRequest(__reg("a6") void *, __reg("a0") struct AHIAudioModeRequester * Requester)="\tjsr\t-132(a6)";
#define AHI_FreeAudioRequest(Requester) __AHI_FreeAudioRequest(AHIBase, (Requester))

void __AHI_PlayA(__reg("a6") void *, __reg("a2") struct AHIAudioCtrl * Audioctrl, __reg("a1") struct TagItem * tagList)="\tjsr\t-138(a6)";
#define AHI_PlayA(Audioctrl, tagList) __AHI_PlayA(AHIBase, (Audioctrl), (tagList))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __AHI_Play(__reg("a6") void *, __reg("a2") struct AHIAudioCtrl * Audioctrl, Tag tagList, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-138(a6)\n\tmovea.l\t(a7)+,a1";
#define AHI_Play(Audioctrl, ...) __AHI_Play(AHIBase, (Audioctrl), __VA_ARGS__)
#endif

ULONG __AHI_SampleFrameSize(__reg("a6") void *, __reg("d0") ULONG SampleType)="\tjsr\t-144(a6)";
#define AHI_SampleFrameSize(SampleType) __AHI_SampleFrameSize(AHIBase, (SampleType))

ULONG __AHI_AddAudioMode(__reg("a6") void *, __reg("a0") struct TagItem * a0arg)="\tjsr\t-150(a6)";
#define AHI_AddAudioMode(a0arg) __AHI_AddAudioMode(AHIBase, (a0arg))

ULONG __AHI_RemoveAudioMode(__reg("a6") void *, __reg("d0") ULONG d0arg)="\tjsr\t-156(a6)";
#define AHI_RemoveAudioMode(d0arg) __AHI_RemoveAudioMode(AHIBase, (d0arg))

ULONG __AHI_LoadModeFile(__reg("a6") void *, __reg("a0") STRPTR a0arg)="\tjsr\t-162(a6)";
#define AHI_LoadModeFile(a0arg) __AHI_LoadModeFile(AHIBase, (a0arg))

#endif /*  _VBCCINLINE_AHI_H  */
