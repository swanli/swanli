---
title: "Numerical Basic"
description: "Here is a sample of bifurcation."
pubDatetime: 2026-01-16T05:17:19Z
draft: true
heroImage: "../../../assets/images/blog-placeholder-1.jpg"
---

## Floating-point numbers

The set $\mathbb{F}$ of **floating-point** numbers consists of zero and all numbers of the form
$\pm(1+f)\times 2^n$ where n is an integer called the **exponent**, and $1+f$ is the **mantissa**
or **significand**, in which $=\sum_{i=1}^{d}b_i 2^{-i}, b_i\in {0,1}$. For a fixed integer d
called the binary **precision**. So the mantissa $(1+f)$ represents as a number in
$[1, 2)$ or $[2^0, 2^1)$ and there are exactly $2^d$` evenly spaced numbers.

## Machine epsilon

The smallest element of $\mathbb{F}$ that is greater than 1 is $1+2^{-d}$, and we call the difference
_machine epsilon_ $\epsilon = 2^{-d}$.

We define the rounding function $fl(x)$ as the map from real number $x$ to the nearest member of
$\mathbb{F}$, which leads to the bound

$$
\frac{fl(x)-x}{|x|}\leq\frac{2^{n-d-1}}{2^n}\leq\frac{1}{2}\epsilon_{\text{mach}}
$$

## Subtractive cancellation

Loss of significance.

## Condition numbers

The ratio of the relative changes(error) in result and data.

Condition numbers can be used to estimate erros

$$
\left|\frac{f(x+\epsilon x)-f(x)}{f(x)}\right|\approx\mathcal{k}_f(x)\epsilon
$$

We call a problem **poorly-conditioned** or **ill-conditioned** when $\mathcal{k}_f(x)$ is large.

For a linear system:

$$
\begin{eqnarray}
A(x+\vartriangle x)=b+\vartriangle b \\
x+\vartriangle x=A^{-1}(b+\vartriangle b)=A^{-1}b+A^{-1}\vartriangle b \\
\vartriangle x= A^{-1}\vartriangle b
\end{eqnarray}
$$

> "Matrix condition number -- NOTE NOT Worked YET"
> The **matrix condition number** of an invertible square matrix $\mathbf{A}$ is
> $\mathcal{k}(\mathbf{A})=||\mathbf{A}^{-1}||\; ||\mathbf{A}||$

## Stability, residual and back errors

If an algorithm always produces small backward errors, then it is stable. But the converse is
not always true: some stable algorithms may produce a large backward error.

## Flop counting

flops: floating-point operations

## Significant Digits of Precision

Significant digits are digits beginning with the leftmost nonzero digit and ending with the
rightmost correct digit, including final zeros that are excact.

Lesson learned: Data thought to be accurate should be carried with full precision and not be
rounded prior to each of the calculations.

In adding and substracting numbers, the result is accute only to the smallest number of
significant digits used in any step of the calculation. In multiplication and division of
numbers, the results may be even more _misleading_.

## Errors: Absolute and Relative

The **absolute error** of β as an approximation to α is $|α-β|$. The **relative error** of β as
an approximation to α is $\frac{|α-β|}{|α|}$.

## Accuracy and Precision

**Accurate to n decimal places** means that you can trust n digits to the right of the decimal
place. Accurate to n significant digits means that you can trust a total of n digits as being
meanningful beginning with the leftmost nonzero digit.

## Rounding and Chopping

**Rounding** reduces the number of significant digits in a number.

**Chopped to n digits** or figures when all digits that follow the nth digit are discarded and
none of the remaiding n digits are changed.

# Horner's Algorithm (Synthetic division)

Horner's algorithm can be used in the **deflation** of a polynomial.

$$
\begin{eqnarray}
p(x)=(x-r)q(x)+p(r)\\
p'(x)=q(x)+(x-r)q'(x)\\
p'(r)=q(r)
\end{eqnarray}
$$

## Taylor Series

A Taylor series converges rapidly near the point of expansion and slowly (or not at all)
at more remote points.

**Taylor series** of f at the point c. In the special case $c=0$, the Formal Taylor series is also
called a **Maclaurin series**.

$$
f(x)\sim \sum_{k=0}{\infty}\frac{f^{(k)}(c)}{k!}(x-c)^k
$$

#$ Bifurcation Analysis

Based on [BifurcationKit](https://github.com/bifurcationkit/BifurcationKit.jl)

## An Introduction to the Conjugate Gradient Method Without the Agonizing Pain

Base on [A github notebook](https://github.com/vschaik/Conjugate-Gradient) and the
[book](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf)

### Introduction

CG is the most popular iterative method for solving large systems of linear equations.
CG is effective for systems of the form: `\mathbf{A}\mathbf{x}=\mathbf{b}`.

```julia
using Plots

# Quadratic form
quadratic(x, A, b, c) = 0.5 * x' * A * x - b' * x + c

# A simple sample problem
function simpledemo()
    A = [3 2; 2 6]
    b = [2; -8]
    c = 0
    x1 = collect(range(-4, 6, length = 100))
    x2 = collect(range(-6, 4, length = 100))
    x = [[i, j] for j in x2, i in x1]
    x2a = [(2-3x)/2 for x in x1]
    x2b = [(-8-2x)/6 for x in x1]
    z = [quadratic(xe, A, b, c) for xe in x]
#  surface(collect(x1), collect(x2), collect(z), xlabel = "x1", ylabel = "x2", zlabel = "f(x)")
    contour(x1, x2, z)
    plot!(x1, x2a, color = :blue)
    plot!(x1, x2b, color = :green)
end
```

```
simpledemo (generic function with 1 method)
```

## Krylov

### Example

```julia
using Krylov, MatrixMarket, SuiteSparseMatrixCollection
using LinearAlgebra, Printf

ssmc = ssmc_db(verbose=false)
matrix = ssmc_matrices(ssmc, "HB", "bcsstk09")
path = fetch_ssmc(matrix, format = "MM")

n = matrix.nrows[1]
A = MatrixMarket.mmread(joinpath(path[1], "bcsstk09.mtx"))
b = ones(n)
b_norm = norm(b)

# Solve Ax = b.
(x, stats) = cg(A, b)
r = b - A * x
relres = norm(r) / b_norm
```

## Conjugate direction method

Conjugate direction methods can be regarded as being tetween the method of steepest descent
(first-order method that uses gradient) and Newton's method(second-order method uses Hessian
as well)

## General Arnoldi method

## Direct Lanczos method

## Conjugate gradient method

The conjugate gradient method can be seen as a special case of the conjugate direction method
applied to minimization of the quadratic function. It can also be seen as a variant of the
Arnoldi/Lanczos iteration applied to solving linear systems. It can be seen from imposing
orthogonality and conjugacy.

## Line search methods for nonquadratic functions

### Fletcher-Reeves method

### Polak-Ribiere method

## Linear stability analysis

$x_*$ is fixed point, then $x_* = f(x_*)$
