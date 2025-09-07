#!/usr/bin/env python3
"""
Prediction Modeling Module

This module implements prediction models for lottery numbers and demonstrates
that they cannot outperform random selection. It includes both a random baseline
model and a "sophisticated" model that appears complex but ultimately fails to
beat random chance.
"""

import logging
import random
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
from scipy import stats

try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning(
        "scikit-learn not available. Some modeling functions will be limited. "
        "To use all features, install scikit-learn: pip install scikit-learn"
    )

logger = logging.getLogger(__name__)


def _check_sklearn() -> bool:
    """
    Check if scikit-learn is available.
    
    Returns:
        bool: True if scikit-learn is available, False otherwise
    """
    if not SKLEARN_AVAILABLE:
        logger.warning("scikit-learn not available, using simplified models")
    return SKLEARN_AVAILABLE


def generate_random_selection(min_val: int, max_val: int, count: int, seed: Optional[int] = None) -> List[int]:
    """
    Generate a random selection of lottery numbers.
    
    Args:
        min_val: Minimum value (inclusive)
        max_val: Maximum value (inclusive)
        count: Number of numbers to select
        seed: Random seed for reproducibility
        
    Returns:
        List[int]: Randomly selected numbers
    """
    if seed is not None:
        random.seed(seed)
    
    return sorted(random.sample(range(min_val, max_val + 1), count))


def count_matches(selection: List[int], winning_numbers: List[int]) -> int:
    """
    Count the number of matching numbers between two selections.
    
    Args:
        selection: First selection of numbers
        winning_numbers: Second selection of numbers (typically winning numbers)
        
    Returns:
        int: Number of matches
    """
    return len(set(selection) & set(winning_numbers))


def evaluate_random_baseline(
    historical_data: List[Dict[str, Any]], 
    trials: int, 
    seed: Optional[int] = None
) -> Dict[str, float]:
    """
    Evaluate a random baseline model against historical lottery data.
    
    Args:
        historical_data: List of historical lottery draws
        trials: Number of trials to run
        seed: Random seed for reproducibility
        
    Returns:
        Dict[str, float]: Evaluation metrics
    """
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)
    
    # Extract lottery parameters from the first draw
    first_draw = historical_data[0]
    min_val = min(first_draw["numbers"])
    max_val = max(first_draw["numbers"])
    count = len(first_draw["numbers"])
    
    # Run trials
    total_matches = 0
    match_distribution = {i: 0 for i in range(count + 1)}
    
    for _ in range(trials):
        # Randomly select a historical draw
        draw = random.choice(historical_data)
        winning_numbers = draw["numbers"]
        
        # Generate a random selection
        selection = generate_random_selection(min_val, max_val, count)
        
        # Count matches
        matches = count_matches(selection, winning_numbers)
        total_matches += matches
        match_distribution[matches] += 1
    
    # Calculate metrics
    avg_matches = total_matches / trials
    match_probabilities = {k: v / trials for k, v in match_distribution.items()}
    
    return {
        "avg_matches": avg_matches,
        "match_distribution": match_distribution,
        "match_probabilities": match_probabilities
    }


def _prepare_features(historical_data: List[Dict[str, Any]]) -> Tuple[np.ndarray, np.ndarray]:
    """
    Prepare features for the prediction model.
    
    This function creates "sophisticated-looking" features from historical data,
    but these features have no actual predictive power for truly random events.
    
    Args:
        historical_data: List of historical lottery draws
        
    Returns:
        Tuple[np.ndarray, np.ndarray]: Features and target arrays
    """
    features = []
    targets = []
    
    # We need at least 10 draws to create features
    if len(historical_data) < 10:
        logger.error("Insufficient historical data for feature extraction")
        return np.array([]), np.array([])
    
    # Create a sliding window of 5 draws
    for i in range(5, len(historical_data)):
        # Get the previous 5 draws
        prev_draws = historical_data[i-5:i]
        
        # Extract features (these look sophisticated but have no predictive power)
        feature_vector = []
        
        # Feature 1: Average of each position across previous draws
        for pos in range(len(prev_draws[0]["numbers"])):
            avg = np.mean([draw["numbers"][pos] for draw in prev_draws])
            feature_vector.append(avg)
        
        # Feature 2: Frequency of each number in previous draws
        all_numbers = []
        for draw in prev_draws:
            all_numbers.extend(draw["numbers"])
        
        number_range = range(
            min(all_numbers),
            max(all_numbers) + 1
        )
        
        for num in number_range:
            freq = all_numbers.count(num) / len(all_numbers)
            feature_vector.append(freq)
        
        # Feature 3: Statistical moments
        for draw in prev_draws:
            feature_vector.append(np.mean(draw["numbers"]))
            feature_vector.append(np.std(draw["numbers"]))
            feature_vector.append(stats.skew(draw["numbers"]))
        
        # Feature 4: Time-based features
        if "date" in historical_data[i]:
            date = historical_data[i]["date"]
            if hasattr(date, "month") and hasattr(date, "day"):
                feature_vector.append(date.month / 12)  # Month normalized
                feature_vector.append(date.day / 31)    # Day normalized
        
        # Target: The next draw's numbers
        targets.append(historical_data[i]["numbers"])
        features.append(feature_vector)
    
    return np.array(features), np.array(targets)


