#ifndef _VBCCINLINE_AHI_SUB_H
#define _VBCCINLINE_AHI_SUB_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

ULONG __AHIsub_AllocAudio(__reg("a6") void *, __reg("a1") struct TagItem * tagList, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-30(a6)";
#define AHIsub_AllocAudio(tagList, AudioCtrl) __AHIsub_AllocAudio(AHIsubBase, (tagList), (AudioCtrl))

void __AHIsub_FreeAudio(__reg("a6") void *, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-36(a6)";
#define AHIsub_FreeAudio(AudioCtrl) __AHIsub_FreeAudio(AHIsubBase, (AudioCtrl))

void __AHIsub_Disable(__reg("a6") void *, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-42(a6)";
#define AHIsub_Disable(AudioCtrl) __AHIsub_Disable(AHIsubBase, (AudioCtrl))

void __AHIsub_Enable(__reg("a6") void *, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-48(a6)";
#define AHIsub_Enable(AudioCtrl) __AHIsub_Enable(AHIsubBase, (AudioCtrl))

ULONG __AHIsub_Start(__reg("a6") void *, __reg("d0") ULONG Flags, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-54(a6)";
#define AHIsub_Start(Flags, AudioCtrl) __AHIsub_Start(AHIsubBase, (Flags), (AudioCtrl))

ULONG __AHIsub_Update(__reg("a6") void *, __reg("d0") ULONG Flags, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-60(a6)";
#define AHIsub_Update(Flags, AudioCtrl) __AHIsub_Update(AHIsubBase, (Flags), (AudioCtrl))

ULONG __AHIsub_Stop(__reg("a6") void *, __reg("d0") ULONG Flags, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-66(a6)";
#define AHIsub_Stop(Flags, AudioCtrl) __AHIsub_Stop(AHIsubBase, (Flags), (AudioCtrl))

ULONG __AHIsub_SetVol(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") Fixed Volume, __reg("d2") sposition Pan, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl, __reg("d3") ULONG Flags)="\tjsr\t-72(a6)";
#define AHIsub_SetVol(Channel, Volume, Pan, AudioCtrl, Flags) __AHIsub_SetVol(AHIsubBase, (Channel), (Volume), (Pan), (AudioCtrl), (Flags))

ULONG __AHIsub_SetFreq(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") ULONG Freq, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl, __reg("d2") ULONG Flags)="\tjsr\t-78(a6)";
#define AHIsub_SetFreq(Channel, Freq, AudioCtrl, Flags) __AHIsub_SetFreq(AHIsubBase, (Channel), (Freq), (AudioCtrl), (Flags))

ULONG __AHIsub_SetSound(__reg("a6") void *, __reg("d0") UWORD Channel, __reg("d1") UWORD Sound, __reg("d2") ULONG Offset, __reg("d3") LONG Length, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl, __reg("d4") ULONG Flags)="\tjsr\t-84(a6)";
#define AHIsub_SetSound(Channel, Sound, Offset, Length, AudioCtrl, Flags) __AHIsub_SetSound(AHIsubBase, (Channel), (Sound), (Offset), (Length), (AudioCtrl), (Flags))

ULONG __AHIsub_SetEffect(__reg("a6") void *, __reg("a0") APTR Effect, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-90(a6)";
#define AHIsub_SetEffect(Effect, AudioCtrl) __AHIsub_SetEffect(AHIsubBase, (Effect), (AudioCtrl))

ULONG __AHIsub_LoadSound(__reg("a6") void *, __reg("d0") UWORD Sound, __reg("d1") ULONG Type, __reg("a0") APTR Info, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-96(a6)";
#define AHIsub_LoadSound(Sound, Type, Info, AudioCtrl) __AHIsub_LoadSound(AHIsubBase, (Sound), (Type), (Info), (AudioCtrl))

ULONG __AHIsub_UnloadSound(__reg("a6") void *, __reg("d0") UWORD Sound, __reg("a2") struct AHIAudioCtrlDrv * Audioctrl)="\tjsr\t-102(a6)";
#define AHIsub_UnloadSound(Sound, Audioctrl) __AHIsub_UnloadSound(AHIsubBase, (Sound), (Audioctrl))

LONG __AHIsub_GetAttr(__reg("a6") void *, __reg("d0") ULONG Attribute, __reg("d1") LONG Argument, __reg("d2") LONG d2arg, __reg("a1") struct TagItem * tagList, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-108(a6)";
#define AHIsub_GetAttr(Attribute, Argument, d2arg, tagList, AudioCtrl) __AHIsub_GetAttr(AHIsubBase, (Attribute), (Argument), (d2arg), (tagList), (AudioCtrl))

LONG __AHIsub_HardwareControl(__reg("a6") void *, __reg("d0") ULONG Attribute, __reg("d1") LONG Argument, __reg("a2") struct AHIAudioCtrlDrv * AudioCtrl)="\tjsr\t-114(a6)";
#define AHIsub_HardwareControl(Attribute, Argument, AudioCtrl) __AHIsub_HardwareControl(AHIsubBase, (Attribute), (Argument), (AudioCtrl))

#endif /*  _VBCCINLINE_AHI_SUB_H  */
