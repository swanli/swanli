---
title: 'Learning Curves'
description: 'Here is a sample of bifurcation.'
pubDatetime: 2026-01-15T05:17:19Z
draft: true
heroImage: '../../../assets/images/blog-placeholder-1.jpg'
---

```julia
using MLJ, Plots

X, y = @load_boston

atom = (@load RidgeRegressor pkg = MLJLinearModels)()
ensemble = EnsembleModel(model = atom, n = 1000)
mach = machine(ensemble, X, y)
rl = range(ensemble, :(model.lambda), lower = 1e-1, upper = 100, scale = :log10)
curve = MLJ.learning_curve(mach; range = rl, resampling = CV(nfolds = 3), measure = l1)
plot(curve.parameter_values,
     curve.measurements,
     xlab=curve.parameter_name,
     xscale=curve.parameter_scale,
     ylab = "CV estimate of RMS error")
atom.lambda= 7.3
r_n = range(ensemble, :n, lower=1, upper=50)
curves = MLJ.learning_curve(mach;
                            range=r_n,
                            measure=l1,
                            verbosity=0,
                            rng_name=:rng,
                            rngs=4)
plot(curves.parameter_values,
     curves.measurements,
     xlab=curves.parameter_name,
     ylab="Holdout estimate of RMS error")
```