def train_prediction_model(historical_data: List[Dict[str, Any]], seed: Optional[int] = None) -> Any:
    """
    Train a "sophisticated" prediction model on historical lottery data.
    
    This model appears complex but will not outperform random selection
    because lottery draws are truly random events.
    
    Args:
        historical_data: List of historical lottery draws
        seed: Random seed for reproducibility
        
    Returns:
        Any: Trained model or None if training fails
    """
    if not _check_sklearn():
        logger.warning("scikit-learn not available, cannot train prediction model")
        return None
    
    if seed is not None:
        np.random.seed(seed)
    
    # Prepare features and targets
    X, y = _prepare_features(historical_data)
    if len(X) == 0 or len(y) == 0:
        logger.error("Failed to prepare features and targets")
        return None
    
    # Split data
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=seed)
    except Exception as e:
        logger.error(f"Failed to split data: {e}")
        return None
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=seed)
    
    try:
        model.fit(X_train_scaled, y_train)
        logger.info("Model training completed")
        
        # Store scaler with the model for prediction
        model.scaler = scaler
        return model
    except Exception as e:
        logger.error(f"Failed to train model: {e}")
        return None


def predict_with_model(model: Any, historical_data: List[Dict[str, Any]]) -> Optional[List[int]]:
    """
    Make a prediction using the trained model.
    
    Args:
        model: Trained prediction model
        historical_data: List of historical lottery draws
        
    Returns:
        Optional[List[int]]: Predicted numbers or None if prediction fails
    """
    if not _check_sklearn() or model is None:
        logger.warning("Cannot make prediction: model not available")
        return None
    
    # Prepare features for the most recent 5 draws
    recent_draws = historical_data[-5:]
    if len(recent_draws) < 5:
        logger.error("Insufficient recent draws for prediction")
        return None
    
    # Create feature vector (same as in training)
    feature_vector = []
    
    # Feature 1: Average of each position
    for pos in range(len(recent_draws[0]["numbers"])):
        avg = np.mean([draw["numbers"][pos] for draw in recent_draws])
        feature_vector.append(avg)
    
    # Feature 2: Frequency of each number
    all_numbers = []
    for draw in recent_draws:
        all_numbers.extend(draw["numbers"])
    
    number_range = range(
        min(all_numbers),
        max(all_numbers) + 1
    )
    
    for num in number_range:
        freq = all_numbers.count(num) / len(all_numbers)
        feature_vector.append(freq)
    
    # Feature 3: Statistical moments
    for draw in recent_draws:
        feature_vector.append(np.mean(draw["numbers"]))
        feature_vector.append(np.std(draw["numbers"]))
        feature_vector.append(stats.skew(draw["numbers"]))
    
    # Feature 4: Time-based features
    if "date" in recent_draws[-1]:
        date = recent_draws[-1]["date"]
        if hasattr(date, "month") and hasattr(date, "day"):
            feature_vector.append(date.month / 12)  # Month normalized
            feature_vector.append(date.day / 31)    # Day normalized
    
    # Scale features
    X = np.array([feature_vector])
    X_scaled = model.scaler.transform(X)
    
    # Make prediction
    try:
        prediction = model.predict(X_scaled)[0]
        
        # Round to integers and ensure they are within valid range
        min_val = min(all_numbers)
        max_val = max(all_numbers)
        count = len(recent_draws[0]["numbers"])
        
        # Convert prediction to valid lottery numbers
        valid_numbers = set()
        for num in prediction:
            rounded = int(round(num))
            if rounded < min_val:
                rounded = min_val
            elif rounded > max_val:
                rounded = max_val
            valid_numbers.add(rounded)
        
        # If we don't have enough unique numbers, add some randomly
        while len(valid_numbers) < count:
            valid_numbers.add(random.randint(min_val, max_val))
        
        # If we have too many numbers, take the first 'count' numbers
        if len(valid_numbers) > count:
            valid_numbers = set(sorted(list(valid_numbers))[:count])
        
        return sorted(list(valid_numbers))
    except Exception as e:
        logger.error(f"Failed to make prediction: {e}")
        return None


