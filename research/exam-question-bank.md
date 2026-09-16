# Deep Learning exam — reconstructed question bank

Research log for the trainer blocks N, O, P and Q (`content/questions/N-*.md` … `Q-*.md`).
The trainer holds the Russian versions with full explanations; this file keeps the English canonical
questions, provenance and verification notes. Source questions are paraphrased here, not copied — follow
the links for the original wording.

Research date: September 2026.

**Labels.** Match status describes how a bank question relates to the user's remembered exam:
`EXACT`, `NEAR_EXACT`, `SAME_CONCEPT`, `RELATED`, `UNCONFIRMED`.
Priority: `P0` confirmed on the user's exam · `P1` near-exact or same-source question from a source strongly
connected to the exam · `P2` same source family, likely useful variant · `P3` general preparation.
In the trainer, pick **Банк → экзамен: P0–P1** to study only P0/P1.

**Source keys** used below:

| Key | Source |
|---|---|
| IB | InterviewBit — Deep Learning Interview Questions (F = freshers, E = experienced, MCQ = multiple-choice section) |
| T45 | "Top 45 Deep Learning Interview Questions" PDF (Kaggle forum attachment) |
| W19 | Stanford CS230 Midterm, Winter 2019, official solutions |
| F18, F19, F20, W20, W21, F22 | Stanford CS230 Midterms with solutions: Fall 2018, Fall 2019, Fall 2020, Winter 2020, Winter 2021, Fall 2022 |
| MLM | Machine Learning Mastery — "How to Choose Loss Functions When Training Deep Learning Neural Networks" |
| BR | Brainly — student mirror of the IB MLP question |

---

## Output 1 — Source map

| Source | Institution / site | URL | Type | Why relevant | Matching user-exam questions | Quality |
|---|---|---|---|---|---|---|
| IB | InterviewBit (Scaler) | https://www.interviewbit.com/deep-learning-interview-questions/ | Interview bank + 10 MCQs | Contains, nearly verbatim, the bias=0/weights=0 question, RNN-vs-ANN backprop, "built solely on linear regression", batch GD, SGD vs batch GD, data normalisation, and the MCQs for the 1-2-3 × 4-5-6 MLP, 28×28 / 7×7 convolution, gradient-descent step order, max-pooling-parameters and "does not prevent over-fitting" | 14 (user Q2, 3, 4, 9, 13, 16, 17, 20, 22, 24, 25, 26, 27, 28/29, 8) | Tier 3 |
| T45 | Kaggle forum attachment (author not stated) | https://storage.googleapis.com/kaggle-forum-message-attachments/2381758/19505/Top%2045%20Deep%20Learning%20Interview%20Questions.pdf | Interview bank (PDF) | Title-level exact matches: role of activation functions, Softmax and ReLU, gradient descent, different layers on CNN, LSTM, auto-encoder, data normalization, dropout and batch normalization, batch vs stochastic GD, "does not prevent over-fitting" (pooling), "how can you train hyperparameters" | 13 (user Q1, 5, 6, 7, 8, 12, 14, 15, 16, 20, 21, 26, 30) | Tier 4 (anonymous mirror; wording and structure match Simplilearn's interview-question article, but the current Simplilearn page was rewritten and the original could not be verified) |
| W19 | Stanford University, CS230 | https://cs230.stanford.edu/files/cs230exam_win19_soln.pdf (questions: `cs230exam_win19.pdf`) | Official exam + solutions | Exact GAN "apples" question (1a); Batchnorm MCQ whose options are the three statements the user remembers (1f); CONV-layer parameter MCQ (1j); plus activation, loss, CNN, optimizer questions | 3 (user Q11 exact, Q19 near-exact, Q23 same concept) | Tier 1 |
| F18 | Stanford CS230 | https://cs230.stanford.edu/files/cs230exam_fall18_soln.pdf | Official exam + solutions | "Does NOT prevent overfitting" variant with "none of the above"; input normalization; zero initialization; Xavier | 0 exact; 3 same-concept | Tier 1 |
| F19 | Stanford CS230 | https://cs230.stanford.edu/files/cs230exam_fall19_soln.pdf | Official exam + solutions | Parameter counts, conv output size, vanishing gradients | 0 exact | Tier 1 |
| F20 | Stanford CS230 | https://cs230.stanford.edu/files/cs230exam_fall20_soln.pdf | Official exam + solutions | Overfitting techniques, GD variants, dropout, sigmoid gradient, mode collapse | 0 exact; 1 same-concept (Q30) | Tier 1 |
| W20 | Stanford CS230 | https://cs230.stanford.edu/files/cs230exam_win20_soln.pdf | Official exam + solutions | NN without hidden activations = logistic regression (relates to Q22); parameter count | 0 exact | Tier 1 |
| W21 | Stanford CS230 | https://cs230.stanford.edu/files/cs230exam_win21_soln.pdf | Official exam + solutions | Batch Norm statements, 1×1 conv, initialization, regularization, exploding gradients | 0 exact; 1 same-concept (Q19) | Tier 1 |
| F22 | Stanford CS230 | https://cs230.stanford.edu/syllabus/fall_2022/CS230_Midterm_Solutions_Fall_2022.pdf | Official exam + solutions | Dropout ensemble count, early stopping, GAN D(G(z)), VAE loss matching | 0 exact | Tier 1 |
| MLM | Machine Learning Mastery (J. Brownlee) | https://machinelearningmastery.com/how-to-choose-loss-functions-when-training-deep-learning-neural-networks/ | Tutorial | Uses the exact loss names the user remembers ("Multi-Class Cross-Entropy", "Sparse Multiclass Cross-Entropy", "Kullback Leibler Divergence") and groups KL under multi-class classification. Does **not** list Huber | 1 (partial, user Q10) | Tier 3 |
| BR | Brainly | https://brainly.com/question/37647145 | Q&A mirror | Carries the MLP 1-2-3 × 4-5-6 wording; confirms circulation only | 1 (mirror of Q9) | Tier 5 |
| Simplilearn (current) | Simplilearn | https://www.simplilearn.com/tutorials/deep-learning-tutorial/deep-learning-interview-questions | Interview bank | Checked as the likely origin of T45; the live page now has 33 different questions and none of the matches | 0 | Tier 3 |
| chao-xi mirror | GitHub Pages | https://chao-xi.github.io/jxtechbook/chap4/10Deep_learning/ | Mirror | Not fetched in this pass — not used as evidence | — | Tier 5 |

