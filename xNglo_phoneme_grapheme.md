# xNglo Phoneme-Grapheme Mapping

## Overview

This file maps **xNglo phonemes** to their **grapheme representations**.
Each row represents a **base consonant**, and each column represents a
**vowel suffix** (matra). The combination forms a complete syllable.

## Structure

- **First column** = base consonant (or standalone vowel)
- **Other columns** = consonant + vowel combinations
- `+` = base form (no vowel)
- `x` = schwa (अ)
- `a` = ा (matra)
- `i` = ि
- `u` = ु
- `e` = े
- `o` = ो
- `N` = nasal suffix (special)

## Phoneme-Grapheme Matrix

| Base | + | x | a | i | u | e | o | N |
|------|---|---|---|---|---|---|---|---|
| + | + | x | a | i | u | e | o | N |
| x | x | xx | xa | xi | xu | xe | xo | - |
| y | y | xy | ya | yi | yu | ye | yo | - |
| v | v | xv | va | vi | vu | ve | vo | - |
| w | w | xw | wa | wi | wu | we | wo | - |
| l | l | xl | la | li | lu | le | lo | - |
| m | m | xm | ma | mi | mu | me | mo | - |
| n | n | xn | na | ni | nu | ne | no | - |
| r | r | xr | ra | ri | ru | re | ro | - |
| R | R | xR | Ra | Ri | Ru | Re | Ro | - |
| k | k | xk | ka | ki | ku | ke | ko | Nk |
| K | K | xK | Ka | Ki | Ku | Ke | Ko | NK |
| g | g | xg | ga | gi | gu | ge | go | Ng |
| G | G | xG | Ga | Gi | Gu | Ge | Go | NG |
| c | c | xc | ca | ci | cu | ce | co | - |
| C | C | xC | Ca | Ci | Cu | Ce | Co | - |
| z | z | xz | za | zi | zu | ze | zo | - |
| Z | Z | xZ | Za | Zi | Zu | Ze | Zo | - |
| t | t | xt | ta | ti | tu | te | to | - |
| T | T | xT | Ta | Ti | Tu | Te | To | - |
| d | d | xd | da | di | du | de | do | - |
| D | D | xD | Da | Di | Du | De | Do | - |
| j | j | xj | ja | ji | ju | je | jo | - |
| J | J | xJ | Ja | Ji | Ju | Je | Jo | - |
| q | q | xq | qa | qi | qu | qe | qo | - |
| Q | Q | xQ | Qa | Qi | Qu | Qe | Qo | - |
| b | b | xb | ba | bi | bu | be | bo | - |
| B | B | xB | Ba | Bi | Bu | Be | Bo | - |
| s | s | xs | sa | si | su | se | so | - |
| S | S | xS | Sa | Si | Su | Se | So | - |
| p | p | xp | pa | pi | pu | pe | po | - |
| f | f | xf | fa | fi | fu | fe | fo | - |

## Vowel System

| Symbol | Standalone | Matra | Example |
|--------|------------|-------|---------|
| x | अ | - | xm = अम |
| a | आ | ा | kam = काम |
| i | इ | ि | kim = किम |
| u | उ | ु | kum = कुम |
| e | ए | े | kem = केम |
| o | ओ | ो | kom = कोम |

## Special Nasal Combinations

| hskii | Meaning |
|-------|---------|
| Nk | nasal + k |
| NK | nasal + K (aspirated) |
| Ng | nasal + g |
| NG | nasal + G (aspirated) |

## Total Phonemes

- **Base consonants:** 26 (a-z)
- **Aspirated capitals:** 12 (K,G,C,Z,T,D,J,Q,B,S,N,R)
- **Vowel forms:** 7 (x,a,i,u,e,o)
- **Special nasal:** 4 (Nk,NK,Ng,NG)

## References

- CSV source: <https://github.com/zawa8/xnglo/blob/main/dxta/xNglo_phoneme_grapheme.csv>
- Font: <https://github.com/zawa8/font/tree/main/ttf/hscii>
- Keyboard: <https://github.com/zawa8/xNglobord>
