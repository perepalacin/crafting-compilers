#ifndef clox_compiler_h
#define clox_compiler_h

#include "../vm/vm.h"
#include "../chunk/chunk.h"
#include "../scanner/scanner.h"

#ifdef DEBUG_PRINT_CODE
#include "../debug/debug.h"
#endif

bool compile(const char *source, Chunk *chunk);
Token scanToken();

#endif