**Pattern.** The user's exam looks assembled from two interview banks (T45-style list and InterviewBit, including
its MCQ section) plus two Stanford CS230 Winter 2019 multiple-choice items (GAN apples, Batchnorm), with the two
matching tasks (loss functions, activation functions) and the supervised/unsupervised matching likely written by the
instructor.

---

## Output 2 — Confirmed exam questions (P0 and P1)

### 2a. The user's 31 remembered questions → bank

| User # | Remembered question | Bank ID | Match | Source | Verified answer | Confidence |
|---|---|---|---|---|---|---|
| 1 | Role of an activation function | N1 | EXACT | T45 #6 | Introduces non-linearity; stacked linear layers collapse to one linear map | High |
| 2 | What is an activation function and why needed | N2 | NEAR_EXACT | IB F25 | f applied to wᵀx+b; needed for non-linearity | High |
| 3, 28 | Can a NN be trained if all biases are zero | N42 | EXACT | IB F18 | Yes | High |
| 4, 29 | Can a NN be trained if all weights are zero | N43 | EXACT | IB F18 | No — symmetry problem | High |
| 5 | Different layers in a CNN | O1 | EXACT | T45 #19 | Conv, ReLU, Pooling, Fully connected (+ input, BN, flatten/GAP, dropout, softmax) | High |
| 6 | What is an Autoencoder | P1 | EXACT | T45 #29; IB E5 | Network trained to reconstruct its input through an encoder–bottleneck–decoder | High |
| 7 | How are hyperparameters tuned/trained | N26 | EXACT | T45 #45 | Not trained by gradient descent; searched on a validation set (grid/random/Bayesian) | High (source answer itself is weak) |
| 8 | Which strategy does NOT prevent overfitting | P25 | EXACT | T45 #41; IB MCQ10 | Pooling | High |
| 9 | Inputs 1,2,3, weights 4,5,6, f(x)=3x | Q1 | EXACT | IB MCQ1 (BR mirror) | 96 | High |
| 10 | Match tasks with loss functions | P12 | UNCONFIRMED | Source not identified; names match MLM | Regression: MSE, MAE, Huber · Binary: BCE · Multiclass: CE, sparse CE, KL (per MLM) | Medium (KL placement) |
| 11 | GAN producing apples — false proposition | P7 | EXACT | W19 1(a) | "Discriminator can classify apple vs non-apple" is false | High |
| 12 | What is Gradient Descent | N13 | EXACT | T45 #8 | Iterative update θ ← θ − η∇L | High |
| 13 | Steps of Gradient Descent | N14 | NEAR_EXACT | IB MCQ3 | Init → forward → error → update weights → repeat (4,3,1,5,2) | High |
| 14 | What are Softmax and ReLU | N3 | EXACT | T45 #12 | Softmax: probabilities summing to 1 (output); ReLU: max(0,x) (hidden) | High |
| 15 | How does LSTM work | O13 | EXACT | T45 #21 | Cell state + forget/input/output gates | High |
| 16 | When is data normalization useful | P18 | NEAR_EXACT | T45 #4; IB F12 | Different feature scales, gradient-based and distance-based methods | High |
| 17 | Does max pooling always reduce parameters | O2 | EXACT | IB MCQ8 | No (pooling has no parameters) — source key disputed | High (answer) / Low (source key) |
| 18 | Match activation functions with tasks | N4 | UNCONFIRMED | Source not identified | Binary→Sigmoid, Multiclass→Softmax, Multilabel→Sigmoid, Regression→linear (ReLU as the remaining option) | Medium (regression row) |
| 19 | Batch Normalization statements | P22 | NEAR_EXACT | W19 1(f) | Only "makes training faster" is true | High |
| 20 | What is Dropout | P24 | EXACT | T45 #15; IB E3 | Randomly zero units during training; off at inference | High |
| 21 | What is Batch Normalization | P21 | EXACT | T45 #15 | Normalize with mini-batch mean/var, then learnable γ, β | High |
| 22 | NN built on linear regression | N28 | NEAR_EXACT | IB E10 | Possible, but without non-linearity it remains a linear model | High |
| 23 | What determines # parameters in a CNN | O3 (+O4) | SAME_CONCEPT | W19 1(j) | Kernel size, input channels, number of filters, bias — not image size, stride, padding | High |
| 24 | RNN backprop vs feed-forward backprop | N35 | NEAR_EXACT | IB E7 | BPTT: unroll in time, sum gradients of shared weights, vanishing/exploding over time | High |
| 25 | What is Batch Gradient Descent | N15 | EXACT | IB F22 | Gradient over the whole training set per step | High |
| 26 | Batch vs mini-batch vs stochastic GD | N16 | NEAR_EXACT | T45 #16; IB F23 | N vs B vs 1 samples per update | High |
| 27 | 28×28 input, 7×7 conv, stride 1 | Q2 | EXACT | IB MCQ2 | 22×22 (padding 0) — source key uncertain | High (answer) |
| 30 | What prevents overfitting | P27 | SAME_CONCEPT | T45 #17; F20 1(c) | More data/augmentation, dropout, L1/L2, early stopping, smaller model, BN | High |
| 31 | CNN/RNN/AE/GAN supervised vs unsupervised | P5 (+P4) | UNCONFIRMED | Source not identified | CNN, RNN → supervised; AE, GAN → unsupervised (self-supervised) | Medium |

### 2b. P1 questions (same sources, not reported by the user)

