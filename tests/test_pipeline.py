#!/usr/bin/env python3
"""
Tests for the Pipeline module.

These tests validate that the data pipeline functions correctly
and produces consistent, deterministic results.
"""

import unittest
import os
import tempfile
from datetime import datetime

# Import the module to test
from src import pipeline


class TestPipeline(unittest.TestCase):
    """Test cases for the Pipeline module."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a temporary directory for test data
        self.test_dir = tempfile.TemporaryDirectory()
        self.data_dir = os.path.join(self.test_dir.name, "data")
        os.makedirs(self.data_dir, exist_ok=True)
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Clean up temporary directory
        self.test_dir.cleanup()
    
    def test_parse_date(self):
        """Test that _parse_date correctly parses various date formats."""
        test_cases = [
            ("2023-01-31", datetime(2023, 1, 31)),
            ("31/01/2023", datetime(2023, 1, 31)),
            ("31-01-2023", datetime(2023, 1, 31)),
            ("01/31/2023", datetime(2023, 1, 31)),
            ("31 Jan 2023", datetime(2023, 1, 31)),
            ("31 January 2023", datetime(2023, 1, 31)),
            ("January 31, 2023", datetime(2023, 1, 31))
        ]
        
        for date_str, expected in test_cases:
            result = pipeline._parse_date(date_str)
            self.assertEqual(result, expected, f"Failed to parse date: {date_str}")
        
        # Test invalid date
        result = pipeline._parse_date("invalid date")
        self.assertIsNone(result)
    
    def test_parse_numbers(self):
        """Test that _parse_numbers correctly parses number strings."""
        test_cases = [
            ("1,2,3,4,5", [1, 2, 3, 4, 5]),
            ("10, 20, 30, 40, 50", [10, 20, 30, 40, 50]),
            ("7,14,21,28,35,42,49", [7, 14, 21, 28, 35, 42, 49])
        ]
        
        for numbers_str, expected in test_cases:
            result = pipeline._parse_numbers(numbers_str)
            self.assertEqual(result, expected, f"Failed to parse numbers: {numbers_str}")
        
        # Test with different delimiter
        result = pipeline._parse_numbers("1|2|3|4|5", delimiter="|")
        self.assertEqual(result, [1, 2, 3, 4, 5])
        
        # Test invalid numbers
        result = pipeline._parse_numbers("1,2,invalid,4,5")
        self.assertEqual(result, [])
    
    def test_generate_synthetic_data(self):
        """Test that generate_synthetic_data produces the expected output."""
        # Generate data for different lottery types
        lottery_types = ["mega7", "easy6", "fast5", "powerball", "euromillions", "omillionaire"]
        
        for lottery_type in lottery_types:
            # Generate a small dataset with a fixed seed
            data = pipeline.generate_synthetic_data(lottery_type, num_draws=10, seed=42)
            
            # Check that we have the correct number of draws
            self.assertEqual(len(data), 10, f"Wrong number of draws for {lottery_type}")
            
            # Check that each draw has the expected structure
            for draw in data:
                self.assertIn("date", draw)
                self.assertIn("numbers", draw)
                self.assertIn("lottery", draw)
                self.assertEqual(draw["lottery"], lottery_type)
                
                # Check that numbers are sorted
                self.assertEqual(draw["numbers"], sorted(draw["numbers"]))
                
                # Check special fields for certain lotteries
                if lottery_type == "powerball":
                    self.assertIn("powerball", draw)
                elif lottery_type == "euromillions":
                    self.assertIn("stars", draw)
                    self.assertEqual(len(draw["stars"]), 2)
    
    def test_save_and_load_synthetic_data(self):
        """Test that synthetic data can be saved and loaded correctly."""
        # Generate synthetic data
        lottery_type = "mega7"
        original_data = pipeline.generate_synthetic_data(lottery_type, num_draws=10, seed=42)
        
        # Save the data
        file_path = os.path.join(self.data_dir, "test_mega7.csv")
        success = pipeline.save_synthetic_data(original_data, file_path)
        self.assertTrue(success, "Failed to save synthetic data")
        self.assertTrue(os.path.exists(file_path), "File was not created")
        
        # Monkey patch the load function to use our test directory
        original_join = os.path.join
        
        def mock_join(path, *paths):
            if path == "data":
                return os.path.join(self.data_dir, *paths)
            return original_join(path, *paths)
        
        os.path.join = mock_join
        
        try:
            # Load the data
            loaded_data = pipeline.load_lottery_data("mega7")
            
            # Check that the data was loaded correctly
            self.assertIsNotNone(loaded_data, "Failed to load data")
            self.assertEqual(len(loaded_data), len(original_data), "Wrong number of draws loaded")
            
            # Check that the loaded data has the expected structure
            for draw in loaded_data:
                self.assertIn("numbers", draw)
                self.assertEqual(len(draw["numbers"]), 7, "Wrong number of numbers")
                self.assertEqual(draw["lottery"], "mega7")
        finally:
            # Restore the original join function
            os.path.join = original_join
    
    def test_ensure_data_files_exist(self):
        """Test that ensure_data_files_exist creates the necessary files."""
        # Monkey patch the functions to use our test directory
        original_exists = os.path.exists
        original_join = os.path.join
        
        def mock_exists(path):
            if path == "data":
                return os.path.exists(self.data_dir)
            if path.startswith("data/"):
                return os.path.exists(path.replace("data/", f"{self.data_dir}/"))
            return original_exists(path)
        
        def mock_join(path, *paths):
            if path == "data":
                return os.path.join(self.data_dir, *paths)
            return original_join(path, *paths)
        
        os.path.exists = mock_exists
        os.path.join = mock_join
        
        try:
            # Call the function
            pipeline.ensure_data_files_exist()
            
            # Check that the files were created
            expected_files = [
                "Emirates_Draw_MEGA7.csv",
                "Emirates_Draw_EASY6.csv",
                "Emirates_Draw_FAST5.csv",
                "Powerball_USA.csv",
                "EuroMillions.csv",
                "OMillionaire.csv"
            ]
            
            for file_name in expected_files:
                file_path = os.path.join(self.data_dir, file_name)
                self.assertTrue(os.path.exists(file_path), f"File not created: {file_name}")
        finally:
            # Restore the original functions
            os.path.exists = original_exists
            os.path.join = original_join
    
    def test_deterministic_results(self):
        """Test that the pipeline produces deterministic results with the same seed."""
        # Generate data twice with the same seed
        seed = 42
        data1 = pipeline.generate_synthetic_data("mega7", num_draws=10, seed=seed)
        data2 = pipeline.generate_synthetic_data("mega7", num_draws=10, seed=seed)
        
        # Check that the results are identical
        self.assertEqual(len(data1), len(data2))
        
        for i in range(len(data1)):
            self.assertEqual(data1[i]["numbers"], data2[i]["numbers"])


if __name__ == '__main__':
    unittest.main()