# ШПАРГАЛКА: то, что спрашивают чаще всего

## Ш.1 Функции потерь ↔ задачи (задание «сопоставьте» из билета)

| Функция потерь | Формула | Задача |
|---|---|---|
| **MSE (Mean Square Error)** | (1/n)Σ(y−ŷ)² | **Регрессия** (чувствительна к выбросам) |
| **MAE (Mean Absolute Error)** | (1/n)Σ\|y−ŷ\| | **Регрессия** (устойчива к выбросам, недифференцируема в 0) |
| **Huber Loss** | MSE при малой ошибке, MAE при большой | **Регрессия** (компромисс, робастна) |
| **Binary Cross-Entropy** | −[y log ŷ + (1−y) log(1−ŷ)] | **Бинарная классификация** (+ multi-label) |
| **Multi-class (Categorical) Cross-Entropy** | −Σ_k y_k log ŷ_k, метки one-hot | **Мультиклассовая классификация** |
| **Sparse Multi-class Cross-Entropy** | то же, но метки — целые числа, а не one-hot | **Мультиклассовая классификация** (экономия памяти) |
| **Hinge Loss** | max(0, 1 − y·ŷ), y ∈ {−1,+1} | Бинарная классификация (SVM), редко в DL |
| **Kullback–Leibler Divergence** | Σ p log(p/q) | Сравнение **распределений**: VAE, дистилляция, не «задача» из трёх |

**Ответ на задание из билета:**
- Regression problem → **2 (MSE), 5 (MAE), 6 (Huber)**
- Binary classification → **3 (Binary Cross-Entropy)** (и 7 Hinge, если разрешено несколько)
- Multi-class classification → **4 (Multi-class CE), 8 (Sparse Multi-class CE)**
- KL Divergence (1) — к этим трём задачам напрямую не относится (это про распределения / VAE / GAN); если надо обязательно распределить — ближе всего к мультиклассовой (CE = KL + энтропия метки).

## Ш.2 Задача ↔ выходная активация

| Задача | Активация выхода | Loss |
|---|---|---|
| Бинарная классификация | sigmoid (1 нейрон) | BCE |
| Мультикласс | softmax (K нейронов) | Categorical CE |
| Multi-label | sigmoid на каждом из K | Σ BCE |
| Регрессия | нет (linear) | MSE / MAE / Huber |
| Скрытые слои | ReLU / Leaky ReLU / GELU | — |

## Ш.3 Supervised / Unsupervised (задание на сопоставление)

| Метод | Тип |
|---|---|
| **CNN** | Supervised (обычно; классификация по меткам) |
| **RNN/LSTM** | Supervised (обычно; языковое моделирование — self-supervised) |
| **Autoencoder** | **Unsupervised** (self-supervised: вход = цель) |
| **GAN** | **Unsupervised** (генеративная модель без меток; CGAN — условная) |
| **Diffusion** | Unsupervised / self-supervised |
| **RL (DQN)** | Третий тип — **обучение с подкреплением**, ни то, ни другое |

> Тонкость для устного ответа: CNN и RNN — это **архитектуры**, а не режимы обучения; их можно обучать и без учителя (автоэнкодер на свёртках). Но в задании «сопоставьте» ожидают: CNN, RNN → supervised; AE, GAN → unsupervised.

## Ш.4 Две формулы, которые надо знать наизусть

**Размер выхода свёртки/пулинга:**
$$H_{out} = \left\lfloor \frac{H_{in} + 2p - d(k-1) - 1}{s}\right\rfloor + 1 \xrightarrow{\ d=1\ } \left\lfloor\frac{H_{in}+2p-k}{s}\right\rfloor+1$$

**Число параметров:**
- Dense: `n_in · n_out + n_out`
- Conv2D: `(k_h · k_w · C_in + 1) · C_out`
- Pooling / Flatten / активации / Dropout: **0 параметров**
- BatchNorm: `2 · C` обучаемых (γ, β) + 2·C буферов

