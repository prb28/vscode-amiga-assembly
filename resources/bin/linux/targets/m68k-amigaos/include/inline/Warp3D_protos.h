#ifndef _VBCCINLINE_WARP3D_H
#define _VBCCINLINE_WARP3D_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

W3D_Context    * __W3D_CreateContext(__reg("a6") void *, __reg("a0") ULONG * error, __reg("a1") struct TagItem * CCTags)="\tjsr\t-30(a6)";
#define W3D_CreateContext(error, CCTags) __W3D_CreateContext(Warp3DBase, (error), (CCTags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
W3D_Context    * __W3D_CreateContextTags(__reg("a6") void *, __reg("a0") ULONG * error, Tag CCTags, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a1";
#define W3D_CreateContextTags(error, ...) __W3D_CreateContextTags(Warp3DBase, (error), __VA_ARGS__)
#endif

void __W3D_DestroyContext(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-36(a6)";
#define W3D_DestroyContext(context) __W3D_DestroyContext(Warp3DBase, (context))

ULONG __W3D_GetState(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG state)="\tjsr\t-42(a6)";
#define W3D_GetState(context, state) __W3D_GetState(Warp3DBase, (context), (state))

ULONG __W3D_SetState(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG state, __reg("d1") ULONG action)="\tjsr\t-48(a6)";
#define W3D_SetState(context, state, action) __W3D_SetState(Warp3DBase, (context), (state), (action))

ULONG __W3D_CheckDriver(__reg("a6") void *)="\tjsr\t-54(a6)";
#define W3D_CheckDriver() __W3D_CheckDriver(Warp3DBase)

ULONG __W3D_LockHardware(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-60(a6)";
#define W3D_LockHardware(context) __W3D_LockHardware(Warp3DBase, (context))

void __W3D_UnLockHardware(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-66(a6)";
#define W3D_UnLockHardware(context) __W3D_UnLockHardware(Warp3DBase, (context))

void __W3D_WaitIdle(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-72(a6)";
#define W3D_WaitIdle(context) __W3D_WaitIdle(Warp3DBase, (context))

ULONG __W3D_CheckIdle(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-78(a6)";
#define W3D_CheckIdle(context) __W3D_CheckIdle(Warp3DBase, (context))

ULONG __W3D_Query(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG query, __reg("d1") ULONG destfmt)="\tjsr\t-84(a6)";
#define W3D_Query(context, query, destfmt) __W3D_Query(Warp3DBase, (context), (query), (destfmt))

ULONG __W3D_GetTexFmtInfo(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG format, __reg("d1") ULONG destfmt)="\tjsr\t-90(a6)";
#define W3D_GetTexFmtInfo(context, format, destfmt) __W3D_GetTexFmtInfo(Warp3DBase, (context), (format), (destfmt))

W3D_Texture    * __W3D_AllocTexObj(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") ULONG * error, __reg("a2") struct TagItem * ATOTags)="\tjsr\t-96(a6)";
#define W3D_AllocTexObj(context, error, ATOTags) __W3D_AllocTexObj(Warp3DBase, (context), (error), (ATOTags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
W3D_Texture    * __W3D_AllocTexObjTags(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") ULONG * error, Tag ATOTags, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-96(a6)\n\tmovea.l\t(a7)+,a2";
#define W3D_AllocTexObjTags(context, error, ...) __W3D_AllocTexObjTags(Warp3DBase, (context), (error), __VA_ARGS__)
#endif

void __W3D_FreeTexObj(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture)="\tjsr\t-102(a6)";
#define W3D_FreeTexObj(context, texture) __W3D_FreeTexObj(Warp3DBase, (context), (texture))

void __W3D_ReleaseTexture(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture)="\tjsr\t-108(a6)";
#define W3D_ReleaseTexture(context, texture) __W3D_ReleaseTexture(Warp3DBase, (context), (texture))

void __W3D_FlushTextures(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-114(a6)";
#define W3D_FlushTextures(context) __W3D_FlushTextures(Warp3DBase, (context))

ULONG __W3D_SetFilter(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("d0") ULONG min, __reg("d1") ULONG mag)="\tjsr\t-120(a6)";
#define W3D_SetFilter(context, texture, min, mag) __W3D_SetFilter(Warp3DBase, (context), (texture), (min), (mag))

ULONG __W3D_SetTexEnv(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("d1") ULONG envparam, __reg("a2") W3D_Color * envcolor)="\tjsr\t-126(a6)";
#define W3D_SetTexEnv(context, texture, envparam, envcolor) __W3D_SetTexEnv(Warp3DBase, (context), (texture), (envparam), (envcolor))

ULONG __W3D_SetWrapMode(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("d0") ULONG mode_s, __reg("d1") ULONG mode_t, __reg("a2") W3D_Color * bordercolor)="\tjsr\t-132(a6)";
#define W3D_SetWrapMode(context, texture, mode_s, mode_t, bordercolor) __W3D_SetWrapMode(Warp3DBase, (context), (texture), (mode_s), (mode_t), (bordercolor))

ULONG __W3D_UpdateTexImage(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("a2") void * teximage, __reg("d1") int level, __reg("a3") ULONG * palette)="\tjsr\t-138(a6)";
#define W3D_UpdateTexImage(context, texture, teximage, level, palette) __W3D_UpdateTexImage(Warp3DBase, (context), (texture), (teximage), (level), (palette))

ULONG __W3D_UploadTexture(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture)="\tjsr\t-144(a6)";
#define W3D_UploadTexture(context, texture) __W3D_UploadTexture(Warp3DBase, (context), (texture))

ULONG __W3D_DrawLine(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Line * line)="\tjsr\t-150(a6)";
#define W3D_DrawLine(context, line) __W3D_DrawLine(Warp3DBase, (context), (line))

ULONG __W3D_DrawPoint(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Point * point)="\tjsr\t-156(a6)";
#define W3D_DrawPoint(context, point) __W3D_DrawPoint(Warp3DBase, (context), (point))

ULONG __W3D_DrawTriangle(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Triangle * triangle)="\tjsr\t-162(a6)";
#define W3D_DrawTriangle(context, triangle) __W3D_DrawTriangle(Warp3DBase, (context), (triangle))

ULONG __W3D_DrawTriFan(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Triangles * triangles)="\tjsr\t-168(a6)";
#define W3D_DrawTriFan(context, triangles) __W3D_DrawTriFan(Warp3DBase, (context), (triangles))

ULONG __W3D_DrawTriStrip(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Triangles * triangles)="\tjsr\t-174(a6)";
#define W3D_DrawTriStrip(context, triangles) __W3D_DrawTriStrip(Warp3DBase, (context), (triangles))

ULONG __W3D_SetAlphaMode(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG mode, __reg("a1") W3D_Float * refval)="\tjsr\t-180(a6)";
#define W3D_SetAlphaMode(context, mode, refval) __W3D_SetAlphaMode(Warp3DBase, (context), (mode), (refval))

ULONG __W3D_SetBlendMode(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG srcfunc, __reg("d1") ULONG dstfunc)="\tjsr\t-186(a6)";
#define W3D_SetBlendMode(context, srcfunc, dstfunc) __W3D_SetBlendMode(Warp3DBase, (context), (srcfunc), (dstfunc))

ULONG __W3D_SetDrawRegion(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") struct BitMap * bm, __reg("d1") int yoffset, __reg("a2") W3D_Scissor * scissor)="\tjsr\t-192(a6)";
#define W3D_SetDrawRegion(context, bm, yoffset, scissor) __W3D_SetDrawRegion(Warp3DBase, (context), (bm), (yoffset), (scissor))

ULONG __W3D_SetFogParams(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Fog * fogparams, __reg("d1") ULONG fogmode)="\tjsr\t-198(a6)";
#define W3D_SetFogParams(context, fogparams, fogmode) __W3D_SetFogParams(Warp3DBase, (context), (fogparams), (fogmode))

ULONG __W3D_SetColorMask(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") W3D_Bool red, __reg("d1") W3D_Bool green, __reg("d2") W3D_Bool blue, __reg("d3") W3D_Bool alpha)="\tjsr\t-204(a6)";
#define W3D_SetColorMask(context, red, green, blue, alpha) __W3D_SetColorMask(Warp3DBase, (context), (red), (green), (blue), (alpha))

ULONG __W3D_SetStencilFunc(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG func, __reg("d1") ULONG refvalue, __reg("d2") ULONG mask)="\tjsr\t-210(a6)";
#define W3D_SetStencilFunc(context, func, refvalue, mask) __W3D_SetStencilFunc(Warp3DBase, (context), (func), (refvalue), (mask))

ULONG __W3D_AllocZBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-216(a6)";
#define W3D_AllocZBuffer(context) __W3D_AllocZBuffer(Warp3DBase, (context))

ULONG __W3D_FreeZBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-222(a6)";
#define W3D_FreeZBuffer(context) __W3D_FreeZBuffer(Warp3DBase, (context))

ULONG __W3D_ClearZBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Double * clearvalue)="\tjsr\t-228(a6)";
#define W3D_ClearZBuffer(context, clearvalue) __W3D_ClearZBuffer(Warp3DBase, (context), (clearvalue))

ULONG __W3D_ReadZPixel(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("a1") W3D_Double * z)="\tjsr\t-234(a6)";
#define W3D_ReadZPixel(context, x, y, z) __W3D_ReadZPixel(Warp3DBase, (context), (x), (y), (z))

ULONG __W3D_ReadZSpan(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG n, __reg("a1") W3D_Double * z)="\tjsr\t-240(a6)";
#define W3D_ReadZSpan(context, x, y, n, z) __W3D_ReadZSpan(Warp3DBase, (context), (x), (y), (n), (z))

ULONG __W3D_SetZCompareMode(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG mode)="\tjsr\t-246(a6)";
#define W3D_SetZCompareMode(context, mode) __W3D_SetZCompareMode(Warp3DBase, (context), (mode))

ULONG __W3D_AllocStencilBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-252(a6)";
#define W3D_AllocStencilBuffer(context) __W3D_AllocStencilBuffer(Warp3DBase, (context))

ULONG __W3D_ClearStencilBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") ULONG * clearval)="\tjsr\t-258(a6)";
#define W3D_ClearStencilBuffer(context, clearval) __W3D_ClearStencilBuffer(Warp3DBase, (context), (clearval))

ULONG __W3D_FillStencilBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG width, __reg("d3") ULONG height, __reg("d4") ULONG depth, __reg("a1") void * data)="\tjsr\t-264(a6)";
#define W3D_FillStencilBuffer(context, x, y, width, height, depth, data) __W3D_FillStencilBuffer(Warp3DBase, (context), (x), (y), (width), (height), (depth), (data))

ULONG __W3D_FreeStencilBuffer(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-270(a6)";
#define W3D_FreeStencilBuffer(context) __W3D_FreeStencilBuffer(Warp3DBase, (context))

ULONG __W3D_ReadStencilPixel(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("a1") ULONG * st)="\tjsr\t-276(a6)";
#define W3D_ReadStencilPixel(context, x, y, st) __W3D_ReadStencilPixel(Warp3DBase, (context), (x), (y), (st))

ULONG __W3D_ReadStencilSpan(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG n, __reg("a1") ULONG * st)="\tjsr\t-282(a6)";
#define W3D_ReadStencilSpan(context, x, y, n, st) __W3D_ReadStencilSpan(Warp3DBase, (context), (x), (y), (n), (st))

ULONG __W3D_SetLogicOp(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG operation)="\tjsr\t-288(a6)";
#define W3D_SetLogicOp(context, operation) __W3D_SetLogicOp(Warp3DBase, (context), (operation))

ULONG __W3D_Hint(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG mode, __reg("d1") ULONG quality)="\tjsr\t-294(a6)";
#define W3D_Hint(context, mode, quality) __W3D_Hint(Warp3DBase, (context), (mode), (quality))

ULONG __W3D_SetDrawRegionWBM(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Bitmap * bitmap, __reg("a2") W3D_Scissor * scissor)="\tjsr\t-300(a6)";
#define W3D_SetDrawRegionWBM(context, bitmap, scissor) __W3D_SetDrawRegionWBM(Warp3DBase, (context), (bitmap), (scissor))

ULONG __W3D_GetDriverState(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-306(a6)";
#define W3D_GetDriverState(context) __W3D_GetDriverState(Warp3DBase, (context))

ULONG __W3D_Flush(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-312(a6)";
#define W3D_Flush(context) __W3D_Flush(Warp3DBase, (context))

ULONG __W3D_SetPenMask(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG pen)="\tjsr\t-318(a6)";
#define W3D_SetPenMask(context, pen) __W3D_SetPenMask(Warp3DBase, (context), (pen))

ULONG __W3D_SetStencilOp(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG sfail, __reg("d1") ULONG dpfail, __reg("d2") ULONG dppass)="\tjsr\t-324(a6)";
#define W3D_SetStencilOp(context, sfail, dpfail, dppass) __W3D_SetStencilOp(Warp3DBase, (context), (sfail), (dpfail), (dppass))

ULONG __W3D_SetWriteMask(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG mask)="\tjsr\t-330(a6)";
#define W3D_SetWriteMask(context, mask) __W3D_SetWriteMask(Warp3DBase, (context), (mask))

ULONG __W3D_WriteStencilPixel(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG st)="\tjsr\t-336(a6)";
#define W3D_WriteStencilPixel(context, x, y, st) __W3D_WriteStencilPixel(Warp3DBase, (context), (x), (y), (st))

ULONG __W3D_WriteStencilSpan(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG n, __reg("a1") ULONG * st, __reg("a2") UBYTE * mask)="\tjsr\t-342(a6)";
#define W3D_WriteStencilSpan(context, x, y, n, st, mask) __W3D_WriteStencilSpan(Warp3DBase, (context), (x), (y), (n), (st), (mask))

void __W3D_WriteZPixel(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("a1") W3D_Double * z)="\tjsr\t-348(a6)";
#define W3D_WriteZPixel(context, x, y, z) __W3D_WriteZPixel(Warp3DBase, (context), (x), (y), (z))

void __W3D_WriteZSpan(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG x, __reg("d1") ULONG y, __reg("d2") ULONG n, __reg("a1") W3D_Double * z, __reg("a2") UBYTE * maks)="\tjsr\t-354(a6)";
#define W3D_WriteZSpan(context, x, y, n, z, maks) __W3D_WriteZSpan(Warp3DBase, (context), (x), (y), (n), (z), (maks))

ULONG __W3D_SetCurrentColor(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Color * color)="\tjsr\t-360(a6)";
#define W3D_SetCurrentColor(context, color) __W3D_SetCurrentColor(Warp3DBase, (context), (color))

ULONG __W3D_SetCurrentPen(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d1") ULONG pen)="\tjsr\t-366(a6)";
#define W3D_SetCurrentPen(context, pen) __W3D_SetCurrentPen(Warp3DBase, (context), (pen))

ULONG __W3D_UpdateTexSubImage(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("a2") void * teximage, __reg("d1") ULONG lev, __reg("a3") ULONG * palette, __reg("a4") W3D_Scissor* scissor, __reg("d0") ULONG srcbpr)="\tjsr\t-372(a6)";
#define W3D_UpdateTexSubImage(context, texture, teximage, lev, palette, scissor, srcbpr) __W3D_UpdateTexSubImage(Warp3DBase, (context), (texture), (teximage), (lev), (palette), (scissor), (srcbpr))

ULONG __W3D_FreeAllTexObj(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-378(a6)";
#define W3D_FreeAllTexObj(context) __W3D_FreeAllTexObj(Warp3DBase, (context))

ULONG __W3D_GetDestFmt(__reg("a6") void *)="\tjsr\t-384(a6)";
#define W3D_GetDestFmt() __W3D_GetDestFmt(Warp3DBase)

ULONG __W3D_DrawLineStrip(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Lines * lines)="\tjsr\t-390(a6)";
#define W3D_DrawLineStrip(context, lines) __W3D_DrawLineStrip(Warp3DBase, (context), (lines))

ULONG __W3D_DrawLineLoop(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Lines * lines)="\tjsr\t-396(a6)";
#define W3D_DrawLineLoop(context, lines) __W3D_DrawLineLoop(Warp3DBase, (context), (lines))

W3D_Driver ** __W3D_GetDrivers(__reg("a6") void *)="\tjsr\t-402(a6)";
#define W3D_GetDrivers() __W3D_GetDrivers(Warp3DBase)

ULONG __W3D_QueryDriver(__reg("a6") void *, __reg("a0") W3D_Driver* driver, __reg("d0") ULONG query, __reg("d1") ULONG destfmt)="\tjsr\t-408(a6)";
#define W3D_QueryDriver(driver, query, destfmt) __W3D_QueryDriver(Warp3DBase, (driver), (query), (destfmt))

ULONG __W3D_GetDriverTexFmtInfo(__reg("a6") void *, __reg("a0") W3D_Driver* driver, __reg("d0") ULONG format, __reg("d1") ULONG destfmt)="\tjsr\t-414(a6)";
#define W3D_GetDriverTexFmtInfo(driver, format, destfmt) __W3D_GetDriverTexFmtInfo(Warp3DBase, (driver), (format), (destfmt))

ULONG __W3D_RequestMode(__reg("a6") void *, __reg("a0") struct TagItem * taglist)="\tjsr\t-420(a6)";
#define W3D_RequestMode(taglist) __W3D_RequestMode(Warp3DBase, (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __W3D_RequestModeTags(__reg("a6") void *, Tag taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-420(a6)\n\tmovea.l\t(a7)+,a0";
#define W3D_RequestModeTags(...) __W3D_RequestModeTags(Warp3DBase, __VA_ARGS__)
#endif

void __W3D_SetScissor(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Scissor * scissor)="\tjsr\t-426(a6)";
#define W3D_SetScissor(context, scissor) __W3D_SetScissor(Warp3DBase, (context), (scissor))

void __W3D_FlushFrame(__reg("a6") void *, __reg("a0") W3D_Context * context)="\tjsr\t-432(a6)";
#define W3D_FlushFrame(context) __W3D_FlushFrame(Warp3DBase, (context))

W3D_Driver * __W3D_TestMode(__reg("a6") void *, __reg("d0") ULONG ModeID)="\tjsr\t-438(a6)";
#define W3D_TestMode(ModeID) __W3D_TestMode(Warp3DBase, (ModeID))

ULONG __W3D_SetChromaTestBounds(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_Texture * texture, __reg("d0") ULONG rgba_lower, __reg("d1") ULONG rgba_upper, __reg("d2") ULONG mode)="\tjsr\t-444(a6)";
#define W3D_SetChromaTestBounds(context, texture, rgba_lower, rgba_upper, mode) __W3D_SetChromaTestBounds(Warp3DBase, (context), (texture), (rgba_lower), (rgba_upper), (mode))

ULONG __W3D_ClearDrawRegion(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("d0") ULONG color)="\tjsr\t-450(a6)";
#define W3D_ClearDrawRegion(context, color) __W3D_ClearDrawRegion(Warp3DBase, (context), (color))

ULONG __W3D_DrawTriangleV(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_TriangleV * triangle)="\tjsr\t-456(a6)";
#define W3D_DrawTriangleV(context, triangle) __W3D_DrawTriangleV(Warp3DBase, (context), (triangle))

ULONG __W3D_DrawTriFanV(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_TrianglesV * triangles)="\tjsr\t-462(a6)";
#define W3D_DrawTriFanV(context, triangles) __W3D_DrawTriFanV(Warp3DBase, (context), (triangles))

ULONG __W3D_DrawTriStripV(__reg("a6") void *, __reg("a0") W3D_Context * context, __reg("a1") W3D_TrianglesV * triangles)="\tjsr\t-468(a6)";
#define W3D_DrawTriStripV(context, triangles) __W3D_DrawTriStripV(Warp3DBase, (context), (triangles))

W3D_ScreenMode * __W3D_GetScreenmodeList(__reg("a6") void *)="\tjsr\t-474(a6)";
#define W3D_GetScreenmodeList() __W3D_GetScreenmodeList(Warp3DBase)

void __W3D_FreeScreenmodeList(__reg("a6") void *, __reg("a0") W3D_ScreenMode * list)="\tjsr\t-480(a6)";
#define W3D_FreeScreenmodeList(list) __W3D_FreeScreenmodeList(Warp3DBase, (list))

ULONG __W3D_BestModeID(__reg("a6") void *, __reg("a0") struct TagItem * tags)="\tjsr\t-486(a6)";
#define W3D_BestModeID(tags) __W3D_BestModeID(Warp3DBase, (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
ULONG __W3D_BestModeIDTags(__reg("a6") void *, Tag tags, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-486(a6)\n\tmovea.l\t(a7)+,a0";
#define W3D_BestModeIDTags(...) __W3D_BestModeIDTags(Warp3DBase, __VA_ARGS__)
#endif

ULONG __W3D_VertexPointer(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("a1") void * pointer, __reg("d0") int stride, __reg("d1") ULONG mode, __reg("d2") ULONG flags)="\tjsr\t-492(a6)";
#define W3D_VertexPointer(context, pointer, stride, mode, flags) __W3D_VertexPointer(Warp3DBase, (context), (pointer), (stride), (mode), (flags))

ULONG __W3D_TexCoordPointer(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("a1") void * pointer, __reg("d0") int stride, __reg("d1") int unit, __reg("d2") int off_v, __reg("d3") int off_w, __reg("d4") ULONG flags)="\tjsr\t-498(a6)";
#define W3D_TexCoordPointer(context, pointer, stride, unit, off_v, off_w, flags) __W3D_TexCoordPointer(Warp3DBase, (context), (pointer), (stride), (unit), (off_v), (off_w), (flags))

ULONG __W3D_ColorPointer(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("a1") void * pointer, __reg("d0") int stride, __reg("d1") ULONG format, __reg("d2") ULONG mode, __reg("d3") ULONG flags)="\tjsr\t-504(a6)";
#define W3D_ColorPointer(context, pointer, stride, format, mode, flags) __W3D_ColorPointer(Warp3DBase, (context), (pointer), (stride), (format), (mode), (flags))

ULONG __W3D_BindTexture(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("d0") ULONG tmu, __reg("a1") W3D_Texture * texture)="\tjsr\t-510(a6)";
#define W3D_BindTexture(context, tmu, texture) __W3D_BindTexture(Warp3DBase, (context), (tmu), (texture))

ULONG __W3D_DrawArray(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("d0") ULONG primitive, __reg("d1") ULONG base, __reg("d2") ULONG count)="\tjsr\t-516(a6)";
#define W3D_DrawArray(context, primitive, base, count) __W3D_DrawArray(Warp3DBase, (context), (primitive), (base), (count))

ULONG __W3D_DrawElements(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("d0") ULONG primitive, __reg("d1") ULONG type, __reg("d2") ULONG count, __reg("a1") void * indices)="\tjsr\t-522(a6)";
#define W3D_DrawElements(context, primitive, type, count, indices) __W3D_DrawElements(Warp3DBase, (context), (primitive), (type), (count), (indices))

void __W3D_SetFrontFace(__reg("a6") void *, __reg("a0") W3D_Context* context, __reg("d0") ULONG direction)="\tjsr\t-528(a6)";
#define W3D_SetFrontFace(context, direction) __W3D_SetFrontFace(Warp3DBase, (context), (direction))

#endif /*  _VBCCINLINE_WARP3D_H  */
