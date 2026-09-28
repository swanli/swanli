---
title: 'Trace Compile'
description: 'The trace-compile capabilities provide a convenient way to track what the compiler is
working on as you ecnounter new methods during runtime.'
pubDatetime: 2026-04-02T11:37:19Z
draft: true
heroImage: '../../../assets/images/blog-placeholder-1.jpg'
---
```shell
julia --start=no --trace-compile=stderr --trace-compile-timing -e "using InteractiveUtils; @time @time_imports using Plots"
```
