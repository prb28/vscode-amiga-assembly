# Documentation

## Motorolla 68000 assembler
[Instructions](instructionset)

## Amiga libraries

### diskfont
| Function | Description |
|:---|:---|
|[AvailFonts](libs/diskfont/AvailFonts)|Inquire available memory &#038; disk fonts.|
|[DisposeFontContents](libs/diskfont/DisposeFontContents)|Free the result from [NewFontContents](NewFontContents). (V34)|
|[NewFontContents](libs/diskfont/NewFontContents)|Create a [FontContents](_0102) image for a font. (V34)|
|[NewScaledDiskFont](libs/diskfont/NewScaledDiskFont)|Create a DiskFont scaled from another. (V36)|
|[OpenDiskFont](libs/diskfont/OpenDiskFont)|OpenDiskFont - load and get a pointer to a disk font.|

### dos
| Function | Description |
|:---|:---|
|[AbortPkt](libs/dos/AbortPkt)|Aborts an asynchronous packet, if possible. (V36)|
|[AddBuffers](libs/dos/AddBuffers)|Changes the number of buffers for a filesystem (V36)|
|[AddDosEntry](libs/dos/AddDosEntry)|Add a Dos [List](_007D) entry to the lists (V36)|
|[AddPart](libs/dos/AddPart)|Appends a file/dir to the end of a path (V36)|
|[AddSegment](libs/dos/AddSegment)|AddSegment - Adds a resident segment to the resident list (V36)|
|[AllocDosObject](libs/dos/AllocDosObject)|Creates a dos object (V36)|
|[AssignAdd](libs/dos/AssignAdd)|Adds a lock to an assign for multi-directory assigns (V36)|
|[AssignLate](libs/dos/AssignLate)|Creates an assignment to a specified path later (V36)|
|[AssignLock](libs/dos/AssignLock)|Creates an assignment to a locked object (V36)|
|[AssignPath](libs/dos/AssignPath)|Creates an assignment to a specified path (V36)|
|[AttemptLockDosList](libs/dos/AttemptLockDosList)|Attempt to lock the Dos Lists for use (V36)|
|[ChangeMode](libs/dos/ChangeMode)|ChangeMode - Change the current mode of a lock or filehandle (V36)|
|[CheckSignal](libs/dos/CheckSignal)|Checks for break signals (V36)|
|[Cli](libs/dos/Cli)|Returns a pointer to the CLI structure of the process (V36)|
|[CliInitNewcli](libs/dos/CliInitNewcli)|Set up a process to be a shell from initial packet|
|[CliInitRun](libs/dos/CliInitRun)|Set up a process to be a shell from initial packet|
|[Close](libs/dos/Close)|Close an open file|
|[CompareDates](libs/dos/CompareDates)|Compares two datestamps (V36)|
|[CreateDir](libs/dos/CreateDir)|Create a new directory|
|[CreateNewProc](libs/dos/CreateNewProc)|Create a new process (V36)|
|[CreateProc](libs/dos/CreateProc)|Create a new process|
|[CurrentDir](libs/dos/CurrentDir)|Make a directory lock the current directory|
|[DateStamp](libs/dos/DateStamp)|Obtain the date and time in internal format|
|[DateToStr](libs/dos/DateToStr)|Converts a [DateStamp](_0068) to a string (V36)|
|[Delay](libs/dos/Delay)|Delay a process for a specified time|
|[DeleteFile](libs/dos/DeleteFile)|Delete a file or directory|
|[DeleteVar](libs/dos/DeleteVar)|Deletes a local or environment variable (V36)|
|[DeviceProc](libs/dos/DeviceProc)|Return the process [MsgPort](_0099) of specific I/O handler|
|[DoPkt](libs/dos/DoPkt)|Send a dos packet and wait for reply (V36)|
|[DupLock](libs/dos/DupLock)|Duplicate a lock|
|[DupLockFromFH](libs/dos/DupLockFromFH)|Gets a lock on an open file (V36)|
|[EndNotify](libs/dos/EndNotify)|Ends a notification request (V36)|
|[ErrorReport](libs/dos/ErrorReport)|Displays a Retry/Cancel requester for an error (V36)|
|[ExAll](libs/dos/ExAll)|Examine an entire directory (V36)|
|[Examine](libs/dos/Examine)|Examine a directory or file associated with a lock|
|[ExamineFH](libs/dos/ExamineFH)|Gets information on an open file (V36)|
|[Execute](libs/dos/Execute)|Execute a CLI command|
|[Exit](libs/dos/Exit)|Exit from a program|
|[ExNext](libs/dos/ExNext)|Examine the next entry in a directory|
|[Fault](libs/dos/Fault)|Returns the text associated with a DOS error code (V36)|
|[FGetC](libs/dos/FGetC)|Read a character from the specified input (buffered) (V36)|
|[FGets](libs/dos/FGets)|Reads a line from the specified input (buffered) (V36)|
|[FilePart](libs/dos/FilePart)|Returns the last component of a path (V36)|
|[FindArg](libs/dos/FindArg)|FindArg - find a keyword in a template (V36)|
|[FindCliProc](libs/dos/FindCliProc)|returns a pointer to the requested CLI process (V36)|
|[FindDosEntry](libs/dos/FindDosEntry)|Finds a specific Dos [List](_007D) entry (V36)|
|[FindSegment](libs/dos/FindSegment)|FindSegment - Finds a segment on the resident list (V36)|
|[FindVar](libs/dos/FindVar)|Finds a local variable (V36)|
|[Flush](libs/dos/Flush)|Flushes buffers for a buffered filehandle (V36)|
|[Format](libs/dos/Format)|Causes a filesystem to initialize itself (V36)|
|[FPutC](libs/dos/FPutC)|Write a character to the specified output (buffered) (V36)|
|[FPuts](libs/dos/FPuts)|Writes a string the the specified output (buffered) (V36)|
|[FRead](libs/dos/FRead)|Reads a number of blocks from an input (buffered) (V36)|
|[FreeArgs](libs/dos/FreeArgs)|FreeArgs - Free allocated memory after [ReadArgs](ReadArgs) (V36)|
|[FreeDeviceProc](libs/dos/FreeDeviceProc)|Releases port returned by [GetDeviceProc](GetDeviceProc) (V36)|
|[FreeDosEntry](libs/dos/FreeDosEntry)|Frees an entry created by [MakeDosEntry](MakeDosEntry) (V36)|
|[FreeDosObject](libs/dos/FreeDosObject)|Frees an object allocated by [AllocDosObject](AllocDosObject) (V36)|
|[FWrite](libs/dos/FWrite)|Writes a number of blocks to an output (buffered) (V36)|
|[GetArgStr](libs/dos/GetArgStr)|Returns the arguments for the process (V36)|
|[GetConsoleTask](libs/dos/GetConsoleTask)|Returns the default console for the process (V36)|
|[GetCurrentDirName](libs/dos/GetCurrentDirName)|returns the current directory name (V36)|
|[GetDeviceProc](libs/dos/GetDeviceProc)|Finds a handler to send a message to (V36)|
|[GetFileSysTask](libs/dos/GetFileSysTask)|Returns the default filesystem for the process (V36)|
|[GetProgramDir](libs/dos/GetProgramDir)|Returns a lock on the directory the program was loadedfrom (V36)|
|[GetProgramName](libs/dos/GetProgramName)|Returns the current program name (V36)|
|[GetPrompt](libs/dos/GetPrompt)|Returns the prompt for the current process (V36)|
|[GetVar](libs/dos/GetVar)|Returns the value of a local or global variable (V36)|
|[Info](libs/dos/Info)|Returns information about the disk|
|[Inhibit](libs/dos/Inhibit)|Inhibits access to a filesystem (V36)|
|[Input](libs/dos/Input)|Identify the program's initial input file handle|
|[InternalLoadSeg](libs/dos/InternalLoadSeg)|Low-level load routine (V36)|
|[InternalUnLoadSeg](libs/dos/InternalUnLoadSeg)|Unloads a seglist loaded with [InternalLoadSeg](InternalLoadSeg)(V36)|
|[IoErr](libs/dos/IoErr)|Return extra information from the system|
|[IsFileSystem](libs/dos/IsFileSystem)|returns whether a Dos handler is a filesystem (V36)|
|[IsInteractive](libs/dos/IsInteractive)|Discover whether a file is &#034;interactive&#034;|
|[LoadSeg](libs/dos/LoadSeg)|Scatterload a loadable file into memory|
|[Lock](libs/dos/Lock)|Lock a directory or file|
|[LockDosList](libs/dos/LockDosList)|Locks the specified Dos Lists for use (V36)|
|[LockRecord](libs/dos/LockRecord)|Locks a portion of a file (V36)|
|[LockRecords](libs/dos/LockRecords)|Lock a series of records (V36)|
|[MakeDosEntry](libs/dos/MakeDosEntry)|Creates a [DosList](_0078) structure (V36)|
|[MakeLink](libs/dos/MakeLink)|Creates a filesystem link (V36)|
|[MatchEnd](libs/dos/MatchEnd)|Free storage allocated for <a href="../Includes_and_Autodocs_2._guide/node02CE.html">MatchFirst()/MatchNext() (V36)|
|[MatchFirst](libs/dos/MatchFirst)|Finds file that matches pattern (V36)|
|[MatchNext](libs/dos/MatchNext)|MatchNext - Finds the next file or directory that matches pattern (V36)|
|[MatchPattern](libs/dos/MatchPattern)|Checks for a pattern match with a string (V36)|
|[MatchPatternNoCase](libs/dos/MatchPatternNoCase)|Checks for a pattern match with a string (V37)|
|[MaxCli](libs/dos/MaxCli)|returns the highest CLI process number possibly in use (V36)|
|[NameFromFH](libs/dos/NameFromFH)|Get the name of an open filehandle (V36)|
|[NameFromLock](libs/dos/NameFromLock)|Returns the name of a locked object (V36)|
|[NewLoadSeg](libs/dos/NewLoadSeg)|Improved version of [LoadSeg](LoadSeg) for stacksizes (V36)|
|[NextDosEntry](libs/dos/NextDosEntry)|Get the next Dos [List](_007D) entry (V36)|
|[Open](libs/dos/Open)|Open a file for input or output|
|[OpenFromLock](libs/dos/OpenFromLock)|Opens a file you have a lock on (V36)|
|[Output](libs/dos/Output)|Identify the programs' initial output file handle|
|[ParentDir](libs/dos/ParentDir)|Obtain the parent of a directory or file|
|[ParentOfFH](libs/dos/ParentOfFH)|returns a lock on the parent directory of a file (V36)|
|[ParsePattern](libs/dos/ParsePattern)|Create a tokenized string for [MatchPattern](MatchPattern) (V36)|
|[ParsePatternNoCase](libs/dos/ParsePatternNoCase)|Create a tokenized string for[MatchPatternNoCase](MatchPatternNoCase) (V37)|
|[PathPart](libs/dos/PathPart)|Returns a pointer to the end of the next-to-last (V36)component of a path.|
|[PrintFault](libs/dos/PrintFault)|Returns the text associated with a DOS error code (V36)|
|[PutStr](libs/dos/PutStr)|Writes a string the the default output (buffered) (V36)|
|[Read](libs/dos/Read)|Read bytes of data from a file|
|[ReadArgs](libs/dos/ReadArgs)|ReadArgs - Parse the command line input (V36)|
|[ReadItem](libs/dos/ReadItem)|ReadItem - reads a single argument/name from command line (V36)|
|[ReadLink](libs/dos/ReadLink)|Reads the path for a soft filesystem link (V36)|
|[Relabel](libs/dos/Relabel)|Change the volume name of a volume (V36)|
|[RemAssignList](libs/dos/RemAssignList)|Remove an entry from a multi-dir assign (V36)|
|[RemDosEntry](libs/dos/RemDosEntry)|Removes a Dos [List](_007D) entry from it's list (V36)|
|[RemSegment](libs/dos/RemSegment)|RemSegment - Removes a resident segment from the resident list (V36)|
|[Rename](libs/dos/Rename)|Rename a directory or file|
|[ReplyPkt](libs/dos/ReplyPkt)|replies a packet to the person who sent it to you (V36)|
|[RunCommand](libs/dos/RunCommand)|Runs a program using the current process (V36)|
|[SameDevice](libs/dos/SameDevice)|Are two locks are on partitions of the device? (V37)|
|[SameLock](libs/dos/SameLock)|returns whether two locks are on the same object (V36)|
|[Seek](libs/dos/Seek)|Set the current position for reading and writing|
|[SelectInput](libs/dos/SelectInput)|Select a filehandle as the default input channel (V36)|
|[SelectOutput](libs/dos/SelectOutput)|Select a filehandle as the default input channel (V36)|
|[SendPkt](libs/dos/SendPkt)|Sends a packet to a handler (V36)|
|[SetArgStr](libs/dos/SetArgStr)|Sets the arguments for the current process (V36)|
|[SetComment](libs/dos/SetComment)|Change a files' comment string|
|[SetConsoleTask](libs/dos/SetConsoleTask)|Sets the default console for the process (V36)|
|[SetCurrentDirName](libs/dos/SetCurrentDirName)|Sets the directory name for the process (V36)|
|[SetFileDate](libs/dos/SetFileDate)|Sets the modification date for a file or dir (V36)|
|[SetFileSize](libs/dos/SetFileSize)|Sets the size of a file (V36)|
|[SetFileSysTask](libs/dos/SetFileSysTask)|Sets the default filesystem for the process (V36)|
|[SetIoErr](libs/dos/SetIoErr)|Sets the value returned by [IoErr](IoErr) (V36)|
|[SetMode](libs/dos/SetMode)|SetMode - Set the current behavior of a handler (V36)|
|[SetProgramDir](libs/dos/SetProgramDir)|Sets the directory returned by [GetProgramDir](GetProgramDir) (V36)|
|[SetProgramName](libs/dos/SetProgramName)|Sets the name of the program being run (V36)|
|[SetPrompt](libs/dos/SetPrompt)|Sets the CLI/shell prompt for the current process (V36)|
|[SetProtection](libs/dos/SetProtection)|Set protection for a file or directory|
|[SetVar](libs/dos/SetVar)|Sets a local or environment variable (V36)|
|[SetVBuf](libs/dos/SetVBuf)|set buffering modes and size (V36)|
|[SplitName](libs/dos/SplitName)|splits out a component of a pathname into a buffer (V36)|
|[StartNotify](libs/dos/StartNotify)|Starts notification on a file or directory (V36)|
|[StrToDate](libs/dos/StrToDate)|Converts a string to a [DateStamp](_0068) (V36)|
|[StrToLong](libs/dos/StrToLong)|string to long value (decimal) (V36)|
|[SystemTagList](libs/dos/SystemTagList)|Have a shell execute a command line (V36)|
|[UnGetC](libs/dos/UnGetC)|Makes a char available for reading again. (buffered) (V36)|
|[UnLoadSeg](libs/dos/UnLoadSeg)|Unload a seglist previously loaded by [LoadSeg](LoadSeg)|
|[UnLock](libs/dos/UnLock)|Unlock a directory or file|
|[UnLockDosList](libs/dos/UnLockDosList)|Unlocks the Dos [List](_007D) (V36)|
|[UnLockRecord](libs/dos/UnLockRecord)|Unlock a record (V36)|
|[UnLockRecords](libs/dos/UnLockRecords)|Unlock a list of records (V36)|
|[VFPrintf](libs/dos/VFPrintf)|format and print a string to a file (buffered) (V36)|
|[VFWritef](libs/dos/VFWritef)|VFWritef - write a BCPL formatted string to a file (buffered) (V36)|
|[VPrintf](libs/dos/VPrintf)|format and print string (buffered) (V36)|
|[WaitForChar](libs/dos/WaitForChar)|Determine if chars arrive within a time limit|
|[WaitPkt](libs/dos/WaitPkt)|Waits for a packet to arrive at your pr_MsgPort (V36)|
|[Write](libs/dos/Write)|Write bytes of data to a file|
|[WriteChars](libs/dos/WriteChars)|Writes bytes to the the default output (buffered) (V36)|

