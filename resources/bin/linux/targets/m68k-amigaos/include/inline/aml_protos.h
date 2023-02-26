#ifndef _VBCCINLINE_AML_H
#define _VBCCINLINE_AML_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __RexxDispatcher(__reg("a6") void *, __reg("a0") struct RexxMsg * rxm)="\tjsr\t-30(a6)";
#define RexxDispatcher(rxm) __RexxDispatcher(AmlBase, (rxm))

APTR __CreateServerA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-36(a6)";
#define CreateServerA(tags) __CreateServerA(AmlBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateServer(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-36(a6)\n\tmovea.l\t(a7)+,a0";
#define CreateServer(...) __CreateServer(AmlBase, __VA_ARGS__)
#endif

VOID __DisposeServer(__reg("a6") void *, __reg("a0") APTR server)="\tjsr\t-42(a6)";
#define DisposeServer(server) __DisposeServer(AmlBase, (server))

ULONG __SetServerAttrsA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-48(a6)";
#define SetServerAttrsA(server, tags) __SetServerAttrsA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetServerAttrs(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-48(a6)\n\tmovea.l\t(a7)+,a1";
#define SetServerAttrs(...) __SetServerAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __GetServerAttrsA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-54(a6)";
#define GetServerAttrsA(server, tags) __GetServerAttrsA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetServerAttrs(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-54(a6)\n\tmovea.l\t(a7)+,a1";
#define GetServerAttrs(...) __GetServerAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __GetServerHeaders(__reg("a6") void *, __reg("a0") APTR server, __reg("d0") ULONG flags)="\tjsr\t-60(a6)";
#define GetServerHeaders(server, flags) __GetServerHeaders(AmlBase, (server), (flags))