| ID | Topic | Question | Match | Source | Answer | Confidence |
|---|---|---|---|---|---|---|
| N5 | Activations | Output activation for K probabilities summing to 1 | RELATED | IB MCQ5 | Softmax | High |
| N6 | Activations | What gives non-linearity to a network | RELATED | IB MCQ7 | ReLU | High |
| N7 | Activations | Activation that can lead to vanishing gradients | RELATED | W19 1(b) | Tanh | High |
| N11 | Activations | What is Leaky ReLU | RELATED | T45 #37 | Small slope α for x ≤ 0 | High |
| N12 | Activations | Problem with ŷ = σ(ReLU(z)) and 0.5 threshold | RELATED | W19 2(h); W20 1(g) | Every input predicted positive | High |
| N19 | Optimization | Why mini-batch GD is useful | RELATED | T45 #36 | GPU efficiency, better gradient estimate than 1 sample, fits memory | High |
| N20 | Optimization | Learning rate too low / too high | RELATED | T45 #14; IB F6 | Slow / divergence, oscillation | High |
| N21 | Optimization | Epoch vs batch vs iteration | RELATED | T45 #23 | 10 000/200 = 50 iterations (source has an arithmetic typo) | High |
| N22 | Optimization | Explain Adam | RELATED | T45 #39 | Momentum + RMSProp + bias correction | High |
| N27 | Fundamentals | What are hyperparameters | RELATED | T45 #13; IB F14 | Set before training, not learned | High |
| N29 | Fundamentals | What is an MLP | RELATED | T45 #3 | Fully connected feed-forward net with ≥1 non-linear hidden layer | High |
| N30 | Fundamentals | Feed-forward vs recurrent network | RELATED | T45 #10 | No loops vs hidden state carried over time | High |
| N31 | Fundamentals | What is a cost function | RELATED | T45 #7 | Measure of prediction error minimized in training | High |
| N32 | Fundamentals | Choosing number of layers/neurons | RELATED | IB E11 | Hyperparameters; start simple, validate | High |
| N33 | Fundamentals | Deep vs shallow network | RELATED | T45 #43; W20 1(e) | Same functions with far fewer parameters, feature hierarchy | High |
| N34 | Backprop | What is backpropagation | RELATED | T45 #9; IB F11 | Chain-rule gradient computation, output to input | High |
| N37 | Backprop | Vanishing and exploding gradients | RELATED | T45 #22; IB E6 | Products of per-layer factors shrink/grow exponentially | High |
| N38 | Backprop | Two ways to fight vanishing gradients | RELATED | T45 #42 | ReLU, Xavier/He, BN, residuals, LSTM | High |
| N44 | Initialization | Why random weight initialization | RELATED | T45 #44 | Break symmetry | High |
| O4 | CNN | True statements about a CONV layer | NEAR_EXACT (to user Q23) | W19 1(j) | #weights depends on input depth; #biases = #filters | High |
| O5 | Pooling | What is pooling and how it works | RELATED | T45 #20 | Window max/average, downsampling, no parameters | High |
| O9 | CNN | Benefits of conv over FC layers | RELATED | W19 2(f); T45 #40 | Far fewer parameters, spatial locality, translation equivariance | High |
| O10 | CNN/RNN | Where weight sharing occurs | RELATED | IB MCQ9 | CNN and RNN | High |
| O11 | Convolution | SAME vs VALID padding | RELATED | T45 #33 | Pad to keep size (stride 1) vs no padding | High |
| O12 | Fundamentals | Max connections 10-node input → 5-node hidden | RELATED | IB MCQ6 | 50 | High |
| O14 | RNN | Applications of RNNs | RELATED | T45 #11 | Text, speech, captioning, time series | High |
| P2 | Autoencoder | Layers of an autoencoder | RELATED | IB E5 | Encoder, code, decoder | High |
| P3 | Autoencoder | Uses of autoencoders | RELATED | T45 #34; IB E4 | Dimensionality reduction, denoising, anomaly detection, features | High |
| P8 | GAN | Explain GANs | RELATED | T45 #28 | Generator vs discriminator minimax game | High |
| P9 | GAN | Non-saturating generator cost | RELATED | W19 1(d) | −(1/m) Σ log D(G(z)) | High |
| P13 | Loss | L1 vs L2 regression loss with many outliers | RELATED | W19 5(b) | L1 (MAE) | High |
| P14 | Loss | Does L1 loss make weights sparse | RELATED | W19 5(c) | No — residuals become sparse | High |
| P15 | Regularization | Which regularization gives sparse weights | RELATED | W19 2(b) | L1 | High |
| P16 | Loss | Probabilistic output: hinge vs logistic loss | RELATED | W19 5(g) | Logistic | High |
| P17 | Loss/Activations | Multi-class vs multi-label | RELATED | IB F15 | One exclusive class (softmax) vs several labels (sigmoids) | High |
| P19 | Normalization | Data normalization techniques | RELATED | IB F13 | Min-max, z-score, max-abs, log, unit norm | High |
| P28 | Regularization | 100% train vs 42% test — common fix | RELATED | W19 1(e) | Dropout | High |
| P33 | Regularization | What is data augmentation | RELATED | T45 #38; W19 3(c) | Label-preserving transformations of training data | High |
| Q3 | Calculation | CNN layer table from 128×128×3 | RELATED | W19 3(d) | 120²×32 / 60² / 56²×64 / 28² / 24²×64 / 12² / FC 27 648 + 3 | High |
| Q4 | Calculation | Softmax of [0.3, 0.3, 0.3] | RELATED | W19 3(f) | [1/3, 1/3, 1/3] | High |
| Q10 | Calculation | Iterations per epoch, N = 10 000, B = 200 | RELATED | T45 #23 | 50 | High |

---

## Output 3 — Master question bank (121 questions)

Sections follow the requested structure; the trainer groups them into four blocks (N, O, P, Q).
Difficulty: E = easy, M = medium, H = hard. Within a section: EXACT/NEAR_EXACT first, then SAME_CONCEPT, then RELATED.

