---
title: 'ML Math'
description: 'Master essential statistics with interactive visualizations.'
pubDatetime: 2026-01-18T05:17:19Z
draft: true
heroImage: '../../../assets/images/blog-placeholder-1.jpg'
---

Explore 15 essential concepts in Statistics designed to build your machine learning mathematical foundation.

[Reference](https://www.tensortonic.com/ml-math)

## Descriptive Statistics

**descriptive statistics** are the tools that allow us to summarize and understand data at a glance.

### The Mean (Average)

$\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i = \frac{x_1+x2+...+x_n}{n}$

The Median (Middle Value)

$$
\mathrm{Media} =
\begin{cases}
x_{\frac{n+1}{2}} & \text{if n is odd}\\
\frac{x_{\frac{n}{2}}+x_{\frac{n}{2}+1}}{2} & \text{if n is even}
\end{cases}
$$

### The Mode (Most Frequent)

The **mode** is the value that appears most frequently in the dataset. A dataset can have no mode, one
mode (unimodal), or multiple modes (bimodal, multimodal).

### Skewness

**Skewness** describes the shape of your data distribution. Is it balanced on both sides, or does it
have a long tail stretching in one direction?

| Symmtric | Right-Skewed(+) | Left-Skewed(-) |
|---|---|---|
| $\text{Skewness} \approx 0$ | $\text{Skewnewss} > 0$ | $\text{Skewness} < 0$ |
| $\text{Mean} \approx \text{Media} \approx \text{Mode}$ | Tail stretches right. $\text{Mode} < \text{Median} < \text{Mean}$ | Tail stretches left. $\text{Mean} < \text{Median} < \text{Mode}$ | 

### Kurtosis

While skewness tells us about the asymmetry of our data, **kurtosis** tells us about the tails.
Specifically: how likely are extreme values (outliers) compared to a normal distribution?

| Platykurtic | Mesokurtic | Leptokurtic |
|---|---|---|
|Kurtosis < 3 | Kurtosis = 3 | Kurtosis > 3 |
| Flatter peak, thinner tails. Fewer extreme values than normal. | Normal distribution. The baseline for comparison. |  Sharper peak, fatter tails. More extreme values than normal. |

### Measures of Spread (Dispersion)

We have looked at the **center** (mean, median) and the **shape** (skewness). But there is one more critical
piece of the puzzle: **spread**.

**Variance and Standard Deviation**

$$
\begin{align}
\text{Variance: }\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2 \\
\text{Standard Deviation: }\sigma = \sqrt{\sigma^2} \\
Var(X+Y)=Var(X)+2Cov(X,Y)+Var(Y) \\
Var(f(X))\approx f'(m)^2Var(X)\ for\ m=\mathbb{E}[X]
\end{align}
$$

> **Why Square the Deviations?** Two reasons: (1) Positive and negative deviations would cancel out
> otherwise. (2) Squaring penalizes larger deviations more heavily, making the metric more sensitive
> to outliers.

**Range and Interquartile Range (IQR)**

- Range: $\text{Range} = \text{Max} - \text{Min}$
- Interquartile Range (IQR): $\text{IQR} = Q_3 - Q_1$

### Formulas Reference

| Metric | Formula | Use When
|---|---|---|
|Mean|$\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i = \frac{x_1+x2+...+x_n}{n}$|Data is symmetric, no outliers|
|Media|Middle value (sorted)|Skewed data or outliers present|
|Mode|Most frequent value|Categorical data or identifying peaks|
|Range|$\text{Max} - \text{Min}$|uick overview, no outliers|
|IQR|$\text{IQR} = Q_3 - Q_1$|Robust spread, outlier detection|
|Variance|$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$|Mathematical analysis, ML algorithms|
|Std Dev|$\sigma = \sqrt{\sigma^2}$|Interpretable spread in original units|

## Population vs. Sample

|Metric|Population Parameter|Smaple Statistic|Relationship|
|---|---|---|---|
|Size|N|n|Usually $n \ll N$|
|Mean|$\mu$(Mu)|$\bar{x}$(x-bar)|$\bar{x}$ estimates $\mu$|
|Variace|$\sigma^2$(Sigma Sq.)|$s^2$ Bessel's Correction|estimates|
|Std. Deviation|$\sigma$(Sigma)|$s$|estimates|
|Proportion|$p$ or $\pi$|$\hat{p}$(p-hat)|estimates|

### The Goal: Statistical Inference

- **Descriptive Statistics**: Summarizing the data you have.
- **Inferential Statistics**: Predicting the data you don't have.

### The Two Pillars of Inference

- **Estimation**: I don't know the true value, but I can give you a range where it likely lives.
  - Confidence Intervals
- **Hypothesis Testing**: I have a theory about the true value. Does the data support it or destroy it?
  - P-Values
  - Significance

### Machine Learning Applications
 
In ML, the distinction between Population and Sample defines our entire workflow.

> 1. **Training Data is a Sample**
>
> Your dataset (ImageNet, Titanic, etc.) is always a sample (n). The real world where your model is
> deployed is the population (N). The Central Limit Theorem explains why sampling works.
> 
> The Challenge: We want to minimize error on the Population (Generalization Error), but we can only
> optimize error on the Sample (Training Error).

> 2. **Overfitting**
> 
> Overfitting happens when a model learns the "noise" of the sample rather than the "signal" of
> the population. It effectively memorizes the specific n examples but fails when exposed to the N
> universe. Regularization helps prevent this.

> 3. **Train/Test Split**
> 
> We split our available sample into "Train" and "Test". We pretend the "Test" set is the Population.
> If the model performs well on the Test set (data it hasn't seen), we infer it will perform well on
> the real Population.

### Common Mistakes
 
> **The "Big Data" Fallacy**
> 
> Thinking that because your n is huge (e.g., 1 million bulbs), it equals N. If those 1 million bulbs
> all come from just one factory line (e.g., Line A), it is still a biased sample of the population
> (all factory lines).

> **Data Leakage**
> 
> Using information from the Population (or Test set) to influence the Sample (Training set). For
> example, imputing missing values using the mean of the entire dataset instead of just the training
> set.

## Sample Distributions

If you kept sampling, taking thousands of samples and plotting their means, you would create a
new distribution. This is the Sampling Distribution. It is not a distribution of raw data; it is a
probability distribution of a statistic (like the mean). The mathematical bridge between a single
sample and the true population. It is like a "meta-distribution" - it describes the behavior of
statistics (like means) calculated from many hypothetical samples, not the behavior of individual
data points.

### Sampling Distribution of the Mean
 
If we draw samples from a population with mean $\mu$ and standard deviation $\sigma$, the
distribution of sample means $\bar{x}$ follows two fundamental rules:

- **Rule 1: Unbiased Estimator**: $\mu_{\bar{x}} = \mu$
- **Rule 2: Standard Error**: $\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$

### Crucial: Standard Deviation vs Standard Error

|Metric|Symbol|Formula|What it measures|
|---|---|---|---|
|Standard Deviation|$\sigma$ or $s$|$\sigma$|Variability of individual data points|
|Standard Error|SE or $\sigma_{\bar{x}}$|$\frac{\sigma}{\sqrt{n}}$|Variability of the sample mean|

### The Central Limit Theorem (CLT)
 
If the sample size n is large enough (typically $n \ge 30$), the sampling distribution of the mean
will be approximately Normal, regardless of the shape of the original population distribution.

### Sampling Distribution of Proportions

When dealing with categorical data (Success/Failure, Click/No-Click, 0/1), we look at the sample
proportion:

> $\hat{p} = \frac{x}{n}$
>
> where x = number of successes, n = sample size

- **Rule 1: Unbiased Estimator**: $\mu_{\hat{p}} = p$
- **Rule 2: Standard Error**: $\sigma_{\hat{p}} = \frac{\sqrt{p(1-p)}}{\sqrt{n}}$

### The T-Distribution
 
So far, we assumed we know the population standard deviation $\sigma$. But in practice, we almost
never know it! We have to estimate it using the sample standard deviation $s$. When we substitute
$s$ for $\sigma$ in our formulas, the uncertainty increases. The resulting distribution is called
the Student t-distribution.
 
> T-Statistic Formula
> 
> $t = \frac{\bar{x} - \mu}{s/\sqrt{n}}$
> 
> Notice: $s$ (sample SD) instead of $\sigma$ (population SD)

### The T-Test

The t-test is a statistical test that uses the t-distribution to determine if there is a significant
difference between group means. It answers questions like: "Is this difference real, or just random
noise?"

- One-Sample T-Test: Compare a sample mean to a known value. Example: "Is our bulb lifespan different from 1000 hours?"
- Two-Sample T-Test: Compare means of two groups. Example: "Do users who see version A convert better than version B?"

### Examples

Scenario 1: Your bulbs have mean lifespan $\mu = 1000$ hours and $\sigma = 50$ hours. You test n=100
bulbs. What is the probability the sample mean is less than 990 hours?

1. Standard Error: $SE = \frac{50}{\sqrt{100}} = 5$ hours
1. Z-Score: $Z = \frac{990 - 1000}{5} = -2.0$
1. Probability: $P(Z < -2.0) \approx 0.0228$ (2.28%)

Conclusion: Only 2.3% chance of seeing a mean this low by random chance. If you observe this, your
production line might be failing!

Scenario 2: Historical defect rate is p=0.05 (5%). You run a quality check on n=1000 bulbs. What is
the SE of the sample proportion?

1. Check validity: $np = 50 \ge 10, n(1-p) = 950 \ge 10$, -OK!
1. Standard Error: $SE = \frac{\sqrt{0.05 \times (1-0.05)}}{\sqrt{1000}} \approx 0.0069$

Meaning: We expect the sample defect rate to be within about 0.7% of the true 5% rate (so roughly
4.3% to 5.7%).

### Machine Learning Applications

Sampling distributions are everywhere in ML, from model evaluation to optimization.

1. Cross-Validation Scores:  When you run 5-fold CV, you get 5 accuracy scores. The mean of these is
a sample statistic! The standard error of this mean tells you how stable your estimate is. Report it
alongside your mean accuracy.

1. Ensemble Learning (Bagging): Random Forest creates many bootstrap samples and trains trees
on each. The final prediction is an average. By the CLT formula $SE = \frac{\sigma}{\sqrt{n}}$ ,
averaging n trees reduces prediction variance by $\sqrt{n}$

1. A/B Testing: When comparing Model A vs Model B, you compare their average metrics. The sampling
distribution helps calculate confidence intervals. If intervals do not overlap, you have a
statistically significant difference.

1. Mini-Batch Gradient Descent: In SGD, a mini-batch is a sample. The gradient from that batch is an
estimate of the true gradient. Larger batch sizes reduce "noise" (SE of gradient) but compute more
per step. This is SE in action!

### Central Limit Theorem (CLT)

The CLT states that as the sample size $n$ increases, the sampling distribution of the sample mean
$\bar{x}$ approaches a Normal Distribution  $N(\mu, \frac{\sigma}{\sqrt{n}})$ regardless of the
shape of the original population distribution.

### Confidence Intervals

A confidence interval is constructed from two main parts: the center (Point Estimate) and the width
(Margin of Error).

> $CI = \text{Point Estimate} \pm \text{Margin of Error}$
>
> $CI = \bar{x} \pm (z^* \times \frac{\sigma}{\sqrt{n}})$
> 1. Point Estimate($\bar{x}$): The mean calculated from your specific sample. This is the center of
>   your interval - your best single guess.
> 1. Critical Value($z^*$ or $t^*$): Determined by your Confidence Level. For 95% confidence, $z^* =
>   1.96$. This tells you how many standard errors wide the net needs to be.
> 1. Standard Error($\frac{\sigma}{\sqrt{n}}$): How much we expect the sample mean to fluctuate.
> 1. Margin of Error (ME): The product of Critical Value and Standard Error. This is half the width
>   of your interval - the "reach" of your net in one direction.

### Factors Affecting Interval Width

A narrower interval is generally better (more precision), provided we maintain confidence. How do we
achieve that?

- Sample Size: Increase n. Since n is in the denominator (inside $\sqrt{n}$), quadrupling your
  sample size cuts your margin of error in half.
- CL Confidence Level: Decrease CL. Lowering confidence (99% to 90%) reduces the critical value
  (2.576 to 1.645), narrowing the interval. Trade-off: less certainty.
- $\sigma$ Standard Deviation: Decrease $\sigma$ Less variable populations yield more precise
  estimates. Usually hard to control in practice - this is a property of the population.

## Hypothesis Testing
 
The mathematical framework for distinguishing signal from noise.

- $H_0$ Null Hypothesis: "The defendant is innocent." We start by assuming the status quo. We assume
  there is no effect, no difference, or no crime committed.
- $H_1$ Alternative Hypothesis:  "The defendant is guilty." This is what the prosecutor (or data
  scientist) attempts to prove. It claims there is a significant effect or difference.

Core Definitions

- The Hypotheses
- Significance Level($\alpha$)
- The P-Value

Which Test Statistic to Use

- Z-Test: Population variance known OR large sample (n>30)
- T-Test: Population variance unknown AND small sample (n<30)
- Chi-Square: Categorical data (comparing observed vs expected counts)
- ANOVA: Comparing means of 3+ groups

### Type I & Type II Errors

- Type I Error ($\alpha$):  False Positive. Rejecting a TRUE Null Hypothesis.
- Type I Error ($\beta$): False Negative. Failing to reject a FALSE Null Hypothesis.

## P-Values

The P-value is the probability of observing test results at least as extreme as the results actually
observed, under the assumption that the Null Hypothesis is correct. Visually, the P-value is the
area under the curve in the tail(s) beyond your observed test statistic

It is $P(Data|H_0)$, the probability of the evidence (data) given that the hypothesis is true. Is
not $P(H_0|Data)$, the probability that the hypothesis is true given the evidence. This is a
common misconception!

## Type I and Type II Errors

### The Decision Matrix

||$H_0$ IS TRUE|$H_0$ IS FALSE|
|---|---|---|
|Fail to Reject $H_0$(Do nothing)|Correct(True Negative)|Type II Error(False Negative), "Missed Opportunity"|
|Reject $H_0$(Take action)|Type I Error(False Positive) "False Alarm"|Correct (True Positive) Power = 1 - beta|

## One-Sample T-Test

Determining if a sample mean significantly differs from a known standard.

## A/B Testing (Two-Sample Z-Test)

## Analysis of Variance (ANOVA)
Comparing more than two groups without hacking your p-values.

## Correlation

Covariance: measures how two variables change together.

$Cov(X,Y) = \frac{1}{n-1}\sum_{i=1}^n(X_i - \bar{X})(Y_i - \bar{Y})$

Correlation Coefficient (r): Correlation is standardized covariance. We divide by the product of
standard deviations to get a unitless number between -1 and 1.

$r=\frac{Cov(X,Y)}{\sigma_X\sigma_Y}$

## Resampling Methods

Making something out of nothing (almost).

- The Bootstrap
- The Jackknife

## Maximum Likelihood Estimation

Finding the parameters that make your data most probable.

MLE in Machine Learning

- MSE Loss = MLE for Gaussian
- Cross-Entropy Loss = MLE for Bernoulli
- Softmax + Cross-Entropy = MLE for Categorical

### Limitations and the Bayesian Fix

The Fix: MAP (Maximum A Posteriori): MAP adds a Prior distribution encoding our beliefs before seeing data:

$\hat{\theta}_{MAP}=argmax_\theta L(\theta)\cdot P(\theta)$

In ML, the Prior corresponds to Regularization:

- L2 regularization = Gaussian prior on weights
- L1 regularization = Laplace prior on weights

## Bayesian vs. Frequentist
 
## Higher-level concepts

**Moments** of a function in mathematics are certain quantitative measures related to the shape of the
function's graph.

* Moment
  * mean
  * standard deviation
  * variance
  * skewness
  * kurtosis
* pdf -- Probability Density Function
* CDF -- Cumulative Distribution Function
* CCDF -- Complementary Cumulative Distribution Function
* Quantile -- Percentile
* Entropy


