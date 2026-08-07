# test.py
import sys
import os

# मुख्य फ़ाइल से फंक्शन्स इम्पोर्ट करें
from run_vinqi_pipelinesCopy import (
    convert_e52_to_e23, 
    process_c_character_section, 
    process_t_character_section, 
    convert_e23_to_x38_day_by_day_engine
)

def run_tests():
    print("=== STARTING PIPELINE TEST CASES ===\n")

    # 1. 'c' वर्ण के टेस्टकेस
    c_test_cases = {
        "back": "bak",
        "cat": "kat",
        "cell": "sll",
        "city": "sity",
        "cycle": "saikxl"
    }
    
    print("--- Testing 'c' Character Section ---")
    for word, expected in c_test_cases.items():
        result = process_c_character_section(word)
        status = "PASSED" if result == expected else f"FAILED (Got: {result})"
        print(f"Input: {word:<8} | Expected: {expected:<8} | Result: {result:<8} | Status: {status}")

    print("\n--- Testing 't' Character Section (thr* -> Jr*) ---")
    t_test_cases = {
        "thread": "Jread",
        "throw": "Jrow",
        "throne": "Jrone"
    }

    for word, expected in t_test_cases.items():
        result = process_t_character_section(word)
        status = "PASSED" if result == expected else f"FAILED (Got: {result})"
        print(f"Input: {word:<10} | Expected: {expected:<10} | Result: {result:<10} | Status: {status}")

    print("\n--- Testing e52 -> e23 Special Mappings (wet/vet) ---")
    e52_test_cases = {
        "wet": "wxt",
        "vet": "wyet"
    }

    for word, expected in e52_test_cases.items():
        result = convert_e52_to_e23(word)
        status = "PASSED" if result == expected else f"FAILED (Got: {result})"
        print(f"Input: {word:<10} | Expected: {expected:<10} | Result: {result:<10} | Status: {status}")

    print("\n--- Testing Specific Root & Ough Rules ---")
    general_test_cases = {
        "giant": "zaent",
        "ginger": "zinzxr",
        "girl": "grl",
        "gif": "gif",
        "gimcrack": "zimkrxk",
        "wait": "weyt",
        "weight": "wext",
        "write": "rayit",
        "rough": "ruf",
        "tough": "tuf"
    }

    for word, expected in general_test_cases.items():
        result = convert_e23_to_x38_day_by_day_engine(word)
        status = "PASSED" if result == expected else f"FAILED (Got: {result})"
        print(f"Input: {word:<10} | Expected: {expected:<10} | Result: {result:<10} | Status: {status}")

    print("\n--- Testing 'x...' & Pattern Cases ---")
    x_pattern_test_cases = {
        "extra": "extrx",
        "xray": "xray"
    }

    for word, expected in x_pattern_test_cases.items():
        result = convert_e23_to_x38_day_by_day_engine(word)
        status = "PASSED" if result == expected else f"FAILED (Got: {result})"
        print(f"Input: {word:<15} | Expected: {expected:<15} | Result: {result:<15} | Status: {status}")

    print("\n=== ALL TESTS COMPLETED ===")

if __name__ == "__main__":
    run_tests()