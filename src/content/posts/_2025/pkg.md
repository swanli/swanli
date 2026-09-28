---
title: "Pkg.jl usage"
description: "Here is a sample of bifurcation."
pubDatetime: 2026-01-17T05:17:19Z
draft: true
heroImage: "../../../assets/images/blog-placeholder-1.jpg"
---

## Find a package from registry

Read a package info from the configed registry

```julia
using Pkg, UUIDs

function get_pkgs_in_general()
    registries = Pkg.Registry.reachable_registries()
    general = registries[findfirst(reg -> reg.uuid == UUID("23338594-aafe-5451-b93e-139f81909106"), registries)]
end

pkgs = get_pkgs_in_general()
pkgid = UUID("e30172f5-a6a5-5a46-863b-614d45cd2de4")

pkg = pkgs[pkgid]
pkg.name
```

```
"Documenter"
```
