# Xcode Build Settings

A convenient reference of available build settings for Xcode projects.

For more information, see [this NSHipster article](https://nshipster.com/xcconfig/).

## Methodology

This website automatically generates its content
from information found in Xcode configuration files.
If you have Xcode installed locally,
you can locate these files by running the following command in the Terminal:

```terminal
$ find /Applications/Xcode.app/Contents/PlugIns/Xcode3Core.ideplugin \
    -iname "*.xcspec" -o \
    -iname "*.strings"
Plug-ins/Clang LLVM 1.0.xcplugin/Contents/Resources/Default Compiler.xcspec
# ...
```

### Detailed Design

Xcode delegates much of its functionality across several plug-ins.
Although few details about them are made available publicly,
you could make a reasonable guess based on their name and content.

One of the more significant-looking Xcode plugins is one called
`Xcode3Core.ideplugin`,
which appears to handle details about the build system.
If you look inside,
you'll find that this plugin itself comprises several plugins,
each named for a familiar technology.

If you peer still deeper into any of these —
`Metal.xcplugin`, for example —
you'll find `.xcspec` and `.strings` files.

An `.xcspec` file is a property list containing details about
a compiler that's made available to the Xcode build system:

```plist
(
	{
		Type = Compiler;
		Identifier = "com.apple.compilers.metal";
		Name = "Metal Compiler";
		Description = "Compiles Metal files";
		CommandLine = "metal -c [options] [inputs]";
		RuleName = "CompileMetalFile [input]";
		ExecDescription = "Compile $(InputFile)";
		ProgressDescription = "Compiling $(CommandProgressByType) Metal files";
		InputFileTypes = (
			"sourcecode.metal",
		);
		Outputs = (
			"$(MTLCOMPILER_OUTPUT_FILE)",
		);
// ...
```

Also in this list are all the available build settings,
including information about what kind of values can be passed
and how they map to command-line arguments passed to the compiler:

```plist
{
    Name = "MTL_FAST_MATH";
    Type = Bool;
    DefaultValue = YES;
    Category = BuildOptions;
    CommandLineArgs = {
        YES = (
            "-ffast-math",
        );
        NO = (
            "-fno-fast-math",
        );
    };
}
```

Some `.xcspec` files have accompanying `.strings` files
containing more human-readable descriptions of the build settings:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Description</key>
	<string>Metal Compiler</string>
	<key>Name</key>
	<string>Metal Compiler</string>
	<key>Vendor</key>
	<string>Apple</string>
	<key>Version</key>
	<string>Default</string>
	<key>[BuildOptions]-category</key>
	<string>Build Options</string>
	<key>[MTL_COMPILER_FLAGS]-description</key>
    <string>Space-separated list of compiler flags</string>
    <!--- ... -->
```

This website combines these information sources
to provide a single, coherant representation
that can be readily searched and consulted.

## Contact

Follow NSHipster on Twitter
([@NSHipster](https://twitter.com/NSHipster))

## License

All code is published under the
[MIT License](https://opensource.org/licenses/MIT).

All content copyright © 2020 Apple Inc. All rights reserved.

NSHipster® and the NSHipster Logo
are registered trademarks of Read Evaluate Press, LLC.

Core ML®, Metal®, OpenCL®, Siri®, Swift™, Xcode® and their respective logos
are trademarks of Apple Inc.
