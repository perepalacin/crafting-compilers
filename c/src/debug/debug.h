#ifndef clox_debug_h
#define clox_debug_h

#include "../chunk/chunk.h"
#include "../value/value.h"

void disassembleChunk(Chunk *chunk, const char *name);
int disassembleInstruction(Chunk *chunk, int offset);

#endif