### 01 Neural network fundamentals

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| N28 | Fundamentals | Linear models | Can a neural network be built solely on linear regression? | Conceptual / MCQ | E | P0 | Yes, but it stays linear without activations | IB E10 | NEAR_EXACT |
| N26 | Fundamentals | Hyperparameters | How are the hyperparameters of a neural network tuned ("trained")? | Short answer | E | P0 | Search on validation data; not learned by GD | T45 #45 | EXACT |
| N27 | Fundamentals | Hyperparameters | What are hyperparameters? | Short answer | E | P1 | Values fixed before training | T45 #13; IB F14 | RELATED |
| N29 | Fundamentals | MLP | What is a multi-layer perceptron? | Short answer | E | P1 | FC feed-forward net with non-linear hidden layers | T45 #3 | RELATED |
| N30 | Fundamentals | Architectures | Feed-forward vs recurrent network? | Conceptual | E | P1 | No loops vs recurrent hidden state | T45 #10 | RELATED |
| N31 | Fundamentals | Loss | What is a cost function? | Short answer | E | P1 | Error measure minimized by training | T45 #7 | RELATED |
| N32 | Fundamentals | Architecture design | How to choose numbers of hidden layers and neurons? | Conceptual | M | P1 | Hyperparameter search on validation | IB E11 | RELATED |
| N33 | Fundamentals | Depth | Why is a deep network better than a shallow one? | Conceptual | M | P1 | Fewer parameters for same function, hierarchy | T45 #43; W20 1(e) | RELATED |
| O12 | Fundamentals | Connectivity | Max connections between 10 input and 5 hidden nodes? | MCQ | E | P1 | 50 | IB MCQ6 | RELATED |
| N50 | Fundamentals | Logistic regression | Does dividing bias-free logistic-regression weights by 2 change test accuracy? | True/False | E | P2 | No | F19 1(g) | RELATED |

### 02 Activation functions

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| N1 | Activations | Role | What is the role of an activation function in a neural network? | Short answer | E | P0 | Non-linearity | T45 #6 | EXACT |
| N3 | Activations | Softmax, ReLU | What are the Softmax and ReLU functions? | Short answer | E | P0 | Probabilities summing to 1 / max(0, x) | T45 #12 | EXACT |
| N2 | Activations | Definition | What is an activation function and why is it needed? | Short answer | E | P0 | f(wᵀx + b); non-linearity | IB F25 | NEAR_EXACT |
| N4 | Activations | Output layer | Match tasks (binary, multiclass, multilabel, regression) with Sigmoid / Softmax / ReLU | Matching | M | P0 | Sigmoid / Softmax / Sigmoid / ReLU-or-linear | Source not identified | UNCONFIRMED |
| N5 | Activations | Softmax | Output activation so K class probabilities sum to 1? | MCQ | E | P1 | Softmax | IB MCQ5 | RELATED |
| N6 | Activations | Non-linearity | Which option gives non-linearity to a network? | MCQ | E | P1 | ReLU | IB MCQ7 | RELATED |
| N7 | Activations | Vanishing | Which activation can lead to vanishing gradients? | MCQ | E | P1 | Tanh | W19 1(b) | RELATED |
| N11 | Activations | Leaky ReLU | What is Leaky ReLU? | Short answer | E | P1 | αx for x ≤ 0 | T45 #37 | RELATED |
| N12 | Activations | Output layer | Problem with ŷ = σ(ReLU(z)) and a 0.5 threshold? | MCQ | M | P1 | All inputs classified positive | W19 2(h); W20 1(g) | RELATED |
| N8 | Activations | tanh gradient | Gradient through tanh never grows in magnitude? | True/False | M | P2 | True | F19 1(f) | RELATED |
| N9 | Activations | sigmoid gradient | Gradient through a sigmoid always…? | MCQ | M | P2 | Decreases in magnitude, keeps sign | F20 1(f) | RELATED |
| N10 | Activations | Validity | Which functions are valid activation functions? | MCQ (multi) | M | P2 | −min(2, x) and the piecewise 0.1x / x function | F20 1(b) | RELATED |

### 03 Gradient descent / optimization

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| N13 | Optimization | GD | What is gradient descent? | Short answer | E | P0 | θ ← θ − η∇L | T45 #8 | EXACT |
| N15 | Optimization | Batch GD | What is batch gradient descent? | Short answer | E | P0 | Full-dataset gradient per step | IB F22 | EXACT |
| N14 | Optimization | GD steps | Correct order of gradient-descent steps? | MCQ (ordering) | E | P0 | 4, 3, 1, 5, 2 | IB MCQ3 | NEAR_EXACT |
| N16 | Optimization | GD variants | Batch vs mini-batch vs stochastic GD? | Conceptual | E | P0 | N / B / 1 samples per update | T45 #16; IB F23 | NEAR_EXACT |
| N19 | Optimization | Mini-batch | Why is mini-batch GD useful? | Short answer | E | P1 | Efficiency and gradient quality trade-off | T45 #36 | RELATED |
| N20 | Optimization | Learning rate | What happens if the learning rate is too low or too high? | Short answer | E | P1 | Slow vs divergent | T45 #14; IB F6 | RELATED |
| N21 | Optimization | Epoch/batch | Epoch vs batch vs iteration? | Short answer | E | P1 | 10 000/200 = 50 | T45 #23 | RELATED |
| N22 | Optimization | Adam | Explain Adam | Short answer | M | P1 | Momentum + RMSProp + bias correction | T45 #39 | RELATED |
| N17 | Optimization | Convergence | Convergence guarantees given an optimal learning rate? | MCQ | H | P2 | Convex: batch GD yes, SGD not guaranteed | F18 1(c) | RELATED |
| N18 | Optimization | GD variants | Which wall-clock convergence orderings are possible on ImageNet? | MCQ (multi) | M | P2 | SGD < batch, mini-batch < SGD, mini-batch < batch | F20 1(d) | RELATED |
| N23 | Optimization | Adam | E[s_t] for Adam's second-moment average | MCQ / derivation | H | P2 | E[g²](1 − β₂ᵗ) | W19 6(c) | RELATED |
| N24 | Optimization | Momentum | Main benefit of momentum? | MCQ | M | P2 | Helps move past local minima/plateaus | W21 1(g) | RELATED |
| N25 | Optimization | Stability | What stabilizes oscillating early training? | MCQ (multi) | M | P2 | LR scheduling, gradient clipping | F22 1(f) | RELATED |