LONG __GetServerArticles(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") APTR folder, __reg("a2") struct Hook * hook, __reg("d0") ULONG flags)="\tjsr\t-66(a6)";
#define GetServerArticles(server, folder, hook, flags) __GetServerArticles(AmlBase, (server), (folder), (hook), (flags))

APTR __CreateFolderA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-72(a6)";
#define CreateFolderA(server, tags) __CreateFolderA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateFolder(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-72(a6)\n\tmovea.l\t(a7)+,a1";
#define CreateFolder(...) __CreateFolder(AmlBase, __VA_ARGS__)
#endif

BOOL __DisposeFolder(__reg("a6") void *, __reg("a0") APTR folder)="\tjsr\t-78(a6)";
#define DisposeFolder(folder) __DisposeFolder(AmlBase, (folder))

APTR __OpenFolderA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-84(a6)";
#define OpenFolderA(server, tags) __OpenFolderA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __OpenFolder(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-84(a6)\n\tmovea.l\t(a7)+,a1";
#define OpenFolder(...) __OpenFolder(AmlBase, __VA_ARGS__)
#endif

BOOL __SaveFolder(__reg("a6") void *, __reg("a0") APTR folder)="\tjsr\t-90(a6)";
#define SaveFolder(folder) __SaveFolder(AmlBase, (folder))

BOOL __RemFolder(__reg("a6") void *, __reg("a0") APTR folder)="\tjsr\t-96(a6)";
#define RemFolder(folder) __RemFolder(AmlBase, (folder))

ULONG __SetFolderAttrsA(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") struct TagItem * tags)="\tjsr\t-102(a6)";
#define SetFolderAttrsA(folder, tags) __SetFolderAttrsA(AmlBase, (folder), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetFolderAttrs(__reg("a6") void *, __reg("a0") APTR folder, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-102(a6)\n\tmovea.l\t(a7)+,a1";
#define SetFolderAttrs(...) __SetFolderAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __GetFolderAttrsA(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") struct TagItem * tags)="\tjsr\t-108(a6)";
#define GetFolderAttrsA(folder, tags) __GetFolderAttrsA(AmlBase, (folder), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetFolderAttrs(__reg("a6") void *, __reg("a0") APTR folder, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-108(a6)\n\tmovea.l\t(a7)+,a1";
#define GetFolderAttrs(...) __GetFolderAttrs(AmlBase, __VA_ARGS__)
#endif

BOOL __AddFolderArticle(__reg("a6") void *, __reg("a0") APTR folder, __reg("d0") ULONG type, __reg("a1") APTR data)="\tjsr\t-114(a6)";
#define AddFolderArticle(folder, type, data) __AddFolderArticle(AmlBase, (folder), (type), (data))

BOOL __RemFolderArticle(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") APTR article)="\tjsr\t-120(a6)";
#define RemFolderArticle(folder, article) __RemFolderArticle(AmlBase, (folder), (article))

ULONG __ReadFolderSpool(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") STRPTR importfile, __reg("d0") ULONG flags)="\tjsr\t-126(a6)";
#define ReadFolderSpool(folder, importfile, flags) __ReadFolderSpool(AmlBase, (folder), (importfile), (flags))

ULONG __WriteFolderSpool(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") STRPTR exportfile, __reg("d0") ULONG flags)="\tjsr\t-132(a6)";
#define WriteFolderSpool(folder, exportfile, flags) __WriteFolderSpool(AmlBase, (folder), (exportfile), (flags))

ULONG __ScanFolderIndex(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") struct Hook * hook, __reg("d0") ULONG flags)="\tjsr\t-138(a6)";
#define ScanFolderIndex(folder, hook, flags) __ScanFolderIndex(AmlBase, (folder), (hook), (flags))

BOOL __ExpungeFolder(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") APTR trash, __reg("a2") struct Hook * hook)="\tjsr\t-144(a6)";
#define ExpungeFolder(folder, trash, hook) __ExpungeFolder(AmlBase, (folder), (trash), (hook))

ULONG __CreateFolderIndex(__reg("a6") void *, __reg("a0") APTR folder)="\tjsr\t-150(a6)";
#define CreateFolderIndex(folder) __CreateFolderIndex(AmlBase, (folder))

ULONG __SortFolderIndex(__reg("a6") void *, __reg("a0") APTR folder, __reg("d0") ULONG field)="\tjsr\t-156(a6)";
#define SortFolderIndex(folder, field) __SortFolderIndex(AmlBase, (folder), (field))

APTR __CreateArticleA(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") struct TagItem * tags)="\tjsr\t-162(a6)";
#define CreateArticleA(folder, tags) __CreateArticleA(AmlBase, (folder), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateArticle(__reg("a6") void *, __reg("a0") APTR folder, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-162(a6)\n\tmovea.l\t(a7)+,a1";
#define CreateArticle(...) __CreateArticle(AmlBase, __VA_ARGS__)
#endif

BOOL __DisposeArticle(__reg("a6") void *, __reg("a0") APTR article)="\tjsr\t-168(a6)";
#define DisposeArticle(article) __DisposeArticle(AmlBase, (article))

APTR __OpenArticle(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") APTR folder, __reg("d0") ULONG msgID, __reg("d1") ULONG flags)="\tjsr\t-174(a6)";
#define OpenArticle(server, folder, msgID, flags) __OpenArticle(AmlBase, (server), (folder), (msgID), (flags))

BOOL __CopyArticle(__reg("a6") void *, __reg("a0") APTR folder, __reg("a1") APTR article)="\tjsr\t-180(a6)";
#define CopyArticle(folder, article) __CopyArticle(AmlBase, (folder), (article))

ULONG __SetArticleAttrsA(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") struct TagItem * tags)="\tjsr\t-186(a6)";
#define SetArticleAttrsA(article, tags) __SetArticleAttrsA(AmlBase, (article), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetArticleAttrs(__reg("a6") void *, __reg("a0") APTR article, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-186(a6)\n\tmovea.l\t(a7)+,a1";
#define SetArticleAttrs(...) __SetArticleAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __GetArticleAttrsA(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") struct TagItem * tags)="\tjsr\t-192(a6)";
#define GetArticleAttrsA(article, tags) __GetArticleAttrsA(AmlBase, (article), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetArticleAttrs(__reg("a6") void *, __reg("a0") APTR article, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-192(a6)\n\tmovea.l\t(a7)+,a1";
#define GetArticleAttrs(...) __GetArticleAttrs(AmlBase, __VA_ARGS__)
#endif

BOOL __SendArticle(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") APTR article, __reg("a2") UBYTE * from_file)="\tjsr\t-198(a6)";
#define SendArticle(server, article, from_file) __SendArticle(AmlBase, (server), (article), (from_file))

BOOL __AddArticlePartA(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") APTR part, __reg("a2") struct TagItem * tags)="\tjsr\t-204(a6)";
#define AddArticlePartA(article, part, tags) __AddArticlePartA(AmlBase, (article), (part), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __AddArticlePart(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") APTR part, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-204(a6)\n\tmovea.l\t(a7)+,a2";
#define AddArticlePart(article, ...) __AddArticlePart(AmlBase, (article), __VA_ARGS__)
#endif

VOID __RemArticlePart(__reg("a6") void *, __reg("a0") APTR article, __reg("d0") APTR part)="\tjsr\t-210(a6)";
#define RemArticlePart(article, part) __RemArticlePart(AmlBase, (article), (part))

APTR __GetArticlePart(__reg("a6") void *, __reg("a0") APTR article, __reg("d0") ULONG partnum)="\tjsr\t-216(a6)";
#define GetArticlePart(article, partnum) __GetArticlePart(AmlBase, (article), (partnum))

ULONG __GetArticlePartAttrsA(__reg("a6") void *, __reg("a0") APTR part, __reg("a1") struct TagItem * tags)="\tjsr\t-222(a6)";
#define GetArticlePartAttrsA(part, tags) __GetArticlePartAttrsA(AmlBase, (part), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetArticlePartAttrs(__reg("a6") void *, __reg("a0") APTR part, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-222(a6)\n\tmovea.l\t(a7)+,a1";
#define GetArticlePartAttrs(...) __GetArticlePartAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __SetArticlePartAttrsA(__reg("a6") void *, __reg("a0") APTR part, __reg("a1") struct TagItem * tags)="\tjsr\t-228(a6)";
#define SetArticlePartAttrsA(part, tags) __SetArticlePartAttrsA(AmlBase, (part), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetArticlePartAttrs(__reg("a6") void *, __reg("a0") APTR part, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-228(a6)\n\tmovea.l\t(a7)+,a1";
#define SetArticlePartAttrs(...) __SetArticlePartAttrs(AmlBase, __VA_ARGS__)
#endif

APTR __CreateArticlePartA(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") struct TagItem * tags)="\tjsr\t-234(a6)";
#define CreateArticlePartA(article, tags) __CreateArticlePartA(AmlBase, (article), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateArticlePart(__reg("a6") void *, __reg("a0") APTR article, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-234(a6)\n\tmovea.l\t(a7)+,a1";
#define CreateArticlePart(...) __CreateArticlePart(AmlBase, __VA_ARGS__)
#endif

VOID __DisposeArticlePart(__reg("a6") void *, __reg("a0") APTR part)="\tjsr\t-240(a6)";
#define DisposeArticlePart(part) __DisposeArticlePart(AmlBase, (part))

BOOL __GetArticlePartDataA(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") APTR part, __reg("a2") struct TagItem * tags)="\tjsr\t-246(a6)";
#define GetArticlePartDataA(article, part, tags) __GetArticlePartDataA(AmlBase, (article), (part), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __GetArticlePartData(__reg("a6") void *, __reg("a0") APTR article, __reg("a1") APTR part, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-246(a6)\n\tmovea.l\t(a7)+,a2";
#define GetArticlePartData(article, ...) __GetArticlePartData(AmlBase, (article), __VA_ARGS__)
#endif

BOOL __SetArticlePartDataA(__reg("a6") void *, __reg("a0") APTR part, __reg("a1") struct TagItem * tags)="\tjsr\t-252(a6)";
#define SetArticlePartDataA(part, tags) __SetArticlePartDataA(AmlBase, (part), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __SetArticlePartData(__reg("a6") void *, __reg("a0") APTR part, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-252(a6)\n\tmovea.l\t(a7)+,a1";
#define SetArticlePartData(...) __SetArticlePartData(AmlBase, __VA_ARGS__)
#endif

APTR __CreateAddressEntryA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-258(a6)";
#define CreateAddressEntryA(tags) __CreateAddressEntryA(AmlBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateAddressEntry(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-258(a6)\n\tmovea.l\t(a7)+,a0";
#define CreateAddressEntry(...) __CreateAddressEntry(AmlBase, __VA_ARGS__)
#endif

BOOL __DisposeAddressEntry(__reg("a6") void *, __reg("a0") APTR addr)="\tjsr\t-264(a6)";
#define DisposeAddressEntry(addr) __DisposeAddressEntry(AmlBase, (addr))

APTR __OpenAddressEntry(__reg("a6") void *, __reg("a0") APTR server, __reg("d0") ULONG fileid)="\tjsr\t-270(a6)";
#define OpenAddressEntry(server, fileid) __OpenAddressEntry(AmlBase, (server), (fileid))

LONG __SaveAddressEntry(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") APTR addr)="\tjsr\t-276(a6)";
#define SaveAddressEntry(server, addr) __SaveAddressEntry(AmlBase, (server), (addr))

BOOL __RemAddressEntry(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") APTR addr)="\tjsr\t-282(a6)";
#define RemAddressEntry(server, addr) __RemAddressEntry(AmlBase, (server), (addr))

ULONG __GetAddressEntryAttrsA(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") struct TagItem * tags)="\tjsr\t-288(a6)";
#define GetAddressEntryAttrsA(addr, tags) __GetAddressEntryAttrsA(AmlBase, (addr), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetAddressEntryAttrs(__reg("a6") void *, __reg("a0") APTR addr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-288(a6)\n\tmovea.l\t(a7)+,a1";
#define GetAddressEntryAttrs(...) __GetAddressEntryAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __SetAddressEntryAttrsA(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") struct TagItem * tags)="\tjsr\t-294(a6)";
#define SetAddressEntryAttrsA(addr, tags) __SetAddressEntryAttrsA(AmlBase, (addr), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetAddressEntryAttrs(__reg("a6") void *, __reg("a0") APTR addr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-294(a6)\n\tmovea.l\t(a7)+,a1";
#define SetAddressEntryAttrs(...) __SetAddressEntryAttrs(AmlBase, __VA_ARGS__)
#endif

BOOL __MatchAddressA(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") struct TagItem * tags)="\tjsr\t-300(a6)";
#define MatchAddressA(addr, tags) __MatchAddressA(AmlBase, (addr), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
BOOL __MatchAddress(__reg("a6") void *, __reg("a0") APTR addr, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-300(a6)\n\tmovea.l\t(a7)+,a1";
#define MatchAddress(...) __MatchAddress(AmlBase, __VA_ARGS__)
#endif

APTR __FindAddressEntryA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-306(a6)";
#define FindAddressEntryA(server, tags) __FindAddressEntryA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __FindAddressEntry(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-306(a6)\n\tmovea.l\t(a7)+,a1";
#define FindAddressEntry(...) __FindAddressEntry(AmlBase, __VA_ARGS__)
#endif

APTR __HuntAddressEntryA(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct TagItem * tags)="\tjsr\t-312(a6)";
#define HuntAddressEntryA(server, tags) __HuntAddressEntryA(AmlBase, (server), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __HuntAddressEntry(__reg("a6") void *, __reg("a0") APTR server, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-312(a6)\n\tmovea.l\t(a7)+,a1";
#define HuntAddressEntry(...) __HuntAddressEntry(AmlBase, __VA_ARGS__)
#endif

ULONG __ScanAddressIndex(__reg("a6") void *, __reg("a0") APTR server, __reg("a1") struct Hook * hook, __reg("d0") ULONG type, __reg("d1") ULONG flags)="\tjsr\t-318(a6)";
#define ScanAddressIndex(server, hook, type, flags) __ScanAddressIndex(AmlBase, (server), (hook), (type), (flags))

BOOL __AddCustomField(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") STRPTR field, __reg("a2") STRPTR data)="\tjsr\t-324(a6)";
#define AddCustomField(addr, field, data) __AddCustomField(AmlBase, (addr), (field), (data))

BOOL __RemCustomField(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") STRPTR field)="\tjsr\t-330(a6)";
#define RemCustomField(addr, field) __RemCustomField(AmlBase, (addr), (field))

STRPTR __GetCustomFieldData(__reg("a6") void *, __reg("a0") APTR addr, __reg("a1") STRPTR field)="\tjsr\t-336(a6)";
#define GetCustomFieldData(addr, field) __GetCustomFieldData(AmlBase, (addr), (field))

APTR __CreateDecoderA(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-342(a6)";
#define CreateDecoderA(tags) __CreateDecoderA(AmlBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
APTR __CreateDecoder(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-342(a6)\n\tmovea.l\t(a7)+,a0";
#define CreateDecoder(...) __CreateDecoder(AmlBase, __VA_ARGS__)
#endif

VOID __DisposeDecoder(__reg("a6") void *, __reg("a0") APTR dec)="\tjsr\t-348(a6)";
#define DisposeDecoder(dec) __DisposeDecoder(AmlBase, (dec))

ULONG __GetDecoderAttrsA(__reg("a6") void *, __reg("a0") APTR dec, __reg("a1") struct TagItem * tags)="\tjsr\t-354(a6)";
#define GetDecoderAttrsA(dec, tags) __GetDecoderAttrsA(AmlBase, (dec), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __GetDecoderAttrs(__reg("a6") void *, __reg("a0") APTR dec, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-354(a6)\n\tmovea.l\t(a7)+,a1";
#define GetDecoderAttrs(...) __GetDecoderAttrs(AmlBase, __VA_ARGS__)
#endif

ULONG __SetDecoderAttrsA(__reg("a6") void *, __reg("a0") APTR dec, __reg("a1") struct TagItem * tags)="\tjsr\t-360(a6)";
#define SetDecoderAttrsA(dec, tags) __SetDecoderAttrsA(AmlBase, (dec), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __SetDecoderAttrs(__reg("a6") void *, __reg("a0") APTR dec, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-360(a6)\n\tmovea.l\t(a7)+,a1";
#define SetDecoderAttrs(...) __SetDecoderAttrs(AmlBase, __VA_ARGS__)
#endif

LONG __Decode(__reg("a6") void *, __reg("a0") APTR dec, __reg("d0") ULONG type)="\tjsr\t-366(a6)";
#define Decode(dec, type) __Decode(AmlBase, (dec), (type))

LONG __Encode(__reg("a6") void *, __reg("a0") APTR dec, __reg("d0") ULONG type)="\tjsr\t-372(a6)";
#define Encode(dec, type) __Encode(AmlBase, (dec), (type))

#endif /*  _VBCCINLINE_AML_H  */
