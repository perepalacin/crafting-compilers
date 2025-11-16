#ifndef clox_memory_h
#define clox_memory_h

#include "../common/common.h"
#include "../object/object.h"

#define ALLOCATE(type, count) (type *)reallocate(NULL, 0, sizeof(type) * (count))

#define FREE(type, pointer) reallocate(pointer, sizeof(type), 0)

#define GROW_CAPACITY(capacity) ((capacity) < 8 ? 8 : (capacity) * 2)

#define GROW_ARRAY(type, pointer, oldCount, newCount)                                              \
    (type *)reallocate(pointer, (oldCount) * sizeof(type), (newCount) * sizeof(type))

#define FREE_ARRAY(type, pointer, oldCount) reallocate(pointer, sizeof(type) * (oldCount), 0)

void *reallocate(void *pointer, size_t oldSize, size_t newSize);
void freeObjects(void);

#endif