### exec
| Function | Description |
|:---|:---|
|[AbortIO](libs/exec/AbortIO)|AbortIO - attempt to abort an in-progress I/O request|
|[AddDevice](libs/exec/AddDevice)|add a device to the system|
|[AddHead](libs/exec/AddHead)|insert node at the head of a list|
|[AddIntServer](libs/exec/AddIntServer)|add an interrupt server to a system server chain|
|[AddLibrary](libs/exec/AddLibrary)|add a library to the system|
|[AddMemList](libs/exec/AddMemList)|AddMemList - add memory to the system free pool|
|[AddPort](libs/exec/AddPort)|add a public message port to the system|
|[AddResource](libs/exec/AddResource)|add a resource to the system|
|[AddSemaphore](libs/exec/AddSemaphore)|initialize then add a signal semaphore to the system|
|[AddTail](libs/exec/AddTail)|append node to tail of a list|
|[AddTask](libs/exec/AddTask)|add a task to the system|
|[Alert](libs/exec/Alert)|alert the user of an error|
|[AllocAbs](libs/exec/AllocAbs)|allocate at a given location|
|[Allocate](libs/exec/Allocate)|Allocate - allocate a block of memory|
|[AllocEntry](libs/exec/AllocEntry)|allocate many regions of memory|
|[AllocMem](libs/exec/AllocMem)|allocate memory given certain requirements|
|[AllocSignal](libs/exec/AllocSignal)|allocate a signal bit|
|[AllocTrap](libs/exec/AllocTrap)|allocate a processor trap vector|
|[AllocVec](libs/exec/AllocVec)|allocate memory and keep track of the size  (V36)|
|[AttemptSemaphore](libs/exec/AttemptSemaphore)|try to obtain without blocking|
|[AvailMem](libs/exec/AvailMem)|memory available given certain requirements|
|[CacheClearE](libs/exec/CacheClearE)|CacheClearE - Cache clearing with extended control (V37)|
|[CacheClearU](libs/exec/CacheClearU)|CacheClearU - User callable simple cache clearing (V37)|
|[CacheControl](libs/exec/CacheControl)|CacheControl - Instruction &#038; data cache control|
|[CachePostDMA](libs/exec/CachePostDMA)|CachePostDMA - Take actions after to hardware DMA  (V37)|
|[CachePreDMA](libs/exec/CachePreDMA)|CachePreDMA - Take actions prior to hardware DMA  (V37)|
|[Cause](libs/exec/Cause)|cause a software interrupt|
|[CheckIO](libs/exec/CheckIO)|get the status of an [IORequest](_0094)|
|[CloseDevice](libs/exec/CloseDevice)|conclude access to a device|
|[CloseLibrary](libs/exec/CloseLibrary)|conclude access to a library|
|[ColdReboot](libs/exec/ColdReboot)|ColdReboot - reboot the Amiga (V36)|
|[CopyMem](libs/exec/CopyMem)|CopyMem - general purpose memory copy function|
|[CopyMemQuick](libs/exec/CopyMemQuick)|CopyMemQuick - optimized memory copy function|
|[CreateIORequest](libs/exec/CreateIORequest)|create an [IORequest](_0094) structure  (V36)|
|[CreateMsgPort](libs/exec/CreateMsgPort)|CreateMsgPort - Allocate and initialize a new message port  (V36)|
|[Deallocate](libs/exec/Deallocate)|deallocate a block of memory|
|[Debug](libs/exec/Debug)|run the system debugger|
|[DeleteIORequest](libs/exec/DeleteIORequest)|DeleteIORequest() - Free a request made by [CreateIORequest](CreateIORequest)  (V36)|
|[DeleteMsgPort](libs/exec/DeleteMsgPort)|DeleteMsgPort - Free a message port created by [CreateMsgPort](CreateMsgPort)  (V36)|
|[Disable](libs/exec/Disable)|disable interrupt processing.|
|[DoIO](libs/exec/DoIO)|perform an I/O command and wait for completion|
|[Enable](libs/exec/Enable)|permit system interrupts to resume.|
|[Enqueue](libs/exec/Enqueue)|insert or append node to a system queue|
|[FindName](libs/exec/FindName)|find a system list node with a given name|
|[FindPort](libs/exec/FindPort)|find a given system message port|
|[FindResident](libs/exec/FindResident)|FindResident - find a resident module by name|
|[FindSemaphore](libs/exec/FindSemaphore)|find a given system signal semaphore|
|[FindTask](libs/exec/FindTask)|find a task with the given name or find oneself|
|[Forbid](libs/exec/Forbid)|forbid task rescheduling.|
|[FreeEntry](libs/exec/FreeEntry)|free many regions of memory|
|[FreeMem](libs/exec/FreeMem)|deallocate with knowledge|
|[FreeSignal](libs/exec/FreeSignal)|free a signal bit|
|[FreeTrap](libs/exec/FreeTrap)|free a processor trap|
|[FreeVec](libs/exec/FreeVec)|return [AllocVec](AllocVec) memory to the system  (V36)|
|[GetCC](libs/exec/GetCC)|get condition codes in a 68010 compatible way.|
|[GetMsg](libs/exec/GetMsg)|get next message from a message port|
|[InitCode](libs/exec/InitCode)|InitCode - initialize resident code modules (internal function)|
|[InitResident](libs/exec/InitResident)|InitResident - initialize resident module|
|[InitSemaphore](libs/exec/InitSemaphore)|initialize a signal semaphore|
|[InitStruct](libs/exec/InitStruct)|InitStruct - initialize memory from a table|
|[Insert](libs/exec/Insert)|insert a node into a list|
|[MakeFunctions](libs/exec/MakeFunctions)|construct a function jump table|
|[MakeLibrary](libs/exec/MakeLibrary)|construct a library|
|[ObtainSemaphore](libs/exec/ObtainSemaphore)|gain exclusive access to a semaphore|
|[ObtainSemaphoreList](libs/exec/ObtainSemaphoreList)|get a list of semaphores.|
|[ObtainSemaphoreShared](libs/exec/ObtainSemaphoreShared)|gain shared access to a semaphore (V36)|
|[OldOpenLibrary](libs/exec/OldOpenLibrary)|obsolete [OpenLibrary](OpenLibrary)|
|[OpenDevice](libs/exec/OpenDevice)|gain access to a device|
|[OpenLibrary](libs/exec/OpenLibrary)|gain access to a library|
|[OpenResource](libs/exec/OpenResource)|gain access to a resource|
|[Permit](libs/exec/Permit)|permit task rescheduling.|
|[Procure](libs/exec/Procure)|bid for a message lock (semaphore)|
|[PutMsg](libs/exec/PutMsg)|put a message to a message port|
|[RawDoFmt](libs/exec/RawDoFmt)|format data into a character stream.|
|[ReleaseSemaphore](libs/exec/ReleaseSemaphore)|make signal semaphore available to others|
|[ReleaseSemaphoreList](libs/exec/ReleaseSemaphoreList)|make a list of semaphores available|
|[RemDevice](libs/exec/RemDevice)|remove a device from the system|
|[RemHead](libs/exec/RemHead)|remove the head node from a list|
|[RemIntServer](libs/exec/RemIntServer)|remove an interrupt server from a server chain|
|[RemLibrary](libs/exec/RemLibrary)|remove a library from the system|
|[Remove](libs/exec/Remove)|remove a node from a list|
|[RemPort](libs/exec/RemPort)|remove a message port from the system|
|[RemResource](libs/exec/RemResource)|remove a resource from the system|
|[RemSemaphore](libs/exec/RemSemaphore)|remove a signal semaphore from the system|
|[RemTail](libs/exec/RemTail)|remove the tail node from a list|
|[RemTask](libs/exec/RemTask)|remove a task from the system|
|[ReplyMsg](libs/exec/ReplyMsg)|put a message to its reply port|
|[SendIO](libs/exec/SendIO)|initiate an I/O command|
|[SetExcept](libs/exec/SetExcept)|define certain signals to cause exceptions|
|[SetFunction](libs/exec/SetFunction)|change a function vector in a library|
|[SetIntVector](libs/exec/SetIntVector)|set a new handler for a system interrupt vector|
|[SetSignal](libs/exec/SetSignal)|define the state of this task's signals|
|[SetSR](libs/exec/SetSR)|get and/or set processor status register|
|[SetTaskPri](libs/exec/SetTaskPri)|get and set the priority of a task|
|[Signal](libs/exec/Signal)|signal a task|
|[StackSwap](libs/exec/StackSwap)|StackSwap - EXEC supported method of replacing task's stack      (V37)|
|[SumKickData](libs/exec/SumKickData)|compute the checksum for the Kickstart delta list|
|[SumLibrary](libs/exec/SumLibrary)|compute and check the checksum on a library|
|[SuperState](libs/exec/SuperState)|enter supervisor state with user stack|
|[Supervisor](libs/exec/Supervisor)|trap to a short supervisor mode function|
|[TypeOfMem](libs/exec/TypeOfMem)|determine attributes of a given memory address|
|[UserState](libs/exec/UserState)|return to user state with user stack|
|[Vacate](libs/exec/Vacate)|release a message lock (semaphore)|
|[Wait](libs/exec/Wait)|wait for one or more signals|
|[WaitIO](libs/exec/WaitIO)|wait for completion of an I/O request|
|[WaitPort](libs/exec/WaitPort)|wait for a given port to be non-empty|

