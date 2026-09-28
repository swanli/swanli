---
title: "Misc Notes"
description: "Misc notes these can't be classified to a specific topic"
pubDatetime: 2026-04-02T20:37:19Z
draft: true
heroImage: "../../../assets/images/blog-placeholder-1.jpg"
---

```julia
using BenchmarkTools

mysin(x::Float64) = sin(x)
@assert mysin(1.0) == sin(1.0)
const mysin_ci = Base.specialize_method(Base._which(Tuple{typeof(mysin), Float64})).cache
@btime invoke(mysin, mysin_ci, x) setup=(x=rand())
```

```
0.7049483800155094
```
