#!/usr/bin/env python3
"""
Data Pipeline Module

This module handles data loading, processing, and transformation for lottery data.
It provides functions to load historical lottery data and prepare it for analysis.
"""

import csv
import logging
import os
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)


def load_lottery_data(lottery_type: str) -> Optional[List[Dict[str, Any]]]:
    """
    Load historical lottery data from CSV files.
    
    Args:
        lottery_type: Type of lottery to load data for
        
    Returns:
        Optional[List[Dict[str, Any]]]: List of historical lottery draws or None if loading fails
    """
    # Map lottery type to file name
    file_mapping = {
        "mega7": "Emirates_Draw_MEGA7.csv",
        "easy6": "Emirates_Draw_EASY6.csv",
        "fast5": "Emirates_Draw_FAST5.csv",
        "powerball": "Powerball_USA.csv",
        "euromillions": "EuroMillions.csv",
        "omillionaire": "OMillionaire.csv"
    }
    
    if lottery_type not in file_mapping:
        logger.error(f"Unknown lottery type: {lottery_type}")
        return None
    
    file_name = file_mapping[lottery_type]
    file_path = os.path.join("data", file_name)
    
    # Check if file exists
    if not os.path.exists(file_path):
        logger.error(f"Data file not found: {file_path}")
        return None
    
    try:
        return _parse_csv_data(file_path, lottery_type)
    except Exception as e:
        logger.exception(f"Error loading data from {file_path}: {e}")
        return None


def _parse_csv_data(file_path: str, lottery_type: str) -> List[Dict[str, Any]]:
    """
    Parse CSV data for a specific lottery type.
    
    Args:
        file_path: Path to the CSV file
        lottery_type: Type of lottery
        
    Returns:
        List[Dict[str, Any]]: List of historical lottery draws
    """
    data = []
    
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                # Parse data based on lottery type
                if lottery_type == "mega7":
                    draw = _parse_mega7_row(row)
                elif lottery_type == "easy6":
                    draw = _parse_easy6_row(row)
                elif lottery_type == "fast5":
                    draw = _parse_fast5_row(row)
                elif lottery_type == "powerball":
                    draw = _parse_powerball_row(row)
                elif lottery_type == "euromillions":
                    draw = _parse_euromillions_row(row)
                elif lottery_type == "omillionaire":
                    draw = _parse_omillionaire_row(row)
                else:
                    logger.warning(f"Unknown lottery type: {lottery_type}, skipping row")
                    continue
                
                if draw is not None:
                    data.append(draw)
            except Exception as e:
                logger.warning(f"Error parsing row: {e}")
                continue
    
    return data


def _parse_date(date_str: str) -> Optional[datetime]:
    """
    Parse date string into datetime object.
    
    Args:
        date_str: Date string
        
    Returns:
        Optional[datetime]: Parsed datetime or None if parsing fails
    """
    date_formats = [
        "%Y-%m-%d",      # 2023-01-31
        "%d/%m/%Y",      # 31/01/2023
        "%d-%m-%Y",      # 31-01-2023
        "%m/%d/%Y",      # 01/31/2023
        "%d %b %Y",      # 31 Jan 2023
        "%d %B %Y",      # 31 January 2023
        "%B %d, %Y"      # January 31, 2023
    ]
    
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    logger.warning(f"Failed to parse date: {date_str}")
    return None


def _parse_numbers(numbers_str: str, delimiter: str = ",") -> List[int]:
    """
    Parse string of numbers into list of integers.
    
    Args:
        numbers_str: String containing numbers
        delimiter: Delimiter between numbers
        
    Returns:
        List[int]: List of parsed numbers
    """
    try:
        return [int(num.strip()) for num in numbers_str.split(delimiter) if num.strip()]
    except ValueError:
        logger.warning(f"Failed to parse numbers: {numbers_str}")
        return []


def _parse_mega7_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the Emirates Draw MEGA7 CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5, Number6, Number7
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 8):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        return {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "mega7"
        }
    except Exception as e:
        logger.warning(f"Error parsing MEGA7 row: {e}")
        return None