## Ш.5 Что борется с переобучением, а что нет

✅ Dropout, L1/L2 (weight decay), Early stopping, Data augmentation, увеличение выборки, упрощение модели, BatchNorm (побочно), label smoothing, ансамбли.
❌ **Pooling** (это downsampling), увеличение числа эпох, увеличение размера модели, увеличение learning rate.

## Ш.6 Затухание и взрыв градиента

| Проблема | Лечение |
|---|---|
| **Затухание (vanishing)** | ReLU/Leaky ReLU, residual connections, BatchNorm/LayerNorm, LSTM/GRU, правильная инициализация (He/Xavier) |
| **Взрыв (exploding)** | **Gradient clipping**, нормализации, меньший lr, аккуратная инициализация. Функции активации тут **не помогают** |

---

## Ш.7 Формулы тем 8–17

**GCN:** $$H^{(l+1)} = \sigma\big(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}H^{(l)}W^{(l)}\big), \quad \tilde A = A + I$$
**GraphSAGE:** $$h_v^k = \sigma\big(W^k\cdot[\,h_v^{k-1}\,\|\,\text{AGG}(\{h_u^{k-1}\})\,]\big), \quad h_v^k \leftarrow h_v^k/\|h_v^k\|_2$$
**Attention:** $$\text{softmax}\!\Big(\frac{QK^\top}{\sqrt{d_k}}\Big)V$$
**VAE:** $$L = \|x-\hat x\|^2 + D_{KL}\big(N(\mu,\sigma^2)\,\|\,N(0,I)\big), \quad z = \mu + \sigma\odot\varepsilon$$
**GAN:** $$\min_G\max_D\ \mathbb{E}\log D(x) + \mathbb{E}\log\big(1-D(G(z))\big), \quad L_G^{ns} = -\mathbb{E}\log D(G(z)), \quad D^* = \tfrac{p_{data}}{p_{data}+p_g}$$
**Диффузия:** $$x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon, \qquad L = \|\varepsilon - \varepsilon_\theta(x_t,t)\|^2$$
**Classifier-free guidance:** $$\tilde\varepsilon = (1+w)\,\varepsilon_\theta(x_t,c) - w\,\varepsilon_\theta(x_t)$$
**Q-learning:** $$Q(s,a)\leftarrow Q(s,a)+\alpha\big[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\big]$$
**SARSA:** $$Q(s,a)\leftarrow Q(s,a)+\alpha\big[r+\gamma\,Q(s',a')-Q(s,a)\big]$$
**TD(0):** $$V(s)\leftarrow V(s)+\alpha\big[r+\gamma V(s')-V(s)\big]$$
**REINFORCE:** $$\nabla_\theta J = \mathbb{E}\big[\nabla_\theta\log\pi_\theta(a|s)\,(G_t-b)\big]$$
**DQN loss:** $$\big(r+\gamma\max_{a'}Q(s',a';\theta^-)-Q(s,a;\theta)\big)^2$$
**FGSM:** $$x_{adv} = x + \varepsilon\,\operatorname{sign}\big(\nabla_x J(\theta,x,y)\big)$$

## Ш.8 Потери и метрики (тема 17)

| | Формула | Когда |
|---|---|---|
| Huber | ½e² при \|e\| ≤ δ, иначе δ(\|e\| − ½δ) | регрессия с выбросами |
| Focal | −(1 − pₜ)^γ log pₜ | дисбаланс классов |
| KL | Σ p log(p/q) | распределения; CE = H(p) + KL |
| Precision | TP/(TP + FP) | цена ложной тревоги |
| Recall | TP/(TP + FN) | нельзя пропускать |
| F1 | 2PR/(P + R) | баланс при дисбалансе |

**Диагностика:** высокая ошибка на train → смещение (модель больше, дольше обучать); train ≪ dev → дисперсия (регуляризация, данные, аугментация).
