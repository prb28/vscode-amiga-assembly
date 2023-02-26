#ifndef _VBCCINLINE_CLIST_H
#define _VBCCINLINE_CLIST_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

long __InitCLPool(__reg("a6") void *, __reg("a0") void * cLPool, __reg("d0") long size)="\tjsr\t-30(a6)";
#define InitCLPool(cLPool, size) __InitCLPool(ClistBase, (void *)(cLPool), (size))

long __AllocCList(__reg("a6") void *, __reg("a1") void * cLPool)="\tjsr\t-36(a6)";
#define AllocCList(cLPool) __AllocCList(ClistBase, (void *)(cLPool))

void __FreeCList(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-42(a6)";
#define FreeCList(cList) __FreeCList(ClistBase, (void *)(cList))

void __FlushCList(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-48(a6)";
#define FlushCList(cList) __FlushCList(ClistBase, (void *)(cList))

long __SizeCList(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-54(a6)";
#define SizeCList(cList) __SizeCList(ClistBase, (void *)(cList))

long __PutCLChar(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long byte)="\tjsr\t-60(a6)";
#define PutCLChar(cList, byte) __PutCLChar(ClistBase, (void *)(cList), (byte))

long __GetCLChar(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-66(a6)";
#define GetCLChar(cList) __GetCLChar(ClistBase, (void *)(cList))

long __UnGetCLChar(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long byte)="\tjsr\t-72(a6)";
#define UnGetCLChar(cList, byte) __UnGetCLChar(ClistBase, (void *)(cList), (byte))

long __UnPutCLChar(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-78(a6)";
#define UnPutCLChar(cList) __UnPutCLChar(ClistBase, (void *)(cList))

long __PutCLWord(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long word)="\tjsr\t-84(a6)";
#define PutCLWord(cList, word) __PutCLWord(ClistBase, (void *)(cList), (word))

long __GetCLWord(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-90(a6)";
#define GetCLWord(cList) __GetCLWord(ClistBase, (void *)(cList))

long __UnGetCLWord(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long word)="\tjsr\t-96(a6)";
#define UnGetCLWord(cList, word) __UnGetCLWord(ClistBase, (void *)(cList), (word))

long __UnPutCLWord(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-102(a6)";
#define UnPutCLWord(cList) __UnPutCLWord(ClistBase, (void *)(cList))

long __PutCLBuf(__reg("a6") void *, __reg("a0") void * cList, __reg("a1") char * buffer, __reg("d1") long length)="\tjsr\t-108(a6)";
#define PutCLBuf(cList, buffer, length) __PutCLBuf(ClistBase, (void *)(cList), (buffer), (length))

long __GetCLBuf(__reg("a6") void *, __reg("a0") void * cList, __reg("a1") char * buffer, __reg("d1") long maxLength)="\tjsr\t-114(a6)";
#define GetCLBuf(cList, buffer, maxLength) __GetCLBuf(ClistBase, (void *)(cList), (buffer), (maxLength))

long __MarkCList(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long offset)="\tjsr\t-120(a6)";
#define MarkCList(cList, offset) __MarkCList(ClistBase, (void *)(cList), (offset))

long __IncrCLMark(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-126(a6)";
#define IncrCLMark(cList) __IncrCLMark(ClistBase, (void *)(cList))

long __PeekCLMark(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-132(a6)";
#define PeekCLMark(cList) __PeekCLMark(ClistBase, (void *)(cList))

long __SplitCList(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-138(a6)";
#define SplitCList(cList) __SplitCList(ClistBase, (void *)(cList))

long __CopyCList(__reg("a6") void *, __reg("a0") void * cList)="\tjsr\t-144(a6)";
#define CopyCList(cList) __CopyCList(ClistBase, (void *)(cList))

long __SubCList(__reg("a6") void *, __reg("a0") void * cList, __reg("d0") long index, __reg("d1") long length)="\tjsr\t-150(a6)";
#define SubCList(cList, index, length) __SubCList(ClistBase, (void *)(cList), (index), (length))

#endif /*  _VBCCINLINE_CLIST_H  */