def _parse_easy6_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the Emirates Draw EASY6 CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5, Number6
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 7):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        return {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "easy6"
        }
    except Exception as e:
        logger.warning(f"Error parsing EASY6 row: {e}")
        return None


def _parse_fast5_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the Emirates Draw FAST5 CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 6):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        return {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "fast5"
        }
    except Exception as e:
        logger.warning(f"Error parsing FAST5 row: {e}")
        return None


def _parse_powerball_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the Powerball USA CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5, Powerball
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 6):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        # Parse Powerball
        powerball = None
        if "Powerball" in row and row["Powerball"].strip():
            try:
                powerball = int(row["Powerball"])
            except ValueError:
                logger.warning(f"Invalid Powerball value: {row['Powerball']}")
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        result = {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "powerball"
        }
        
        if powerball is not None:
            result["powerball"] = powerball
        
        return result
    except Exception as e:
        logger.warning(f"Error parsing Powerball row: {e}")
        return None


def _parse_euromillions_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the EuroMillions CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5, Star1, Star2
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 6):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        # Parse Stars
        stars = []
        for i in range(1, 3):
            key = f"Star{i}"
            if key in row and row[key].strip():
                try:
                    stars.append(int(row[key]))
                except ValueError:
                    logger.warning(f"Invalid Star value: {row[key]}")
        
        # If we don't have individual star columns, try a combined column
        if not stars and "Stars" in row:
            stars = _parse_numbers(row["Stars"])
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        result = {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "euromillions"
        }
        
        if stars:
            result["stars"] = sorted(stars)
        
        return result
    except Exception as e:
        logger.warning(f"Error parsing EuroMillions row: {e}")
        return None


def _parse_omillionaire_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Parse a row from the OMillionaire CSV file.
    
    Args:
        row: CSV row as dictionary
        
    Returns:
        Optional[Dict[str, Any]]: Parsed draw or None if parsing fails
    """
    try:
        # Expected columns: Date, Number1, Number2, Number3, Number4, Number5, Number6
        date = _parse_date(row.get("Date", ""))
        
        # Try to find number columns
        numbers = []
        for i in range(1, 7):
            key = f"Number{i}"
            if key in row and row[key].strip():
                numbers.append(int(row[key]))
        
        # If we don't have individual number columns, try a combined column
        if not numbers and "Numbers" in row:
            numbers = _parse_numbers(row["Numbers"])
        
        if not numbers:
            logger.warning("No numbers found in row")
            return None
        
        return {
            "date": date,
            "numbers": sorted(numbers),
            "lottery": "omillionaire"
        }
    except Exception as e:
        logger.warning(f"Error parsing OMillionaire row: {e}")
        return None


def generate_synthetic_data(lottery_type: str, num_draws: int = 100, seed: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Generate synthetic lottery data for testing and demonstration.
    
    Args:
        lottery_type: Type of lottery to generate data for
        num_draws: Number of draws to generate
        seed: Random seed for reproducibility
        
    Returns:
        List[Dict[str, Any]]: List of synthetic lottery draws
    """
    if seed is not None:
        np.random.seed(seed)
    
    # Configure lottery parameters
    lottery_config = {
        "mega7": {"range": (1, 50), "count": 7},
        "easy6": {"range": (1, 45), "count": 6},
        "fast5": {"range": (1, 45), "count": 5},
        "powerball": {"range": (1, 69), "count": 5, "powerball": (1, 26)},
        "euromillions": {"range": (1, 50), "count": 5, "stars": (1, 12, 2)},
        "omillionaire": {"range": (1, 45), "count": 6}
    }
    
    config = lottery_config.get(lottery_type)
    if not config:
        logger.error(f"Unknown lottery type: {lottery_type}")
        return []
    
    # Generate synthetic draws
    data = []
    for i in range(num_draws):
        # Generate date (starting from 2020-01-01, one draw per week)
        date = datetime(2020, 1, 1) + datetime.timedelta(days=i * 7)
        
        # Generate main numbers
        numbers = sorted(np.random.choice(
            range(config["range"][0], config["range"][1] + 1),
            size=config["count"],
            replace=False
        ))
        
        draw = {
            "date": date,
            "numbers": numbers,
            "lottery": lottery_type
        }
        
        # Add special balls for certain lotteries
        if "powerball" in config:
            draw["powerball"] = np.random.randint(
                config["powerball"][0],
                config["powerball"][1] + 1
            )
        elif "stars" in config:
            draw["stars"] = sorted(np.random.choice(
                range(config["stars"][0], config["stars"][1] + 1),
                size=config["stars"][2],
                replace=False
            ))
        
        data.append(draw)
    
    return data


