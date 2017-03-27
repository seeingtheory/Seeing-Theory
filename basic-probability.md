---
layout: unit
title: Basic Probability
class: \basic-probability
permalink: /basic-probability/
javascript: basic-probability.js
css: basic-probability.css
sections:
- Likelihood
- Expectation
- Estimation
description: Basic probability is an introduction to the foundational ideas in probability theory.
---


<p>Probability is the measure of the likelihood that an event will occur. It is quantified as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty. A simple example is the tossing of a coin that has two sides: head and tail. We can describe the probability of this event in terms of the observed outcomes or the expected results.</p>

<div id="coinWrapper">
    <div id="coin"></div>
    <div id="coinButtons">
        <div class="btn btn-default" id="flipOne">Flip the Coin</div>
        <div class="btn btn-default" id="flipHundred">Flip 100 times</div>
    </div>
</div>

<p>For a "fair" coin, the probability of head equals the probability of tail. However, for an "unfair" or "weighted" coin the two outcomes are not equally likely. Change the "weight" of the coin by dragging and dropping the expected probability and see how this affects the observed outcomes.</p>


<!-- <p>The expected value of an experiment is the probability-weighted average of all possible values.  It is defined mathematically as the following:</p>
$$E[X] = \sum_{x \in X}xP(x)$$
<p>The law of large numbers states that the average result from a series of trials will converge to the expected value. Roll the die to see convergence to its expected value.</p>
<div id="dieWrapper">
    <div id="die"></div>
    <div id="dieButtons">
        <div class="btn btn-default" id="rollOne">Roll the Die</div>
        <div class="btn btn-default" id="rollHundred">Roll 100 times</div>
    </div>
</div>
<p>Change the theoretical probability of the die to see how that changes the average and expected value.</p>
<div id="barDie"></div> -->



<!-- <p>One of the main goals of statistics is to estimate unknown parameters. An estimator uses measurements and properties of expectation to approximate these parameters. To illustrate this idea we will estimate the value of pi, \( \pi \) by dropping randomly samples on a square that inscribes a circle.  We will define the following estimator \( \hat{\pi} \), where \( m \) is the number of samples within our circle and \( n \) is the total number of samples dropped.</p>
<table id="estimation" class="table table-bordered">
    <colgroup></colgroup>
    <colgroup></colgroup>
    <colgroup></colgroup>
    <tbody>
        <tr>
            <td>\(\hat{\pi} = 4\dfrac{m}{n}\)</td>
            <td>
                \( m= \) <span id="m">0.00</span><br>
                \( n= \) <span id="n">0.00</span>
            </td>
            <td>\( \hat{\pi}= \) <span id="pi">&emsp;&emsp;&emsp;&emsp;</span></td>
        </tr>
    </tbody>
</table>         
<div class="btn btn-default" id="dropHundred">Drop 100 Samples</div>
<div class="btn btn-default" id="dropThousand">Drop 1000 Samples</div>
<p style="margin-top:10px">An estimator's accuracy and precision is quantified by the following properties:</p>
<div id='properties'>
    <label class="radio-inline"><input type="radio" name="estProp" value='bias'>Bias</label>
    <label class="radio-inline"><input type="radio" name="estProp" value='var'>Variance</label>
    <label class="radio-inline"><input type="radio" name="estProp" value='mse'>Mean Squared Error</label>
</div>
<div class='estProperties' id='bias'>
    <p>The bias of an estimator is the difference between the estimator's expected value and the true value of the parameter being estimated. It informally measures how accurate an estimator is. For an estimator \( \theta \), bias is defined mathematically as:</p>
    $$B(\hat{\theta}) = E(\hat{\theta}) - \theta$$
    <p>In our example, \( \hat{\pi} \) is unbiased, which means its bias is 0.</p>
    
</div>
<div class='estProperties' id='var'>
    <p>Variance is the expectation of the squared deviation of an estimator from its expected value. It informally measures how precise an estimator is. For an estimator \( \theta \), this is defined mathematically as:</p>
    $$var(\hat{\theta}) = E[(\hat{\theta} - E(\hat{\theta}))^2]$$
    <p>In our example, the variance of our estimator \( \hat{\pi} \) is <span id='varValue'></span></p>
</div>
<div class='estProperties' id='mse'>
    <p>Mean squared error (MSE) of an estimator is the sum of the estimator's variance and bias squared. For an estimator \( \theta \), this is defined mathematically as:</p>
    $$MSE(\hat{\theta}) = var(\hat{\theta}) + B(\hat{\theta})^2$$
    <p>In our example, the mean squared error of our estimator \( \hat{\pi} \) is <span id='mseValue'></span></p>
</div> -->
