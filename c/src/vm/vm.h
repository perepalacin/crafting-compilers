#ifndef clox_vh_h
#define clox_vh_h

#include <stdio.h>

#include "../chunk/chunk.h"
#include "../table/table.h"
#include "../value/value.h"

#define STACK_MAX 256

typedef struct {
    Chunk *chunk;
    uint8_t *ip;
    Value stack[STACK_MAX];
    Value *stackTop;
    Table globals;
    Table strings;
    Obj *objects;
} VM;

typedef enum {
    INTERPRET_OK,
    INTERPRET_COMPILE_ERROR,
    INTERPRET_RUNTIME_ERROR,
} InterpretResult;

extern VM vm;

void initVM(void);
void freeVM(void);
InterpretResult interpret(const char *source);
void push(Value value);
Value pop(void);

#endif