def save_synthetic_data(data: List[Dict[str, Any]], file_path: str) -> bool:
    """
    Save synthetic lottery data to a CSV file.
    
    Args:
        data: List of lottery draws
        file_path: Path to save the CSV file
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Determine columns based on the first draw
        if not data:
            logger.error("No data to save")
            return False
        
        first_draw = data[0]
        fieldnames = ["Date"]
        
        # Add number columns
        for i in range(len(first_draw["numbers"])):
            fieldnames.append(f"Number{i+1}")
        
        # Add special columns
        if "powerball" in first_draw:
            fieldnames.append("Powerball")
        elif "stars" in first_draw:
            for i in range(len(first_draw["stars"])):
                fieldnames.append(f"Star{i+1}")
        
        # Write to CSV
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for draw in data:
                row = {"Date": draw["date"].strftime("%Y-%m-%d")}
                
                # Add numbers
                for i, num in enumerate(draw["numbers"]):
                    row[f"Number{i+1}"] = num
                
                # Add special values
                if "powerball" in draw:
                    row["Powerball"] = draw["powerball"]
                elif "stars" in draw:
                    for i, star in enumerate(draw["stars"]):
                        row[f"Star{i+1}"] = star
                
                writer.writerow(row)
        
        logger.info(f"Saved synthetic data to {file_path}")
        return True
    except Exception as e:
        logger.exception(f"Error saving synthetic data: {e}")
        return False


def ensure_data_files_exist() -> None:
    """
    Ensure that data files exist, generating synthetic data if necessary.
    """
    # Check if data directory exists
    if not os.path.exists("data"):
        logger.info("Creating data directory")
        os.makedirs("data", exist_ok=True)
    
    # List of lottery types and file names
    lotteries = [
        ("mega7", "Emirates_Draw_MEGA7.csv"),
        ("easy6", "Emirates_Draw_EASY6.csv"),
        ("fast5", "Emirates_Draw_FAST5.csv"),
        ("powerball", "Powerball_USA.csv"),
        ("euromillions", "EuroMillions.csv"),
        ("omillionaire", "OMillionaire.csv")
    ]
    
    # Check each file and generate synthetic data if needed
    for lottery_type, file_name in lotteries:
        file_path = os.path.join("data", file_name)
        
        if not os.path.exists(file_path):
            logger.info(f"Generating synthetic data for {lottery_type}")
            data = generate_synthetic_data(lottery_type, num_draws=100, seed=42)
            save_synthetic_data(data, file_path)


if __name__ == "__main__":
    # Simple demonstration
    logging.basicConfig(level=logging.INFO)
    
    print("Data Pipeline Demonstration")
    print("==========================")
    print()
    
    # Ensure data files exist
    ensure_data_files_exist()
    
    # Load data for each lottery type
    for lottery_type in ["mega7", "easy6", "fast5", "powerball", "euromillions", "omillionaire"]:
        data = load_lottery_data(lottery_type)
        
        if data:
            print(f"Loaded {len(data)} draws for {lottery_type}")
            print(f"Sample draw: {data[0]}")
        else:
            print(f"Failed to load data for {lottery_type}")
        
        print()