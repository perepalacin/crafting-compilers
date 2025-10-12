# --- Configuration ---
TARGET := app
CC := gcc
CFLAGS := -Wall -Wextra -std=c99 
LDFLAGS := 

# --- Directory Setup ---
SRC_DIR := src
OBJ_DIR := obj

# --- Source and Object Discovery ---

# Recursively find all .c files in src/
SOURCES := $(shell find $(SRC_DIR) -name "*.c")

# Convert source file list to object file list, preserving the subdirectory structure
# Example: src/chunk/chunk.c -> obj/chunk/chunk.o
OBJECTS := $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SOURCES))

# Extract all unique object directories (e.g., obj, obj/chunk, obj/memory)
OBJDIRS := $(sort $(dir $(OBJECTS)))

# --- Include Paths ---

# Find all unique directories containing headers and add them to the include path (-I)
INCLUDE_DIRS := $(sort $(dir $(shell find $(SRC_DIR) -name "*.h")))
CFLAGS += $(patsubst %,-I%,$(INCLUDE_DIRS))

# --- Targets ---

.PHONY: all
all: $(TARGET)

# Rule to link object files into the final executable
$(TARGET): $(OBJECTS)
	@echo "Linking $@"
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@

# Rule to create all necessary object subdirectories before compilation starts
# This target is a prerequisite for all object files
$(OBJDIRS):
	@mkdir -p $@

# Rule to compile each .c file into a .o file
# It now depends on the specific object directory being created first.
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJDIRS)
	@echo "Compiling $<"
	$(CC) $(CFLAGS) -c $< -o $@

# Target to run the compiled executable
.PHONY: run
run: $(TARGET)
	@echo "Running $(TARGET)..."
	./$(TARGET)

# Target to clean up generated files
.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -f $(TARGET)
	@rm -rf $(OBJ_DIR)