### graphics
| Function | Description |
|:---|:---|
|[AddAnimOb](libs/graphics/AddAnimOb)|Add an [AnimOb](_00C3) to the linked list of AnimObs.|
|[AddBob](libs/graphics/AddBob)|Adds a [Bob](_00C3) to current gel list.|
|[AddFont](libs/graphics/AddFont)|add a font to the system list|
|[AddVSprite](libs/graphics/AddVSprite)|Add a [VSprite](_00C3) to the current gel list.|
|[AllocRaster](libs/graphics/AllocRaster)|Allocate space for a bitplane.|
|[AndRectRegion](libs/graphics/AndRectRegion)|Perform 2d AND operation of rectanglewith region, leaving result in region.|
|[AndRegionRegion](libs/graphics/AndRegionRegion)|Perform 2d AND operation of one regionwith second region, leaving result in second region.|
|[Animate](libs/graphics/Animate)|Processes every [AnimOb](_00C3) in the current animation list.|
|[AreaCircle](libs/graphics/AreaCircle)|add a circle to areainfo list for areafill.|
|[AreaDraw](libs/graphics/AreaDraw)|Add a point to a list of end points for areafill.|
|[AreaEllipse](libs/graphics/AreaEllipse)|add a ellipse to areainfo list for areafill.|
|[AreaEnd](libs/graphics/AreaEnd)|[Process](_0078) table of vectors and ellipses and produce areafill.|
|[AreaMove](libs/graphics/AreaMove)|Define a new starting point for a newshape in the vector list.|
|[AskFont](libs/graphics/AskFont)|get the text attributes of the current font|
|[AskSoftStyle](libs/graphics/AskSoftStyle)|Get the soft style bits of the current font.|
|[AttemptLockLayerRom](libs/graphics/AttemptLockLayerRom)|Attempt to Lock [Layer](_00A1) structureby rom(gfx lib) code|
|[BitMapScale](libs/graphics/BitMapScale)|Perform raster scaling on a bit map. (V36)|
|[BltBitMap](libs/graphics/BltBitMap)|Move a rectangular region of bits in a [BitMap](_00A6).|
|[BltBitMapRastPort](libs/graphics/BltBitMapRastPort)|Blit from source bitmap to destination rastport.|
|[BltClear](libs/graphics/BltClear)|BltClear - Clear a block of memory words to zero.|
|[BltMaskBitMapRastPort](libs/graphics/BltMaskBitMapRastPort)|blit from source bitmap to destinationrastport with masking of source image.|
|[BltPattern](libs/graphics/BltPattern)|Using standard drawing rules for areafill,blit through a mask.|
|[BltTemplate](libs/graphics/BltTemplate)|Cookie cut a shape in a rectangle to the [RastPort](_00AF).|
|[CBump](libs/graphics/CBump)|increment user copper list pointer (bump to next positionin list).|
|[CEND](libs/graphics/CEND)|Terminate user copper list.|
|[ChangeSprite](libs/graphics/ChangeSprite)|Change the sprite image pointer.|
|[CINIT](libs/graphics/CINIT)|Initialize user copperlist to accept intermediateuser copper instructions.|
|[ClearEOL](libs/graphics/ClearEOL)|Clear from current position to end of line.|
|[ClearRectRegion](libs/graphics/ClearRectRegion)|Perform 2d CLEAR operation of rectanglewith region, leaving result in region.|
|[ClearRegion](libs/graphics/ClearRegion)|Remove all rectangles from region.|
|[ClearScreen](libs/graphics/ClearScreen)|Clear from current position to end of [RastPort](_00AF).|
|[ClipBlit](libs/graphics/ClipBlit)|Calls [BltBitMap](BltBitMap) after accounting for windows|
|[CloseFont](libs/graphics/CloseFont)|Release a pointer to a system font.|
|[CloseMonitor](libs/graphics/CloseMonitor)|close a [MonitorSpec](_00A7) (V36)|
|[CMOVE](libs/graphics/CMOVE)|append copper move instruction to user copper list.|
|[CopySBitMap](libs/graphics/CopySBitMap)|Syncronize [Layer](_00A1) window with contents ofSuper [BitMap](_00A6)|
|[CWAIT](libs/graphics/CWAIT)|Append copper wait instruction to user copper list.|
|[DisownBlitter](libs/graphics/DisownBlitter)|DisownBlitter - return blitter to free state.|
|[DisposeRegion](libs/graphics/DisposeRegion)|Return all space for this region to freememory pool.|
|[DoCollision](libs/graphics/DoCollision)|Test every gel in gel list for collisions.|
|[Draw](libs/graphics/Draw)|Draw a line between the current pen positionand the new x,y position.|
|[DrawEllipse](libs/graphics/DrawEllipse)|Draw an ellipse centered at cx,cy with verticaland horizontal radii of a,b respectively.|
|[DrawGList](libs/graphics/DrawGList)|[Process](_0078) the gel list, queueing VSprites, drawing Bobs.|
|[EraseRect](libs/graphics/EraseRect)|Fill a defined rectangular area using the currentBackFill hook. (V36)|
|[ExtendFont](libs/graphics/ExtendFont)|ensure tf_Extension has been built for a font (V36)|
|[FindDisplayInfo](libs/graphics/FindDisplayInfo)|search for a record identified by a specific key(V36)|
|[Flood](libs/graphics/Flood)|Flood rastport like areafill.|
|[FontExtent](libs/graphics/FontExtent)|get the font attributes of the current font (V36)|
|[FreeColorMap](libs/graphics/FreeColorMap)|Free the [ColorMap](_00B8) structure and return memoryto free memory pool.|
|[FreeCopList](libs/graphics/FreeCopList)|deallocate intermediate copper list|
|[FreeCprList](libs/graphics/FreeCprList)|deallocate hardware copper list|
|[FreeGBuffers](libs/graphics/FreeGBuffers)|Deallocate memory obtained by GetGBufers.|
|[FreeRaster](libs/graphics/FreeRaster)|Release an allocated area to the system free memory pool.|
|[FreeSprite](libs/graphics/FreeSprite)|Return sprite for use by others and virtualsprite machine.|
|[FreeVPortCopLists](libs/graphics/FreeVPortCopLists)|deallocate all intermediate copper lists andtheir headers from a viewport|
|[GetColorMap](libs/graphics/GetColorMap)|allocate and initialize Colormap|
|[GetDisplayInfoData](libs/graphics/GetDisplayInfoData)|query [DisplayInfo](_00BD) Record parameters (V36)|
|[GetGBuffers](libs/graphics/GetGBuffers)|Attempt to allocate ALL buffers of an entire [AnimOb](_00C3).|
|[GetRGB4](libs/graphics/GetRGB4)|Inquire value of entry in [ColorMap](_00B8).|
|[GetSprite](libs/graphics/GetSprite)|Attempt to get a sprite for the simple spritemanager.|
|[GetVPModeID](libs/graphics/GetVPModeID)|get the 32 bit DisplayID from a [ViewPort](_00B8). (V36)|
|[GfxAssociate](libs/graphics/GfxAssociate)|associate a graphics extended node with a given pointer(V36)|
|[GfxFree](libs/graphics/GfxFree)|free a graphics extended data structure (V36)|
|[GfxLookUP](libs/graphics/GfxLookUP)|find a graphics extended node associated with agiven pointer (V36)|
|[GfxNew](libs/graphics/GfxNew)|allocate a graphics extended data structure (V36)|
|[InitArea](libs/graphics/InitArea)|Initialize vector collection matrix|
|[InitBitMap](libs/graphics/InitBitMap)|Initialize bit map structure with input values.|
|[InitGels](libs/graphics/InitGels)|initialize a gel list; must be called before using gels.|
|[InitGMasks](libs/graphics/InitGMasks)|Initialize all of the masks of an [AnimOb](_00C3).|
|[InitMasks](libs/graphics/InitMasks)|Initialize the BorderLine and CollMask masks of a [VSprite](_00C3).|
|[InitRastPort](libs/graphics/InitRastPort)|Initialize raster port structure|
|[InitTmpRas](libs/graphics/InitTmpRas)|Initialize area of local memory for usage byareafill, floodfill, text.|
|[InitView](libs/graphics/InitView)|InitView - Initialize [View](_00B8) structure.|
|[InitVPort](libs/graphics/InitVPort)|InitVPort - Initialize [ViewPort](_00B8) structure.|
|[LoadRGB4](libs/graphics/LoadRGB4)|Load RGB color values from table.|
|[LoadView](libs/graphics/LoadView)|Use a (possibly freshly created) coprocessor instructionlist to create the current display.|
|[LockLayerRom](libs/graphics/LockLayerRom)|Lock [Layer](_00A1) structure by rom(gfx lib) code.|
|[MakeVPort](libs/graphics/MakeVPort)|generate display copper list for a viewport.|
|[ModeNotAvailable](libs/graphics/ModeNotAvailable)|check to see if a DisplayID isn't available. (V36)|
|[Move](libs/graphics/Move)|Move graphics pen position.|
|[MoveSprite](libs/graphics/MoveSprite)|Move sprite to a point relative to top of viewport.|
|[MrgCop](libs/graphics/MrgCop)|Merge together coprocessor instructions.|
|[NewRegion](libs/graphics/NewRegion)|Get an empty region.|
|[NextDisplayInfo](libs/graphics/NextDisplayInfo)|iterate current displayinfo identifiers (V36)|
|[OpenFont](libs/graphics/OpenFont)|Get a pointer to a system font.|
|[OpenMonitor](libs/graphics/OpenMonitor)|open a named [MonitorSpec](_00A7) (V36)|
|[OrRectRegion](libs/graphics/OrRectRegion)|Perform 2d OR operation of rectanglewith region, leaving result in region.|
|[OrRegionRegion](libs/graphics/OrRegionRegion)|Perform 2d OR operation of one regionwith second region, leaving result in second region|
|[OwnBlitter](libs/graphics/OwnBlitter)|get the blitter for private usage|
|[PolyDraw](libs/graphics/PolyDraw)|Draw lines from table of (x,y) values.|
|[QBlit](libs/graphics/QBlit)|Queue up a request for blitter usage|
|[QBSBlit](libs/graphics/QBSBlit)|Synchronize the blitter request with the video beam.|
|[ReadPixel](libs/graphics/ReadPixel)|read the pen number value of the pixel at aspecified x,y location within a certain [RastPort](_00AF).|
|[ReadPixelArray8](libs/graphics/ReadPixelArray8)|read the pen number value of a rectangular arrayof pixels starting at a specified x,y location and continuingthrough to another x,y location within a certain [RastPort](_00AF). (V36)|
|[ReadPixelLine8](libs/graphics/ReadPixelLine8)|read the pen number value of a horizontal lineof pixels starting at a specified x,y location and continuingright for count pixels. (V36)|
|[RectFill](libs/graphics/RectFill)|Fill a rectangular region in a [RastPort](_00AF).|
|[RemBob](libs/graphics/RemBob)|Macro to remove a [Bob](_00C3) from the gel list.|
|[RemFont](libs/graphics/RemFont)|Remove a font from the system list.|
|[RemIBob](libs/graphics/RemIBob)|Immediately remove a [Bob](_00C3) from the gel list and the [RastPort](_00AF).|
|[RemVSprite](libs/graphics/RemVSprite)|Remove a [VSprite](_00C3) from the current gel list.|
|[ScalerDiv](libs/graphics/ScalerDiv)|Get the scaling result that [BitMapScale](BitMapScale) would. (V36)|
|[ScrollRaster](libs/graphics/ScrollRaster)|Push bits in rectangle in raster around bydx,dy towards 0,0 inside rectangle.|
|[ScrollVPort](libs/graphics/ScrollVPort)|Reinterpret RasInfo information in [ViewPort](_00B8) to reflectthe current Offset values.|
|[SetAPen](libs/graphics/SetAPen)|Set the primary pen for a [RastPort](_00AF).|
|[SetBPen](libs/graphics/SetBPen)|Set secondary pen for a [RastPort](_00AF)|
|[SetCollision](libs/graphics/SetCollision)|Set a pointer to a user collision routine.|
|[SetDrMd](libs/graphics/SetDrMd)|Set drawing mode for a [RastPort](_00AF)|
|[SetFont](libs/graphics/SetFont)|Set the text font and attributes in a [RastPort](_00AF).|
|[SetOPen](libs/graphics/SetOPen)|Change the Area OutLine pen and turn on Outlinemode for areafills.|
|[SetRast](libs/graphics/SetRast)|SetRast - Set an entire drawing area to a specified color.|
|[SetRGB4](libs/graphics/SetRGB4)|Set one color register for this viewport.|
|[SetRGB4CM](libs/graphics/SetRGB4CM)|Set one color register for this [ColorMap](_00B8).|
|[SetSoftStyle](libs/graphics/SetSoftStyle)|Set the soft style of the current font.|
|[SortGList](libs/graphics/SortGList)|Sort the current gel list, ordering its y,x coordinates.|
|[StripFont](libs/graphics/StripFont)|remove the tf_Extension from a font (V36)|
|[SyncSBitMap](libs/graphics/SyncSBitMap)|Syncronize Super [BitMap](_00A6) with whatever isin the standard [Layer](_00A1) bounds.|
|[Text](libs/graphics/Text)|Write text characters (no formatting).|
|[TextExtent](libs/graphics/TextExtent)|Determine raster extent of text data. (V36)|
|[TextFit](libs/graphics/TextFit)|TextFit - count characters that will fit in a given extent (V36)|
|[TextLength](libs/graphics/TextLength)|Determine raster length of text data.|
|[UnlockLayerRom](libs/graphics/UnlockLayerRom)|Unlock [Layer](_00A1) structure by rom(gfx lib) code.|
|[VBeamPos](libs/graphics/VBeamPos)|Get vertical beam position at this instant.|
|[VideoControl](libs/graphics/VideoControl)|Modify the operation of a ViewPort's [ColorMap](_00B8) (V36)|
|[WaitBlit](libs/graphics/WaitBlit)|Wait for the blitter to be finished before proceedingwith anything else.|
|[WaitBOVP](libs/graphics/WaitBOVP)|Wait till vertical beam reached bottom ofthis viewport.|
|[WaitTOF](libs/graphics/WaitTOF)|Wait for the top of the next video frame.|
|[WeighTAMatch](libs/graphics/WeighTAMatch)|Get a measure of how well two fonts match. (V36)|
|[WritePixel](libs/graphics/WritePixel)|Change the pen num of one specific pixel in aspecified [RastPort](_00AF).|
|[WritePixelArray8](libs/graphics/WritePixelArray8)|write the pen number value of a rectangular arrayof pixels starting at a specified x,y location and continuingthrough to another x,y location within a certain [RastPort](_00AF). (V36)|
|[WritePixelLine8](libs/graphics/WritePixelLine8)|write the pen number value of a horizontal lineof pixels starting at a specified x,y location and continuingright for count pixels. (V36)|
|[XorRectRegion](libs/graphics/XorRectRegion)|Perform 2d XOR operation of rectanglewith region, leaving result in region|
|[XorRegionRegion](libs/graphics/XorRegionRegion)|Perform 2d XOR operation of one regionwith second region, leaving result in second region|