### 04 Backpropagation

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| N35 | Backprop | BPTT | How does backprop in RNNs differ from backprop in feed-forward networks? | Conceptual | M | P0 | Unroll in time, sum shared-weight gradients, vanishing/exploding over time | IB E7 | NEAR_EXACT |
| N34 | Backprop | Definition | What is backpropagation? | Short answer | E | P1 | Chain rule from output to input | T45 #9; IB F11 | RELATED |
| N37 | Backprop | Gradients | Vanishing and exploding gradients? | Conceptual | M | P1 | Exponential shrink/growth of gradient products | T45 #22; IB E6 | RELATED |
| N38 | Backprop | Vanishing | Two ways to handle vanishing gradients | Short answer | E | P1 | ReLU; Xavier/He; BN; residuals | T45 #42 | RELATED |
| N36 | Backprop | Derivative | ∂J/∂w for ŷ = wx, J = (1/m)‖ŷ − y‖² | MCQ / Formula | M | P2 | (2/m)(ŷ − y)xᵀ | W19 1(c) | RELATED |
| N39 | Backprop | Exploding | What fixes exploding gradients? | MCQ | E | P2 | Gradient clipping | W21 1(h) | RELATED |
| N40 | Backprop | Vanishing | True statements about vanishing gradients | MCQ (multi) | M | P2 | Leaky ReLU < sigmoid risk; Xavier helps | F19 1(e) | RELATED |
| N41 | Backprop | Vanishing | 100-layer net with dead gradients — fixes? | MCQ (multi) | M | P2 | Leaky ReLU; BN before activations | F20 1(a) | RELATED |

### 05 Weight / bias initialization

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| N42 | Initialization | Zero bias | Can a network be trained with all biases set to zero? | True/False | E | P0 | Yes | IB F18 | EXACT |
| N43 | Initialization | Zero weights | Can a network be trained with all weights set to zero? | True/False | E | P0 | No | IB F18 | EXACT |
| N44 | Initialization | Randomness | Why add randomness to weight initialization? | Short answer | E | P1 | Break symmetry | T45 #44 | RELATED |
| N45 | Initialization | Zero init | Output of an all-zero 2-layer sigmoid network | MCQ | E | P2 | 0.5 | F18 1(d) | RELATED |
| N46 | Initialization | Zero init | W[1] after one update from zero init | MCQ | H | P2 | All zeros (official key says mixed signs — disputed) | F18 1(e) | RELATED |
| N47 | Initialization | Xavier | What does Xavier initialization ensure? | MCQ | M | P2 | Equal activation variance at the start of training | F18 1(f); W19 1(g) | RELATED |
| N48 | Initialization | Symmetry | False statement about initialization | MCQ | M | P2 | "Xavier keeps variances unchanged during training" | W21 1(d) | RELATED |
| N49 | Initialization | Saturation | Sigmoid MLP initialized from N(10, 1) learns slowly — fixes? | MCQ (multi) | M | P2 | N(0, 1) init; Leaky ReLU | F22 1(g) | RELATED |

### 06 CNN

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| O1 | CNN | Architecture | What are the different layers of a CNN? | Architecture | E | P0 | Conv, ReLU, Pooling, FC (+BN, flatten/GAP, dropout, softmax) | T45 #19 | EXACT |
| O3 | CNN | Parameters | What determines the number of parameters in a CNN? | Conceptual | M | P0 | Kernel size, input channels, filters, bias | W19 1(j) | SAME_CONCEPT |
| O4 | CNN | Parameters | True statements about a CONV layer's parameters | MCQ (multi) | M | P1 | Depends on input depth; biases = filters | W19 1(j) | NEAR_EXACT |
| O9 | CNN | Motivation | Benefits of conv layers over FC layers for images | Short answer | E | P1 | Fewer params, locality, equivariance | W19 2(f); T45 #40 | RELATED |
| O10 | CNN | Weight sharing | Where does weight sharing occur? | MCQ | E | P1 | CNN and RNN | IB MCQ9 | RELATED |
| O6 | CNN | 1×1 conv | Parameters of one 1×1 filter on 64×64×16 input | MCQ | E | P2 | 17 | W21 1(c) | RELATED |
| O7 | CNN | 1×1 conv | What 1×1 conv and max pooling can reduce | MCQ (multi) | M | P2 | 1×1 conv: channels; pooling: height/width | W21 1(e) | RELATED |
| O8 | CNN | Compute | Fastest CNN layer in FLOPs | MCQ | M | P2 | Max pooling | F20 1(h) | RELATED |

### 07 Pooling / convolution

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| O2 | Pooling | Parameters | Does max pooling always reduce the number of parameters? | MCQ | E | P0 | No (source key disputed) | IB MCQ8 | EXACT |
| O5 | Pooling | Definition | What is pooling and how does it work? | Short answer | E | P1 | Window max/average, downsampling | T45 #20 | RELATED |
| O11 | Convolution | Padding | SAME vs VALID padding | Conceptual | E | P1 | Pad to keep size vs no padding | T45 #33 | RELATED |

### 08 RNN

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| O14 | RNN | Applications | Applications of RNNs | Short answer | E | P1 | Text, speech, captioning, time series | T45 #11 | RELATED |
| O18 | RNN | BPTT | What is truncated BPTT? | Conceptual | M | P2 | Backprop over the last k steps only | — | SAME_CONCEPT |
| O19 | RNN | BiRNN | Main limitation of bidirectional RNNs | MCQ | E | P3 | Needs the whole sequence | — | RELATED |
| O20 | RNN | Normalization | Why LayerNorm rather than BatchNorm in RNNs? | Conceptual | M | P3 | Independent of batch and sequence length | — | RELATED |

