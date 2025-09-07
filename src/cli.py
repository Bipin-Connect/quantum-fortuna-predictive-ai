#!/usr/bin/env python3
"""
Quantum Fortuna CLI - Command Line Interface

This module provides a command-line interface for the Quantum Fortuna project,
which demonstrates why attempts to predict lottery numbers using data science
fail due to the inherent randomness of lottery draws.
"""

import argparse
import logging
import sys
from typing import List, Optional

from . import modeling, pipeline, rng

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)


def setup_parser() -> argparse.ArgumentParser:
    """
    Set up the command-line argument parser.
    
    Returns:
        argparse.ArgumentParser: Configured argument parser
    """
    parser = argparse.ArgumentParser(
        description="Quantum Fortuna - An educational tool demonstrating why predicting lottery numbers fails",
        epilog="⚠️ This is an educational project, not a prediction tool."
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Generate numbers command
    generate_parser = subparsers.add_parser(
        "generate-numbers", 
        help="Generate random lottery numbers using quantum-inspired RNG"
    )
    generate_parser.add_argument(
        "--lottery", 
        type=str, 
        choices=["mega7", "easy6", "fast5", "powerball", "euromillions"],
        default="mega7",
        help="Lottery type to generate numbers for"
    )
    generate_parser.add_argument(
        "--count", 
        type=int, 
        default=1,
        help="Number of sets to generate"
    )
    
    # Evaluate model command
    evaluate_parser = subparsers.add_parser(
        "evaluate-model", 
        help="Evaluate prediction model against random baseline"
    )
    evaluate_parser.add_argument(
        "--lottery", 
        type=str, 
        choices=["mega7", "easy6", "fast5", "powerball", "euromillions"],
        default="mega7",
        help="Lottery type to evaluate"
    )
    evaluate_parser.add_argument(
        "--trials", 
        type=int, 
        default=1000,
        help="Number of trials for evaluation"
    )
    evaluate_parser.add_argument(
        "--seed", 
        type=int, 
        default=42,
        help="Random seed for reproducibility"
    )
    
    return parser


def generate_numbers(lottery: str, count: int) -> None:
    """
    Generate random lottery numbers using quantum-inspired RNG.
    
    Args:
        lottery: Type of lottery to generate numbers for
        count: Number of sets to generate
    """
    lottery_config = {
        "mega7": {"range": (1, 50), "count": 7},
        "easy6": {"range": (1, 45), "count": 6},
        "fast5": {"range": (1, 45), "count": 5},
        "powerball": {"range": (1, 69), "count": 5, "powerball": (1, 26)},
        "euromillions": {"range": (1, 50), "count": 5, "stars": (1, 12, 2)}
    }
    
    config = lottery_config.get(lottery)
    if not config:
        logger.error(f"Unknown lottery type: {lottery}")
        return
    
    logger.info(f"Generating {count} sets of {lottery} numbers using quantum-inspired RNG")
    
    for i in range(count):
        main_numbers = rng.generate_quantum_random_numbers(
            config["range"][0], 
            config["range"][1], 
            config["count"]
        )
        
        result = f"Set {i+1}: {sorted(main_numbers)}"
        
        # Handle special balls for certain lotteries
        if "powerball" in config:
            powerball = rng.generate_quantum_random_numbers(
                config["powerball"][0], 
                config["powerball"][1], 
                1
            )[0]
            result += f" Powerball: {powerball}"
        elif "stars" in config:
            stars = rng.generate_quantum_random_numbers(
                config["stars"][0], 
                config["stars"][1], 
                config["stars"][2]
            )
            result += f" Stars: {sorted(stars)}"
            
        logger.info(result)
    
    logger.info("\n⚠️ IMPORTANT: These numbers are generated using high-quality randomness.")
    logger.info("They do NOT have any predictive advantage over any other random selection.")
    logger.info("This tool demonstrates that lottery predictions cannot beat pure randomness.")


def evaluate_model(lottery: str, trials: int, seed: int) -> None:
    """
    Evaluate prediction model against random baseline.
    
    Args:
        lottery: Type of lottery to evaluate
        trials: Number of trials for evaluation
        seed: Random seed for reproducibility
    """
    logger.info(f"Evaluating prediction model for {lottery} against random baseline")
    logger.info(f"Running {trials} trials with seed {seed}")
    
    # Load historical data
    data = pipeline.load_lottery_data(lottery)
    if data is None:
        logger.error(f"Failed to load data for lottery: {lottery}")
        return
    
    # Evaluate models
    random_results = modeling.evaluate_random_baseline(data, trials, seed)
    model_results = modeling.evaluate_prediction_model(data, trials, seed)
    
    logger.info("\n===== EVALUATION RESULTS =====")
    logger.info(f"Random Baseline - Average matches: {random_results['avg_matches']:.4f}")
    logger.info(f"Prediction Model - Average matches: {model_results['avg_matches']:.4f}")
    logger.info(f"Statistical significance (p-value): {model_results['p_value']:.4f}")
    
    if model_results['p_value'] > 0.05:
        logger.info("\n⚠️ CONCLUSION: The prediction model shows NO statistically significant")
        logger.info("improvement over random selection. This demonstrates that lottery")
        logger.info("numbers CANNOT be predicted better than random chance.")
    else:
        logger.info("\n⚠️ UNEXPECTED RESULT: The model shows statistical significance.")
        logger.info("This is likely due to random chance in this specific trial.")
        logger.info("Try running with different seeds to verify.")


def main(args: Optional[List[str]] = None) -> int:
    """
    Main entry point for the CLI.
    
    Args:
        args: Command line arguments (if None, sys.argv[1:] is used)
        
    Returns:
        int: Exit code
    """
    parser = setup_parser()
    parsed_args = parser.parse_args(args if args is not None else sys.argv[1:])
    
    if not parsed_args.command:
        parser.print_help()
        return 1
    
    try:
        if parsed_args.command == "generate-numbers":
            generate_numbers(parsed_args.lottery, parsed_args.count)
        elif parsed_args.command == "evaluate-model":
            evaluate_model(parsed_args.lottery, parsed_args.trials, parsed_args.seed)
        else:
            logger.error(f"Unknown command: {parsed_args.command}")
            return 1
    except Exception as e:
        logger.exception(f"Error executing command: {e}")
        return 1
        
    return 0


if __name__ == "__main__":
    sys.exit(main())