### intuition
| Function | Description |
|:---|:---|
|[ActivateGadget](libs/intuition/ActivateGadget)|Activate a (string or custom) gadget.|
|[ActivateWindow](libs/intuition/ActivateWindow)|Activate an Intuition window.|
|[AddClass](libs/intuition/AddClass)|Make a public class available (V36)|
|[AddGadget](libs/intuition/AddGadget)|Add a gadget to the gadget list of a window.|
|[AddGList](libs/intuition/AddGList)|Add a linked list of gadgets to a window or requester.|
|[AllocRemember](libs/intuition/AllocRemember)|[AllocMem](../exec/AllocMem) with tracking to make freeing easy.|
|[AutoRequest](libs/intuition/AutoRequest)|Automatically build and get response from a requester.|
|[BeginRefresh](libs/intuition/BeginRefresh)|Sets up a window for optimized refreshing.|
|[BuildEasyRequestArgs](libs/intuition/BuildEasyRequestArgs)|Simple creation of system request. (V36)BuildEasyRequest -- Varargs stub for BuildEasyRequestArgs(). (V36)|
|[BuildSysRequest](libs/intuition/BuildSysRequest)|Build and display a system requester.|
|[ChangeWindowBox](libs/intuition/ChangeWindowBox)|Change window position and dimensions. (V36)|
|[ClearDMRequest](libs/intuition/ClearDMRequest)|Clear (detaches) the DMRequest of the window.|
|[ClearMenuStrip](libs/intuition/ClearMenuStrip)|Clear (detach) the menu strip from the window.|
|[ClearPointer](libs/intuition/ClearPointer)|Clear the mouse pointer definition from a window.|
|[CloseScreen](libs/intuition/CloseScreen)|Close an Intuition screen.|
|[CloseWindow](libs/intuition/CloseWindow)|Close an Intuition window.|
|[CloseWorkBench](libs/intuition/CloseWorkBench)|Closes the Workbench screen.|
|[CurrentTime](libs/intuition/CurrentTime)|Get the current time values.|
|[DisplayAlert](libs/intuition/DisplayAlert)|Create the display of an alert message.|
|[DisplayBeep](libs/intuition/DisplayBeep)|Flash the video display.|
|[DisposeObject](libs/intuition/DisposeObject)|Deletes a 'boopsi' object. (V36)|
|[DoubleClick](libs/intuition/DoubleClick)|Test two time values for double-click timing.|
|[DrawBorder](libs/intuition/DrawBorder)|Draw the specified [Border](_00D4) structure into a [RastPort](_00AF).|
|[DrawImage](libs/intuition/DrawImage)|Draw the specified [Image](_00D4) structure into a [RastPort](_00AF).|
|[DrawImageState](libs/intuition/DrawImageState)|Draw an (extended) Intuition [Image](_00D4) withspecial visual state. (V36)|
|[EasyRequestArgs](libs/intuition/EasyRequestArgs)|Easy alternative to [AutoRequest](AutoRequest). (V36)EasyRequest -- Varargs stub for EasyRequestArgs(). (V36)|
|[EndRefresh](libs/intuition/EndRefresh)|End the optimized refresh state of the window.|
|[EndRequest](libs/intuition/EndRequest)|Remove a currently active requester.|
|[EraseImage](libs/intuition/EraseImage)|Erases an [Image](_00D4). (V36)|
|[FreeClass](libs/intuition/FreeClass)|Frees a boopsi class created by [MakeClass](MakeClass). (V36)|
|[FreeRemember](libs/intuition/FreeRemember)|Free memory allocated by calls to [AllocRemember](AllocRemember).|
|[FreeScreenDrawInfo](libs/intuition/FreeScreenDrawInfo)|Finish using a [DrawInfo](_00DD) structure. (V36)|
|[FreeSysRequest](libs/intuition/FreeSysRequest)|Free resources gotten by a call to [BuildSysRequest](BuildSysRequest).|
|[GadgetMouse](libs/intuition/GadgetMouse)|Calculate gadget-relative mouse position. (V36)|
|[GetAttr](libs/intuition/GetAttr)|Inquire the value of some attribute of an object. (V36)|
|[GetDefaultPubScreen](libs/intuition/GetDefaultPubScreen)|Get name of default public screen. (V36)|
|[GetDefPrefs](libs/intuition/GetDefPrefs)|Get a copy of the the Intuition default [Preferences](_00D5).|
|[GetPrefs](libs/intuition/GetPrefs)|Get the current Intuition [Preferences](_00D5) structure.|
|[GetScreenData](libs/intuition/GetScreenData)|Get copy of a screen data structure.|
|[GetScreenDrawInfo](libs/intuition/GetScreenDrawInfo)|Get pointer to rendering information. (V36)|
|[InitRequester](libs/intuition/InitRequester)|Initialize a [Requester](_00D4) structure.|
|[IntuiTextLength](libs/intuition/IntuiTextLength)|Return the length (pixel-width) of an [IntuiText](_00D4).|
|[ItemAddress](libs/intuition/ItemAddress)|Returns the address of the specified [MenuItem](_00D4).|
|[LockIBase](libs/intuition/LockIBase)|Invoke semaphore arbitration of [IntuitionBase](_00DC).|
|[LockPubScreen](libs/intuition/LockPubScreen)|Prevent a public screen from closing. (V36)|
|[LockPubScreenList](libs/intuition/LockPubScreenList)|Prevent changes to the system list. (V36)|
|[MakeClass](libs/intuition/MakeClass)|Create and initialize a boopsi class. (V36)|
|[MakeScreen](libs/intuition/MakeScreen)|Do an Intuition-integrated [MakeVPort](../graphics/MakeVPort) of a screen.|
|[ModifyIDCMP](libs/intuition/ModifyIDCMP)|Modify the state of a window's IDCMPFlags.|
|[ModifyProp](libs/intuition/ModifyProp)|Modify the current parameters of a proportional gadget.|
|[MoveScreen](libs/intuition/MoveScreen)|Attempt to move the screen by the increments provided.|
|[MoveWindow](libs/intuition/MoveWindow)|Ask Intuition to move a window.|
|[MoveWindowInFrontOf](libs/intuition/MoveWindowInFrontOf)|Arrange the relative depth of a window. (V36)|
|[NewModifyProp](libs/intuition/NewModifyProp)|[ModifyProp](ModifyProp), but with selective refresh.|
|[NewObject](libs/intuition/NewObject)|Create an object from a class. (V36)NewObject -- Varargs stub for NewObjectA(). (V36)|
|[NextObject](libs/intuition/NextObject)|iterate through the object on an Exec list. (V36)|
|[NextPubScreen](libs/intuition/NextPubScreen)|Identify next public screen in the cycle. (V36)|
|[ObtainGIRPort](libs/intuition/ObtainGIRPort)|Set up a [RastPort](_00AF) for a custom gadget. (V36)|
|[OffGadget](libs/intuition/OffGadget)|Disable the specified gadget.|
|[OffMenu](libs/intuition/OffMenu)|Disable the given menu or menu item.|
|[OnGadget](libs/intuition/OnGadget)|Enable the specified gadget.|
|[OnMenu](libs/intuition/OnMenu)|Enable the given menu or menu item.|
|[OpenScreen](libs/intuition/OpenScreen)|Open an Intuition screen.|
|[OpenScreenTagList](libs/intuition/OpenScreenTagList)|[OpenScreen](OpenScreen) with [TagItem](_012E) extension array. (V36)OpenScreenTags -- Varargs stub for OpenScreenTagList. (V36)|
|[OpenWindow](libs/intuition/OpenWindow)|Open an Intuition window.|
|[OpenWindowTagList](libs/intuition/OpenWindowTagList)|[OpenWindow](OpenWindow) with [TagItem](_012E) extension. (V36)OpenWindowTags -- Varargs stub for OpenWindowTagList (V36)|
|[OpenWorkBench](libs/intuition/OpenWorkBench)|Open the Workbench screen.|
|[PointInImage](libs/intuition/PointInImage)|Tests whether an image &#034;contains&#034; a point. (V36)|
|[PrintIText](libs/intuition/PrintIText)|Print text described by the [IntuiText](_00D4) argument.|
|[PubScreenStatus](libs/intuition/PubScreenStatus)|Change status flags for a public screen. (V36)|
|[QueryOverscan](libs/intuition/QueryOverscan)|Inquire about a standard overscan region. (V36)|
|[RefreshGadgets](libs/intuition/RefreshGadgets)|Refresh (redraw) the gadget display.|
|[RefreshGList](libs/intuition/RefreshGList)|Refresh (redraw) a chosen number of gadgets.|
|[RefreshWindowFrame](libs/intuition/RefreshWindowFrame)|Ask Intuition to redraw your window border.|
|[ReleaseGIRPort](libs/intuition/ReleaseGIRPort)|Release a custom gadget [RastPort](_00AF). (V36)|
|[RemakeDisplay](libs/intuition/RemakeDisplay)|Remake the entire Intuition display.|
|[RemoveClass](libs/intuition/RemoveClass)|Make a public boopsi class unavailable. (V36)|
|[RemoveGadget](libs/intuition/RemoveGadget)|Remove a gadget from a window.|
|[RemoveGList](libs/intuition/RemoveGList)|Remove a sublist of gadgets from a window.|
|[ReportMouse](libs/intuition/ReportMouse)|Tell Intuition whether to report mouse movement.|
|[Request](libs/intuition/Request)|Activate a requester.|
|[ResetMenuStrip](libs/intuition/ResetMenuStrip)|Re-attach a menu strip to a window. (V36)|
|[RethinkDisplay](libs/intuition/RethinkDisplay)|Grand manipulation of the entire Intuition display.|
|[ScreenToBack](libs/intuition/ScreenToBack)|Send the specified screen to the back of the display.|
|[ScreenToFront](libs/intuition/ScreenToFront)|Make the specified screen the frontmost.|
|[SetAttrsA](libs/intuition/SetAttrsA)|Specify attribute values for an object. (V36)SetAttrs -- Varargs stub for SetAttrsA(). (V36)|
|[SetDefaultPubScreen](libs/intuition/SetDefaultPubScreen)|Choose a new default public screen. (V36)|
|[SetDMRequest](libs/intuition/SetDMRequest)|Set the DMRequest of a window.|
|[SetEditHook](libs/intuition/SetEditHook)|Set global processing for string gadgets. (V36)|
|[SetGadgetAttrsA](libs/intuition/SetGadgetAttrsA)|Specify attribute values for a boopsi gadget. (V36)SetGadgetAttrs -- Varargs stub for SetGadgetAttrsA(). (V36)|
|[SetMenuStrip](libs/intuition/SetMenuStrip)|Attach a menu strip to a window.|
|[SetMouseQueue](libs/intuition/SetMouseQueue)|Change limit on pending mouse messages. (V36)|
|[SetPointer](libs/intuition/SetPointer)|Specify a pointer sprite image for a window.|
|[SetPrefs](libs/intuition/SetPrefs)|Set Intuition preferences data.|
|[SetPubScreenModes](libs/intuition/SetPubScreenModes)|Establish global public screen behavior. (V36)|
|[SetWindowTitles](libs/intuition/SetWindowTitles)|Set the window's titles for both window and screen.|
|[ShowTitle](libs/intuition/ShowTitle)|Set the screen title bar display mode.|
|[SizeWindow](libs/intuition/SizeWindow)|Ask Intuition to size a window.|
|[SysReqHandler](libs/intuition/SysReqHandler)|Handle system requester input. (V36)|
|[UnlockIBase](libs/intuition/UnlockIBase)|Surrender an Intuition lock gotten by [LockIBase](LockIBase).|
|[UnlockPubScreen](libs/intuition/UnlockPubScreen)|Release lock on a public screen. (V36)|
|[UnlockPubScreenList](libs/intuition/UnlockPubScreenList)|Release public screen list semaphore. (V36)|
|[ViewAddress](libs/intuition/ViewAddress)|Return the address of the Intuition [View](_00B8) structure.|
|[ViewPortAddress](libs/intuition/ViewPortAddress)|Return the address of a window's viewport.|
|[WBenchToBack](libs/intuition/WBenchToBack)|Send the Workbench screen in back of all screens.|
|[WBenchToFront](libs/intuition/WBenchToFront)|Bring the Workbench screen in front of all screens.|
|[WindowLimits](libs/intuition/WindowLimits)|Set the minimum and maximum limits of a window.|
|[WindowToBack](libs/intuition/WindowToBack)|Ask Intuition to send a window behind others.|
|[WindowToFront](libs/intuition/WindowToFront)|Ask Intuition to bring a window to the front.|
|[ZipWindow](libs/intuition/ZipWindow)|Change window to &#034;alternate&#034; position anddimensions. (V36)|


## Licences
The amiga libraries ara part of development tools of Commodore Amiga Incorporated licenceced by (Cloanto Coporation)[https://cloanto.com]
These files are made available here free of charge for learning purpose and without the intention of doing any harm.
Please contact the extension developper to discuss any issues.