### 09 LSTM

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| O13 | LSTM | Mechanism | How does an LSTM network work? | Conceptual | M | P0 | Cell state + forget/input/output gates | T45 #21 | EXACT |
| O15 | LSTM | Vanishing | How does LSTM mitigate vanishing gradients? | Conceptual | M | P2 | Additive cell update, ∂c_t/∂c_{t−1} = diag(f_t) | — | SAME_CONCEPT |
| O16 | LSTM | Gates | Which gates does an LSTM have? | MCQ (multi) | E | P3 | Forget, input, output | — | RELATED |
| O17 | LSTM | GRU | GRU vs LSTM | Conceptual | M | P3 | 2 gates, no cell state, fewer params | — | RELATED |

### 10 Autoencoder

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P1 | Autoencoder | Definition | What is an autoencoder? | Short answer | E | P0 | Reconstructs its input via encoder–code–decoder | T45 #29; IB E5 | EXACT |
| P4 | Autoencoder | Learning type | Is an autoencoder supervised or unsupervised? | MCQ | E | P0 | Unsupervised (self-supervised) | — (part of user Q31) | SAME_CONCEPT |
| P2 | Autoencoder | Structure | Layers of an autoencoder | Short answer | E | P1 | Encoder, code, decoder | IB E5 | RELATED |
| P3 | Autoencoder | Uses | Uses of autoencoders | Short answer | E | P1 | Dim. reduction, denoising, anomalies, features | T45 #34; IB E4 | RELATED |
| P6 | Autoencoder | VAE loss | Loss giving both reconstruction and an N(0, I)-like latent space | MCQ | M | P2 | MSE + KL | F22 | RELATED |

### 11 GAN

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P7 | GAN | Concepts | GAN generating apples — which proposition is false? | MCQ | M | P0 | Discriminator as apple/non-apple classifier | W19 1(a) | EXACT |
| P8 | GAN | Definition | Explain generative adversarial networks | Short answer | E | P1 | Generator vs discriminator game | T45 #28 | RELATED |
| P9 | GAN | Loss | Which is the non-saturating generator cost? | MCQ | M | P1 | −(1/m) Σ log D(G(z)) | W19 1(d) | RELATED |
| P10 | GAN | Mode collapse | Indicators of mode collapse | MCQ (multi) | M | P2 | Single-mode samples; oscillating G loss | F20 1(g) | RELATED |
| P11 | GAN | Convergence | Training is done when D(G(z)) ≈ 1? | True/False | E | P2 | False (≈ 0.5) | F22 | RELATED |

### 12 Loss functions

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P12 | Loss | Matching | Match regression / binary / multiclass with MSE, MAE, Huber, BCE, multiclass CE, sparse multiclass CE, KL | Matching | M | P0 | MSE, MAE, Huber / BCE / CE, sparse CE, KL | Source not identified (names: MLM) | UNCONFIRMED |
| P13 | Loss | Outliers | L1 vs L2 regression loss with many outliers | MCQ | E | P1 | L1 | W19 5(b) | RELATED |
| P14 | Loss | Sparsity | Does L1 loss make network weights sparse? | True/False | M | P1 | No | W19 5(c) | RELATED |
| P16 | Loss | Probabilistic | Hinge vs logistic loss for a probability-like output | MCQ | M | P1 | Logistic | W19 5(g) | RELATED |
| P17 | Loss | Task types | Multi-class vs multi-label classification | Conceptual | E | P1 | Exclusive softmax vs independent sigmoids | IB F15 | RELATED |

### 13 Normalization

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P21 | Normalization | Batch norm | What is batch normalization? | Short answer | E | P0 | Mini-batch standardization + γ, β | T45 #15 | EXACT |
| P18 | Normalization | Data normalization | When is data normalization useful? | Conceptual | E | P0 | Different scales; gradient- and distance-based methods | T45 #4; IB F12 | NEAR_EXACT |
| P22 | Normalization | Batch norm | Which statement about Batchnorm is true (dropout? faster? centers dataset?) | MCQ | M | P0 | Makes training faster | W19 1(f) | NEAR_EXACT |
| P19 | Normalization | Data normalization | Data normalization techniques | Short answer | E | P1 | Min-max, z-score, max-abs, log, unit norm | IB F13 | RELATED |
| P20 | Normalization | Data normalization | True statements about normalizing train/test inputs | MCQ (multi) | M | P2 | Use train statistics on test; changes loss landscape | F18 1(b) | SAME_CONCEPT |
| P23 | Normalization | Batch norm | True statements about Batch Norm | MCQ (multi) | M | P2 | Speeds learning; adds mini-batch noise | W21 1(b) | SAME_CONCEPT |

### 14 Regularization / overfitting

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P25 | Regularization | Overfitting | Which strategy does NOT prevent overfitting? | MCQ | E | P0 | Pooling | T45 #41; IB MCQ10 | EXACT |
| P24 | Regularization | Dropout | What is dropout? | Short answer | E | P0 | Random unit dropping during training | T45 #15; IB E3 | EXACT |
| P27 | Regularization | Overfitting | What prevents overfitting (overfitting vs underfitting)? | Conceptual | E | P0 | Data/augmentation, dropout, L1/L2, early stopping… | T45 #17 | SAME_CONCEPT |
| P15 | Regularization | L1 | Which regularization leads to sparse weights? | MCQ | E | P1 | L1 | W19 2(b) | RELATED |
| P28 | Regularization | Train/test gap | Common method to reduce a 100%/42% train/test gap | MCQ | E | P1 | Dropout | W19 1(e) | RELATED |
| P33 | Regularization | Augmentation | What is data augmentation? | Short answer | E | P1 | Label-preserving transforms | T45 #38; W19 3(c) | RELATED |
| P26 | Regularization | Overfitting | Which does NOT prevent overfitting (augmentation, dropout, early stopping, none)? | MCQ | E | P2 | None of the above | F18 1(a) | SAME_CONCEPT |
| P29 | Regularization | Overfitting | Techniques that reduce overfitting | MCQ (multi) | E | P2 | Augmentation, dropout, BN | F20 1(c) | SAME_CONCEPT |
| P30 | Regularization | Dropout | True statements about dropout | MCQ | M | P2 | None of the above | F20 1(e) | SAME_CONCEPT |
| P31 | Regularization | Dropout | Number of distinct dropout sub-networks for N nodes | MCQ | M | P2 | 2ᴺ | F22 1(d) | SAME_CONCEPT |
| P32 | Regularization | Early stopping | Benefit of patience k = 5 | MCQ | E | P2 | Robustness to validation noise | F22 1(e) | SAME_CONCEPT |
| P34 | Regularization | Priors, BN | True statements on regularization | MCQ (multi) | M | P2 | BN implicit regularization; too-strong λ underfits | W21 1(f) | SAME_CONCEPT |
| P35 | Regularization | Underfitting | High training error — what to try? | MCQ (multi) | M | P2 | Bigger network; higher keep prob | W21 1(a) | SAME_CONCEPT |
| P36 | Regularization | Bias/variance | High train loss on 20 examples — train on 10 000? | MCQ | M | P2 | No, it's a bias problem | W19 2(e) | SAME_CONCEPT |

