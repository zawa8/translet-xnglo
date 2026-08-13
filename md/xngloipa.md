# IPA to Vinqi/E23 Phonetic Mapping Reference (Latest)

This document outlines the standard International Phonetic Alphabet (IPA) mappings and corresponding custom grapheme/phoneme replacement rules used in the pipeline engines (`run_vinqi_pipelinesCopy.py`).

## 1. Consonant Rules & Special Overrides
* **`c` Transformations (`process_c_character_section`):**
  * `cell` $\rightarrow$ `sll` (Exact override)
  * `cycle` $\rightarrow$ `saikxl` (Exact override)
  * `ck` $\rightarrow$ `k`
  * `ch` $\rightarrow$ `C`
  * `cy` $\rightarrow$ `si`
  * `ce` $\rightarrow$ `se`
  * `ci` $\rightarrow$ `si`
  * `c` $\rightarrow$ `k`

* **`t` Transformations (`process_t_character_section`):**
  * Starting `thr*` $\rightarrow$ `Jr*` (e.g., `thread` $\rightarrow$ `Jread`)

* **General & Suffix Rules (`process_g_character_section`):**
  * Ending `ough$` $\rightarrow$ `f` (e.g., `rough` $\rightarrow$ `ruf`, `tough` $\rightarrow$ `tuf`)
  * `igh` $\rightarrow$ `ai`

## 2. Special Word & E52 Mappings (`convert_e52_to_e23`)
* `wet` $\rightarrow$ `wxt`
* `vet` $\rightarrow$ `wyet`
* `never` $\rightarrow$ `nxwxr`

## 3. Prefix & Root Morphological Handling (`X38_PREFIX_MAP`)
* `un` $\rightarrow$ `xn`
* `re` $\rightarrow$ `ri`
* `in` $\rightarrow$ `in`
* `dis` $\rightarrow$ `dis`