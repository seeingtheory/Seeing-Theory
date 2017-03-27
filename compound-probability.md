---
layout: unit
title: Compound Probability
class: \compound-probability
permalink: /compound-probability/
javascript: compound-probability.js
css: compound-probability.css
sections:
- Set Theory
- Combinatorics
- Conditional Probability
description: Compound probability is the probability of joint occurrence of two or more simple events.
---


<p>Set Theory is a branch of mathematics concerned with the description and definition of sets, which are collections of objects.  In the context of probability theory, we use set notation to describe compound events.  Below is a set calculator<sup>*</sup>.  Build a set by pressing on the different events and operators, then press submit to see your set highlighted in the Venn diagram.  You can also move and resize the circles by drag and drop.</p>
<div id="setCalc">
    <div class="btn btn-default setItem">A</div>
    <div class="btn btn-default setItem">B</div>
    <div class="btn btn-default setItem">C</div>
    <div class="btn btn-default setItem">&empty;</div>
    <div class="btn btn-default setItem">U</div><br>
    <div class="btn btn-default setItem">(</div>
    <div class="btn btn-default setItem">&cap;</div>
    <div class="btn btn-default setItem">&cup;</div>
    <div class="btn btn-default setItem">'</div>
    <div class="btn btn-default setItem">)</div>
    <div class="form-control" id="set"></div>
    <div class="btn btn-default" id="submit">Submit</div>
    <div class="btn btn-default" id="delete">Delete</div>
    <div class="btn btn-default" id="reset">Reset</div>
</div>
<p>You might notice that certain combinations of sets and operators result in the same highlighted section in the Venn diagram. Set identities are laws of set theory that allow you to simplify set algebra. See the following link for a complete list of <a href='https://cs.brown.edu/courses/cs022/static/files/documents/sets.pdf'>set identities</a>.</p>
<br>
<p><sup>*Please note there are still some small errors in the calculator currently being fixed.</sup></p>

<!-- Modal -->
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Invalid Set Notation</h4>
        </div>
        <div class="modal-body">
          <p class='text-center' id='invalidSet'></p>
        </div>
      </div>
    </div>
</div>


<!-- <p>Combinatorics is a branch of mathematics concerned with counting sequences and sets of objects.  For example imagine we have a bag of uniquely colored marbles and I ask you to pick some number of the marbles at random without replacement. How many different sequences (permutations) of the marbles are there? How many different sets (combinations)?  Choose a size below representing the number of marbles in the bag. Then using the slider on the left visualize the number of permutations and combinations of marbles.</p>

<div>
  <select class="form-control" id="sizeComb">
    <option data-content="<div id='balls_1'></div>">1</option>
    <option data-content="<div id='balls_2'></div>">2</option>
    <option data-content="<div id='balls_3'></div>">3</option>
    <option data-content="<div id='balls_4'></div>">4</option>
  </select>
</div>
<label class="radio-inline"><input type="radio" name="radioComb" checked="checked" value=false>Permutation</label>
<label class="radio-inline"><input type="radio" name="radioComb" value=true>Combination</label>
<div class='explanationComb'>
    <p>Permutations represent unique orderings of objects in a set.  We can determine the exact number of permutations with the following formula:</p>
    $$P(n,r) = \dfrac{n!}{(n-r)!}$$
    <p>\(n\) represents the total number of objects to pick from and \(r\) represents the number of objects being chosen.</p>
</div>
<div class='explanationComb' style='display:none'>
    <p>Combinations represent unique combinations of objects in a set.  We can determine the exact number of combinations with the following formula:</p>
    $$C(n,r) = \dfrac{n!}{r!(n-r)!}$$
    <p>\(n\) represents the total number of objects to pick from and \(r\) represents the number of objects being chosen.</p>
</div> -->


<!-- <p>Conditional probability is a measure of the probability of an event given another event has occurred. It can be expressed mathematically as the following:</p>
$$P(A|B) = \dfrac{P(A \cap B)}{P(B)}$$
<p>To visualize this concept move and rescale the shelfs by drag and drop and toggle the current perspective.  What is the probability a ball lands on a shelf? What is the probability given the ball has or will hit another shelf?</p>
<div id='svgProbCP'></div>
<p>This visualization was adapted from Victor Powell's fantastic visualization of <a href="http://setosa.io/conditional/">conditional probability</a>.</p> -->

                    