### 15 Supervised vs unsupervised

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| P5 | Learning types | Matching | Match CNN, RNN, autoencoder, GAN with supervised / unsupervised | Matching | E | P0 | CNN, RNN supervised; AE, GAN unsupervised | Source not identified | UNCONFIRMED |

(P4 in section 10 is the single-item variant.)

### 16 Numerical / calculation

| ID | Topic | Subtopic | Canonical question | Type | Diff | Priority | Answer | Source | Match |
|---|---|---|---|---|---|---|---|---|---|
| Q1 | Calculation | MLP output | Inputs 1, 2, 3; weights 4, 5, 6; linear activation with constant 3 — output? | Calculation / MCQ | E | P0 | 96 | IB MCQ1; BR | EXACT |
| Q2 | Calculation | Conv output | 28×28 input, 7×7 kernel, stride 1 — output size? | Calculation / MCQ | E | P0 | 22×22 | IB MCQ2 | EXACT |
| Q3 | Calculation | CNN table | Activation sizes and parameter counts for a 7-layer CNN on 128×128×3 | Numerical | M | P1 | See trainer Q3 | W19 3(d) | RELATED |
| Q4 | Calculation | Softmax | softmax([0.3, 0.3, 0.3]) | Calculation / MCQ | E | P1 | [1/3, 1/3, 1/3] | W19 3(f) | RELATED |
| Q10 | Calculation | Iterations | Iterations per epoch for N = 10 000, B = 200 | Calculation / MCQ | E | P1 | 50 | T45 #23 | RELATED |
| Q5 | Calculation | Parameters | 2-layer network, 5 neurons per layer, 60 parameters? | True/False | E | P2 | True (assuming 5 inputs) | F19 1(a) | RELATED |
| Q6 | Calculation | Parameters | FC(2) vs conv(3×2×2, s = 2) on 10×10×3 — parameter difference | MCQ | M | P2 | Conv has 563 fewer | F19 1(b) | RELATED |
| Q7 | Calculation | Conv output | Output shape of that conv layer | MCQ | E | P2 | (5, 5, 3) | F19 1(c) | RELATED |
| Q8 | Calculation | Parameters | 300 → 80 → 1 network — total parameters | MCQ | E | P2 | 24 161 | W20 1(d) | RELATED |
| Q9 | Calculation | Linear collapse | Show a net without hidden activations equals logistic regression | Formula | M | P2 | w′ = W[2]W[1], b′ = W[2]b[1] + b[2] | W20 1(f) | RELATED |
| Q11 | Calculation | Parameters | Conv 3×3, 64 → 128 channels, with bias | MCQ | E | P3 | 73 856 | — | SAME_CONCEPT |
| Q12 | Calculation | Conv output | 32×32, 5×5, stride 2, padding 0 | MCQ | E | P3 | 14×14 | — | SAME_CONCEPT |
| Q13 | Calculation | Conv output | 28×28, 3×3, stride 1, padding 1 | MCQ | E | P3 | 28×28 | — | SAME_CONCEPT |
| Q14 | Calculation | Pooling | MaxPool 2×2, stride 2 on 28×28×32 — size and parameters | MCQ | E | P3 | 14×14×32, 0 | — | SAME_CONCEPT |
| Q15 | Calculation | Parameters | Conv 5×5, 3 → 16 channels, with bias | MCQ | E | P3 | 1 216 | — | SAME_CONCEPT |

---

## Output 4 — Top 50 questions to study (P0/P1 only, ordered by topic)

All 30 P0 questions, then the 20 P1 questions taken from the three sources that produced exact exam matches
(CS230 Winter 2019, InterviewBit MCQ section, Top 45).

