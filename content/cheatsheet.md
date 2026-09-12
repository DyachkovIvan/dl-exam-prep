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
