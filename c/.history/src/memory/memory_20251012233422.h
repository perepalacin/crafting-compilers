#ifndef clox_memory_h
#define clox_memory_h

#include "../common/common.h"

#endif

#define GROW_CAPACITY(capacity) \
    ((capacity) < 8 ? 8 : (capacity) * 2)
