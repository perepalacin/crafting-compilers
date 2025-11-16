# C Project Development Setup Guide

Complete guide for setting up my C development environment on macOS with VSCode.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [VSCode Extensions](#vscode-extensions)
- [Configuration Files](#configuration-files)
- [Compiler Flags Explained](#compiler-flags-explained)
- [Optional Tools](#optional-tools)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

1. **Xcode Command Line Tools** (includes GCC/Clang)
   ```bash
   xcode-select --install
   ```

2. **Homebrew** (if not already installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Visual Studio Code**
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## VSCode Extensions

### Required Extensions

Install these extensions in VSCode (Cmd+Shift+X):

1. **C/C++** by Microsoft
   - Extension ID: `ms-vscode.cpptools`
   - Provides IntelliSense, debugging, and code browsing

2. **C/C++ Extension Pack** by Microsoft (optional but recommended)
   - Extension ID: `ms-vscode.cpptools-extension-pack`
   - Includes additional helpful tools

### Install via Command Line (Optional)

```bash
code --install-extension ms-vscode.cpptools
code --install-extension ms-vscode.cpptools-extension-pack
```

## Configuration Files

### 1. Create `.vscode/c_cpp_properties.json`

This configures IntelliSense and code analysis:

```json
{
    "configurations": [
        {
            "name": "Mac",
            "includePath": [
                "${workspaceFolder}/**",
                "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include"
            ],
            "defines": [],
            "compilerPath": "/usr/bin/gcc",
            "cStandard": "c99",
            "cppStandard": "c++17",
            "intelliSenseMode": "macos-gcc-arm64",
            "compilerArgs": [
                "-Wall",
                "-Wextra",
                "-Wpedantic",
                "-Wunused",
                "-Wuninitialized",
                "-Wmissing-prototypes",
                "-Wstrict-prototypes",
                "-Wimplicit-function-declaration",
                "-Wreturn-type",
                "-Wshadow"
            ]
        }
    ],
    "version": 4
}
```

### 2. Create `.vscode/settings.json`

This configures editor behavior and additional analysis:

```json
{
    "files.associations": {
        "*.h": "c",
        "*.c": "c"
    },
    "editor.formatOnSave": true,
    "editor.rulers": [80, 100],
    "C_Cpp.clang_format_fallbackStyle": "{ BasedOnStyle: LLVM, IndentWidth: 4, ColumnLimit: 100 }",
    "C_Cpp.errorSquiggles": "enabled",
    "C_Cpp.codeAnalysis.clangTidy.enabled": true,
    "C_Cpp.default.compilerPath": "/usr/bin/gcc",
    "C_Cpp.default.intelliSenseMode": "macos-gcc-arm64",
    "C_Cpp.default.browse.databaseFilename": "${workspaceFolder}/.vscode/browse.db",
    "C_Cpp.intelliSenseCachePath": "${workspaceFolder}/.vscode"
}
```

### 3. Create `Makefile`

Makefile with automatic dependency detection:

```makefile
# --- Configuration ---
TARGET := app
CC := gcc
CFLAGS := -Wall -Wextra -Wpedantic -std=c99 \
          -Wunused -Wuninitialized -Wmissing-prototypes \
          -Wstrict-prototypes -Wimplicit-function-declaration \
          -Wreturn-type -Wshadow -Wpointer-arith \
          -Wcast-qual -Wwrite-strings
LDFLAGS := 

# --- Directory Setup ---
SRC_DIR := src
OBJ_DIR := obj

# --- Source and Object Discovery ---
# Recursively find all .c files in src/
SOURCES := $(shell find $(SRC_DIR) -name "*.c")

# Convert source files to object files, preserving directory structure
# Example: src/chunk/chunk.c -> obj/chunk/chunk.o
OBJECTS := $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SOURCES))

# --- Include Paths ---
# Find all directories containing headers and add them to include path
INCLUDE_DIRS := $(sort $(dir $(shell find $(SRC_DIR) -name "*.h")))
CFLAGS += $(patsubst %,-I%,$(INCLUDE_DIRS))

# --- Targets ---

.PHONY: all
all: $(TARGET)

# Link object files into final executable
$(TARGET): $(OBJECTS)
	@echo "Linking $@"
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@

# Compile each .c file into a .o file
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	@echo "Compiling $<"
	$(CC) $(CFLAGS) -c $< -o $@

# Run the compiled executable
.PHONY: run
run: $(TARGET)
	@echo "Running $(TARGET)..."
	./$(TARGET)

# Run with a file argument
FILE ?= ./test-file
.PHONY: run-file
run-file: $(TARGET)
	@echo "Running $(TARGET) with file: $(FILE)..."
	./$(TARGET) $(FILE)

# Clean up generated files
.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -f $(TARGET)
	@rm -rf $(OBJ_DIR)

# Rebuild everything from scratch
.PHONY: rebuild
rebuild: clean all
```

### 4. Create `.gitignore`

Prevents committing build artifacts and cache files:

```gitignore
# Build artifacts
obj/
app
*.o
*.out
*.dSYM/

# IDE/Editor files
.vscode/*
!.vscode/settings.json
!.vscode/c_cpp_properties.json
!.vscode/tasks.json
!.vscode/launch.json
.DS_Store

# C/C++ extension cache
.cache/
cache/
.vscode/.browse.c_cpp.db*
.vscode/ipch/
.vscode/browse.db*

# clangd cache (if using)
.clangd/
compile_commands.json
```

## Compiler Flags Explained

### Error Detection Flags

| Flag | Purpose |
|------|---------|
| `-Wall` | Enables all common warnings |
| `-Wextra` | Enables extra warnings not covered by `-Wall` |
| `-Wpedantic` | Enforces strict ISO C compliance |
| `-Werror` | **(Optional)** Treats all warnings as errors |

### Code Quality Flags

| Flag | Purpose |
|------|---------|
| `-Wunused` | Warns about unused variables, functions, parameters |
| `-Wuninitialized` | Warns about uninitialized variables |
| `-Wshadow` | Warns when variable declarations shadow others |
| `-Wpointer-arith` | Warns about suspicious pointer arithmetic |
| `-Wcast-qual` | Warns about casts that remove type qualifiers |
| `-Wwrite-strings` | Warns about writing to string literals |

### Function-Related Flags

| Flag | Purpose |
|------|---------|
| `-Wmissing-prototypes` | Warns about global functions without prototypes |
| `-Wstrict-prototypes` | Warns about old-style function declarations |
| `-Wimplicit-function-declaration` | Warns about using undeclared functions |
| `-Wreturn-type` | Warns about functions that should return a value but don't |

### Standard Flag

| Flag | Purpose |
|------|---------|
| `-std=c99` | Compiles code according to C99 standard |

### Why These Flags Matter

These flags help catch common bugs at compile time:
- Memory issues (uninitialized variables)
- Type safety problems (implicit conversions)
- Logic errors (missing returns, unused code)
- Portability issues (non-standard code)

### Adding `-Werror` (Optional)

To make your build stricter, add `-Werror` to treat warnings as errors:

```makefile
CFLAGS := -Wall -Wextra -Wpedantic -Werror -std=c99 ...
```

This prevents compilation if any warnings exist, enforcing clean code.

## Optional Tools

### Bear - Generate Compile Commands

Bear generates `compile_commands.json` for better IDE integration:

```bash
# Install bear
brew install bear

# Generate compile commands
bear -- make clean
bear -- make
```

This creates `compile_commands.json` which helps clangd and other tools understand your project structure.

### clangd - Enhanced Language Server (Alternative to C/C++ Extension)

For even better code analysis and performance:

```bash
# Install clangd
brew install llvm
```

Install the clangd VSCode extension:
```bash
code --install-extension llvm-vs-code-extensions.vscode-clangd
```

Update `.vscode/settings.json` to use clangd:
```json
{
    "clangd.arguments": [
        "--compile-commands-dir=${workspaceFolder}",
        "--background-index",
        "--clang-tidy",
        "--completion-style=detailed",
        "--header-insertion=iwyu",
        "--query-driver=/usr/bin/gcc",
        "--pch-storage=memory"
    ],
    "C_Cpp.intelliSenseEngine": "disabled"
}
```

**Note:** clangd requires `compile_commands.json` (generated by bear).

## Usage

### Basic Commands

```bash
# Build the project
make

# Build and run
make run

# Run with a file argument
make run-file FILE=./test.txt

# Clean build artifacts
make clean

# Rebuild from scratch
make rebuild
```

### Warnings in System Headers

If you see warnings in system headers (like `stdio.h`), you can suppress them:

```makefile
CFLAGS := -Wall -Wextra -Wpedantic -std=c99 -Wno-system-headers ...
```

### VSCode Not Showing Warnings

1. Check that C/C++ extension is installed and enabled
2. Reload VSCode: Cmd+Shift+P → "Reload Window"
3. Verify `.vscode/c_cpp_properties.json` exists
4. Check VSCode Output panel: View → Output → Select "C/C++" from dropdown

### GCC vs Clang on macOS

macOS aliases `gcc` to `clang`. To verify:
```bash
gcc --version  # Shows "Apple clang version..."
```

This is fine! Apple's clang supports the same flags.

To use actual GCC (if needed):
```bash
brew install gcc
# Then update Makefile: CC := gcc-13  (or whatever version)
```

## Testing Your Setup

Create a test file with deliberate errors:

```c
// src/test.c
#include <stdio.h>

void badFunction() {  // Missing (void)
    int x;            // Uninitialized
    printf("%d\n", x);
    return;
}

int main() {
    int unused;       // Unused variable
    badFunction();
    // Missing return statement
}
```

You should see:
- Red squiggles in VSCode under each issue
- Compilation errors/warnings when running `make`

## Additional Resources

- [C99 Standard Reference](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf)
- [GCC Warning Options](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html)
- [Clang Documentation](https://clang.llvm.org/docs/)
- [VSCode C/C++ Documentation](https://code.visualstudio.com/docs/languages/cpp)

## Quick Setup Checklist

- [ ] Install Xcode Command Line Tools
- [ ] Install VSCode
- [ ] Install C/C++ extension
- [ ] Create `.vscode/c_cpp_properties.json`
- [ ] Create `.vscode/settings.json`
- [ ] Create `Makefile`
- [ ] Create `.gitignore`
- [ ] Run `make` to test
- [ ] Verify warnings appear in VSCode

## License

Feel free to use this setup in your own projects!

---

**Note:** This guide is optimized for **macOS with Apple Silicon (M1/M2/M3)**. For Intel Macs, change `macos-gcc-arm64` to `macos-gcc-x64` in the configuration files.