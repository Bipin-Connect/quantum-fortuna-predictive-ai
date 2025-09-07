#!/usr/bin/env python3
"""
Tests for the RNG module.

These tests validate that the quantum-inspired RNG functions correctly
and produces output with the expected properties.
"""

import unittest
from unittest.mock import patch
import random
import statistics
from collections import Counter

# Import the module to test
from src import rng


class TestRNG(unittest.TestCase):
    """Test cases for the RNG module."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Set a fixed seed for reproducibility
        random.seed(42)
    
    def test_generate_quantum_random_bit(self):
        """Test that generate_quantum_random_bit returns valid bits."""
        # Generate a sample of bits
        bits = [rng.generate_quantum_random_bit() for _ in range(100)]
        
        # Check that all values are valid bits (0 or 1)
        for bit in bits:
            self.assertIn(bit, [0, 1])
        
        # Check that we have a reasonable distribution
        # (not all 0s or all 1s)
        zeros = bits.count(0)
        ones = bits.count(1)
        
        # In 100 random bits, it's extremely unlikely to get all 0s or all 1s
        self.assertGreater(zeros, 0, "Expected some 0s in random bits")
        self.assertGreater(ones, 0, "Expected some 1s in random bits")
    
    def test_generate_quantum_random_int(self):
        """Test that generate_quantum_random_int returns integers in the specified range."""
        # Test with different ranges
        test_ranges = [(1, 10), (1, 100), (50, 60)]
        
        for min_val, max_val in test_ranges:
            # Generate a sample of integers
            ints = [rng.generate_quantum_random_int(min_val, max_val) for _ in range(50)]
            
            # Check that all values are within the specified range
            for val in ints:
                self.assertGreaterEqual(val, min_val)
                self.assertLessEqual(val, max_val)
                self.assertEqual(val, int(val))  # Check that it's an integer
            
            # Check that we have a reasonable distribution
            # (not all the same value)
            unique_values = set(ints)
            self.assertGreater(len(unique_values), 1, "Expected multiple unique values")
    
    def test_generate_quantum_random_numbers_unique(self):
        """Test that generate_quantum_random_numbers returns unique numbers when requested."""
        # Test with different parameters
        test_params = [(1, 10, 5), (1, 50, 6), (1, 45, 5)]
        
        for min_val, max_val, count in test_params:
            # Generate unique numbers
            numbers = rng.generate_quantum_random_numbers(min_val, max_val, count, unique=True)
            
            # Check that we have the correct number of values
            self.assertEqual(len(numbers), count)
            
            # Check that all values are within the specified range
            for val in numbers:
                self.assertGreaterEqual(val, min_val)
                self.assertLessEqual(val, max_val)
            
            # Check that all values are unique
            self.assertEqual(len(numbers), len(set(numbers)))
    
    def test_generate_quantum_random_numbers_non_unique(self):
        """Test that generate_quantum_random_numbers can return non-unique numbers."""
        # Use a small range and large count to ensure duplicates
        min_val, max_val, count = 1, 5, 20
        
        # Generate non-unique numbers
        numbers = rng.generate_quantum_random_numbers(min_val, max_val, count, unique=False)
        
        # Check that we have the correct number of values
        self.assertEqual(len(numbers), count)
        
        # Check that all values are within the specified range
        for val in numbers:
            self.assertGreaterEqual(val, min_val)
            self.assertLessEqual(val, max_val)
    
    def test_generate_quantum_random_numbers_error(self):
        """Test that generate_quantum_random_numbers raises an error when appropriate."""
        # Try to generate more unique numbers than possible
        with self.assertRaises(ValueError):
            rng.generate_quantum_random_numbers(1, 5, 10, unique=True)
    
    def test_uniformity(self):
        """Test that the RNG produces a uniform distribution."""
        # Generate a large sample
        min_val, max_val = 1, 10
        count = 1000
        numbers = [rng.generate_quantum_random_int(min_val, max_val) for _ in range(count)]
        
        # Count occurrences of each value
        counter = Counter(numbers)
        
        # Calculate expected count for a uniform distribution
        expected_count = count / (max_val - min_val + 1)
        
        # Check that each value occurs with roughly the expected frequency
        # Allow for some deviation (3 standard deviations)
        std_dev = (expected_count * (1 - 1/(max_val - min_val + 1)))**0.5
        allowed_deviation = 3 * std_dev
        
        for val in range(min_val, max_val + 1):
            self.assertLessEqual(
                abs(counter[val] - expected_count),
                allowed_deviation,
                f"Value {val} occurred {counter[val]} times, expected around {expected_count}"
            )
    
    @patch('src.rng.QISKIT_AVAILABLE', False)
    def test_fallback_to_random(self):
        """Test that the RNG falls back to the random module when Qiskit is not available."""
        # Generate some random bits
        bits = [rng.generate_quantum_random_bit() for _ in range(10)]
        
        # Check that all values are valid bits (0 or 1)
        for bit in bits:
            self.assertIn(bit, [0, 1])
        
        # Generate some random integers
        ints = [rng.generate_quantum_random_int(1, 10) for _ in range(10)]
        
        # Check that all values are within the specified range
        for val in ints:
            self.assertGreaterEqual(val, 1)
            self.assertLessEqual(val, 10)
    
    def test_get_rng_explanation(self):
        """Test that get_rng_explanation returns a non-empty string."""
        explanation = rng.get_rng_explanation()
        self.assertIsInstance(explanation, str)
        self.assertGreater(len(explanation), 0)


if __name__ == '__main__':
    unittest.main()