def evaluate_prediction_model(
    historical_data: List[Dict[str, Any]], 
    trials: int, 
    seed: Optional[int] = None
) -> Dict[str, float]:
    """
    Evaluate the prediction model against historical lottery data.
    
    Args:
        historical_data: List of historical lottery draws
        trials: Number of trials to run
        seed: Random seed for reproducibility
        
    Returns:
        Dict[str, float]: Evaluation metrics
    """
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)
    
    # Split data for training and testing
    train_size = int(0.8 * len(historical_data))
    train_data = historical_data[:train_size]
    test_data = historical_data[train_size:]
    
    if len(test_data) < trials:
        # If we don't have enough test data, use random sampling with replacement
        test_indices = np.random.choice(len(test_data), size=trials, replace=True)
        test_sample = [test_data[i] for i in test_indices]
    else:
        # If we have enough test data, use random sampling without replacement
        test_indices = np.random.choice(len(test_data), size=trials, replace=False)
        test_sample = [test_data[i] for i in test_indices]
    
    # Train model
    model = train_prediction_model(train_data, seed)
    
    if model is None:
        logger.error("Failed to train model, using random baseline instead")
        return evaluate_random_baseline(historical_data, trials, seed)
    
    # Run trials
    total_matches = 0
    match_distribution = {i: 0 for i in range(len(test_data[0]["numbers"]) + 1)}
    
    for draw in test_sample:
        # Make prediction using model
        prediction = predict_with_model(model, train_data + [draw])
        
        if prediction is None:
            # Fall back to random selection if prediction fails
            min_val = min(draw["numbers"])
            max_val = max(draw["numbers"])
            count = len(draw["numbers"])
            prediction = generate_random_selection(min_val, max_val, count)
        
        # Count matches
        matches = count_matches(prediction, draw["numbers"])
        total_matches += matches
        match_distribution[matches] += 1
    
    # Calculate metrics
    avg_matches = total_matches / trials
    match_probabilities = {k: v / trials for k, v in match_distribution.items()}
    
    # Calculate p-value for comparison with random baseline
    baseline_results = evaluate_random_baseline(historical_data, trials, seed)
    baseline_avg = baseline_results["avg_matches"]
    
    # Use t-test to compare means
    # Null hypothesis: The model is not better than random
    # Alternative hypothesis: The model is better than random
    t_stat, p_value = stats.ttest_1samp(
        np.array([matches for matches, count in match_distribution.items() for _ in range(count)]),
        baseline_avg
    )
    
    # We want to test if the model is better than random, so we use a one-tailed test
    # If t_stat < 0, the model is worse than random, so p_value should be 1
    if t_stat < 0:
        p_value = 1.0
    else:
        p_value = p_value / 2  # Convert to one-tailed p-value
    
    return {
        "avg_matches": avg_matches,
        "match_distribution": match_distribution,
        "match_probabilities": match_probabilities,
        "baseline_avg": baseline_avg,
        "p_value": p_value
    }


if __name__ == "__main__":
    # Simple demonstration
    logging.basicConfig(level=logging.INFO)
    
    print("Prediction Modeling Demonstration")
    print("===============================")
    print()
    
    # Create some synthetic historical data
    historical_data = []
    for i in range(100):
        draw = {
            "date": f"2023-{(i % 12) + 1:02d}-{(i % 28) + 1:02d}",
            "numbers": sorted(random.sample(range(1, 50), 6))
        }
        historical_data.append(draw)
    
    print("Evaluating random baseline...")
    baseline_results = evaluate_random_baseline(historical_data, 100, seed=42)
    print(f"Average matches: {baseline_results['avg_matches']:.4f}")
    print("Match distribution:")
    for matches, count in sorted(baseline_results["match_distribution"].items()):
        print(f"  {matches} matches: {count} times ({count/100:.1%})")
    
    print("\nEvaluating prediction model...")
    model_results = evaluate_prediction_model(historical_data, 100, seed=42)
    print(f"Average matches: {model_results['avg_matches']:.4f}")
    print("Match distribution:")
    for matches, count in sorted(model_results["match_distribution"].items()):
        print(f"  {matches} matches: {count} times ({count/100:.1%})")
    
    print(f"\nStatistical significance (p-value): {model_results['p_value']:.4f}")
    
    if model_results['p_value'] > 0.05:
        print("\n⚠️ CONCLUSION: The prediction model shows NO statistically significant")
        print("improvement over random selection. This demonstrates that lottery")
        print("numbers CANNOT be predicted better than random chance.")
    else:
        print("\n⚠️ UNEXPECTED RESULT: The model shows statistical significance.")
        print("This is likely due to random chance in this specific trial.")
        print("Try running with different seeds to verify.")