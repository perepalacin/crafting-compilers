#ifndef clox_chunk_h
#define clox_chunk_h
#include "common.h"

typedef enum
{
    OP_RETURN,
} OpCode;

typedef struct
{
    int count;
    int size;
    uint8_t *code;
} Chunk;

#endif