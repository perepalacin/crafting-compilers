#ifndef clox_compiler_h
#define clox_compiler_h

#include "../chunk/chunk.h"
#include "../object/object.h"
#include "../scanner/scanner.h"
#include "../vm/vm.h"

#ifdef DEBUG_PRINT_CODE
#include "../debug/debug.h"
#endif

bool compile(const char *source, Chunk *chunk);

#endif