| # | ID | Topic | Question | Priority |
|---|---|---|---|---|
| 1 | N28 | Fundamentals | NN built solely on linear regression | P0 |
| 2 | N26 | Fundamentals | How hyperparameters are tuned | P0 |
| 3 | N1 | Activations | Role of an activation function | P0 |
| 4 | N2 | Activations | What is an activation function, why needed | P0 |
| 5 | N3 | Activations | Softmax and ReLU | P0 |
| 6 | N4 | Activations | Match tasks with Sigmoid / Softmax / ReLU | P0 |
| 7 | N5 | Activations | Output activation for probabilities summing to 1 | P1 |
| 8 | N6 | Activations | What gives non-linearity | P1 |
| 9 | N7 | Activations | Activation that causes vanishing gradients | P1 |
| 10 | N12 | Activations | σ(ReLU(z)) output problem | P1 |
| 11 | N13 | Optimization | What is gradient descent | P0 |
| 12 | N14 | Optimization | Order of gradient-descent steps | P0 |
| 13 | N15 | Optimization | What is batch GD | P0 |
| 14 | N16 | Optimization | Batch vs mini-batch vs stochastic GD | P0 |
| 15 | N35 | Backprop | RNN vs feed-forward backprop | P0 |
| 16 | N34 | Backprop | What is backpropagation | P1 |
| 17 | N37 | Backprop | Vanishing and exploding gradients | P1 |
| 18 | N42 | Initialization | Train with all biases zero | P0 |
| 19 | N43 | Initialization | Train with all weights zero | P0 |
| 20 | O1 | CNN | Layers of a CNN | P0 |
| 21 | O3 | CNN | What determines # parameters | P0 |
| 22 | O4 | CNN | True statements about CONV-layer parameters | P1 |
| 23 | O9 | CNN | Conv vs FC benefits | P1 |
| 24 | O10 | CNN | Where weight sharing occurs | P1 |
| 25 | O12 | Fundamentals/CNN | Max connections 10 → 5 | P1 |
| 26 | O2 | Pooling | Does max pooling always reduce parameters | P0 |
| 27 | O5 | Pooling | What is pooling | P1 |
| 28 | O13 | LSTM | How LSTM works | P0 |
| 29 | P1 | Autoencoder | What is an autoencoder | P0 |
| 30 | P4 | Autoencoder | Supervised or unsupervised | P0 |
| 31 | P7 | GAN | GAN apples — false proposition | P0 |
| 32 | P9 | GAN | Non-saturating generator cost | P1 |
| 33 | P12 | Loss | Match tasks with loss functions | P0 |
| 34 | P13 | Loss | L1 vs L2 with outliers | P1 |
| 35 | P14 | Loss | Does L1 loss sparsify weights | P1 |
| 36 | P16 | Loss | Hinge vs logistic for probability outputs | P1 |
| 37 | P18 | Normalization | When is data normalization useful | P0 |
| 38 | P21 | Normalization | What is batch normalization | P0 |
| 39 | P22 | Normalization | Batchnorm true statement | P0 |
| 40 | P24 | Regularization | What is dropout | P0 |
| 41 | P25 | Regularization | Strategy that does NOT prevent overfitting | P0 |
| 42 | P27 | Regularization | What prevents overfitting | P0 |
| 43 | P15 | Regularization | Regularization giving sparse weights | P1 |
| 44 | P28 | Regularization | Fix for a 100%/42% train/test gap | P1 |
| 45 | P33 | Regularization | Data augmentation | P1 |
| 46 | P5 | Learning types | Match CNN/RNN/AE/GAN with supervised/unsupervised | P0 |
| 47 | Q1 | Calculation | MLP 1, 2, 3 × 4, 5, 6 with f(x) = 3x | P0 |
| 48 | Q2 | Calculation | 28×28 with 7×7 kernel, stride 1 | P0 |
| 49 | Q3 | Calculation | CNN layer table (CS230) | P1 |
| 50 | Q4 | Calculation | Softmax of [0.3, 0.3, 0.3] | P1 |

---

## Output 5 — Source gaps

**No source identified**
- **Loss-function matching (user Q10).** No page or exam with this exact matching task was found. The loss names match MLM exactly, but MLM has no Huber loss, so the exam list was probably edited by the instructor.
- **Activation matching (user Q18).** Not found. InterviewBit has related pieces (softmax MCQ, multi-class vs multi-label) but no matching task.
- **Supervised / unsupervised matching for CNN, RNN, autoencoder, GAN (user Q31).** Not found in any exam or bank checked. The textbook framing (CNN/RNN supervised, AE/GAN unsupervised or self-supervised) is used as the key.

**Missing loss function (user Q10).** Could not be confirmed. MLM's list contains three losses the user did not mention: Mean Squared Logarithmic Error (regression), Hinge and Squared Hinge (binary). If the exam list followed MLM, the forgotten item is most likely one of these, but nothing confirms it.

**Uncertain answers and disputed keys**
- **KL divergence placement (P12).** MLM places KL under multi-class classification, and that is the trainer key. An instructor may instead treat KL as a distribution loss that belongs to none of the three tasks.
- **Regression row in activation matching (N4).** The standard answer is a linear output. ReLU is marked only because it is the one remaining candidate, and it fits only non-negative targets.
- **InterviewBit MCQ 8, max pooling (O2).** The extracted key reads "True". That is wrong: pooling has no parameters. The trainer uses "No".
- **InterviewBit MCQ 2, 28×28 / 7×7 (Q2).** Two automatic extractions of the page gave different keys (21×21 and 22×22). The MCQ widget loads dynamically and could not be read raw. With padding 0 the correct answer is 22×22.
- **CS230 Fall 2018 1(e), W[1] after one update from zero init (N46).** The official key says entries may have mixed signs. By the chain rule, dW[1] = 0 on the first update because W[2] = 0, so the trainer key is "all zeros" with a note.
- **Batchnorm "similar to dropout?" (user Q19).** The user remembers "similar to"; CS230 asks whether Batchnorm is "another way of performing dropout". Both BN and dropout add noise, but under the CS230 key the answer is no.
- **Weak source answers.** T45 answers are shallow or partly wrong for #6, #7, #8, #17, #29 and #45. InterviewBit's answer to E7 is shallow. The trainer notes each case.

**Weak evidence or ambiguous remembered wording**
- **MLP calculation (user Q9).** The source says "linear constant value of 3", which could be read as f(x) ≡ 3. The source key (96) confirms f(x) = 3x.
- **28×28 convolution (user Q27).** The user remembers "matrix/image". The source does not mention padding.
- **Hyperparameters (user Q7).** The user remembers "tuned/trained"; the source says "train".
- **Data normalization (user Q16).** The user asks when it is useful; the source asks what it is and why it is needed.
- **GAN options (user Q11).** All four options were recovered from CS230 Winter 2019 1(a); nothing is missing.
- **Top 45 origin.** The PDF is an anonymous Kaggle attachment. Its wording matches Simplilearn's interview article, but the live Simplilearn page was rewritten, so the original was not verified.

**Probably written by the instructor**
- The three matching tasks: losses, activations, supervised vs unsupervised.
- Paired yes/no items (biases = 0, weights = 0) split out from InterviewBit's single combined question.

**Not checked in this pass**
- CS231n, EPFL, MIT, CMU, Toronto and ETH exams. No match was needed after the Stanford and interview-bank hits, so these remain an open lead.
- The chao-xi GitHub mirror, FreeTimeLearning, Naukri, Testbook, CourseHero, Studocu and Quizlet.
