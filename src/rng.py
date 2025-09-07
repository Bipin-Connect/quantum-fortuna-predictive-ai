#!/usr/bin/env python3
"""
Quantum-Inspired Random Number Generator

This module implements a quantum-inspired random number generator using
Qiskit's Aer simulator. It provides high-quality randomness but explicitly
does NOT provide any predictive advantage for lottery numbers.
"""

import logging
from typing import List, Tuple, Optional

try:
    from qiskit import QuantumCircuit, Aer, execute
    QISKIT_AVAILABLE = True
except ImportError:
    QISKIT_AVAILABLE = False
    logging.warning(
        "Qiskit not available. Falling back to standard random module. "
        "To use quantum-inspired RNG, install Qiskit: pip install qiskit"
    )
    import random

logger = logging.getLogger(__name__)


def _check_qiskit() -> bool:
    """
    Check if Qiskit is available.
    
    Returns:
        bool: True if Qiskit is available, False otherwise
    """
    if not QISKIT_AVAILABLE:
        logger.warning("Qiskit not available, using standard random module instead")
    return QISKIT_AVAILABLE


def generate_quantum_random_bit() -> int:
    """
    Generate a single random bit using quantum circuit simulation.
    
    Returns:
        int: Random bit (0 or 1)
    """
    if not _check_qiskit():
        return random.randint(0, 1)
    
    # Create a quantum circuit with 1 qubit
    circuit = QuantumCircuit(1, 1)
    
    # Apply Hadamard gate to put the qubit in superposition
    circuit.h(0)
    
    # Measure the qubit
    circuit.measure(0, 0)
    
    # Execute the circuit on the Aer simulator
    simulator = Aer.get_backend('aer_simulator')
    job = execute(circuit, simulator, shots=1)
    result = job.result()
    counts = result.get_counts(circuit)
    
    # Return the measured bit
    return int(list(counts.keys())[0])


def generate_quantum_random_int(min_val: int, max_val: int) -> int:
    """
    Generate a random integer in the specified range using quantum simulation.
    
    Args:
        min_val: Minimum value (inclusive)
        max_val: Maximum value (inclusive)
        
    Returns:
        int: Random integer in the specified range
    """
    if not _check_qiskit():
        return random.randint(min_val, max_val)
    
    range_size = max_val - min_val + 1
    
    # Calculate number of bits needed
    num_bits = (range_size - 1).bit_length()
    
    # Generate random bits
    while True:
        bits = [generate_quantum_random_bit() for _ in range(num_bits)]
        
        # Convert bits to integer
        value = 0
        for bit in bits:
            value = (value << 1) | bit
            
        # Check if value is in range
        if value < range_size:
            return value + min_val


def generate_quantum_random_numbers(
    min_val: int, 
    max_val: int, 
    count: int, 
    unique: bool = True
) -> List[int]:
    """
    Generate a list of random numbers using quantum simulation.
    
    Args:
        min_val: Minimum value (inclusive)
        max_val: Maximum value (inclusive)
        count: Number of random numbers to generate
        unique: Whether the numbers should be unique
        
    Returns:
        List[int]: List of random numbers
    """
    if not _check_qiskit():
        if unique:
            # Check if we can generate enough unique numbers
            if count > (max_val - min_val + 1):
                raise ValueError(
                    f"Cannot generate {count} unique numbers in range "
                    f"[{min_val}, {max_val}]"
                )
            return random.sample(range(min_val, max_val + 1), count)
        else:
            return [random.randint(min_val, max_val) for _ in range(count)]
    
    if unique:
        # Check if we can generate enough unique numbers
        if count > (max_val - min_val + 1):
            raise ValueError(
                f"Cannot generate {count} unique numbers in range "
                f"[{min_val}, {max_val}]"
            )
        
        # Generate unique random numbers
        result = set()
        while len(result) < count:
            result.add(generate_quantum_random_int(min_val, max_val))
        return list(result)
    else:
        # Generate random numbers (may contain duplicates)
        return [generate_quantum_random_int(min_val, max_val) for _ in range(count)]


def get_rng_explanation() -> str:
    """
    Get an explanation of the quantum-inspired RNG.
    
    Returns:
        str: Explanation text
    """
    if QISKIT_AVAILABLE:
        return (
            "This tool uses Qiskit's quantum circuit simulator to generate high-quality \n"
            "random numbers based on quantum mechanical principles. The randomness comes \n"
            "from simulating quantum superposition and measurement.\n\n"
            "⚠️ IMPORTANT: While this provides excellent randomness, it does NOT provide \n"
            "any predictive advantage for lottery numbers. No algorithm or method can \n"
            "predict truly random events like lottery draws better than pure chance.\n\n"
            "This tool is designed to demonstrate that even sophisticated quantum-inspired \n"
            "approaches cannot beat the fundamental randomness of lottery draws."
        )
    else:
        return (
            "This tool is currently using Python's standard random module as a fallback \n"
            "since Qiskit is not installed.\n\n"
            "⚠️ IMPORTANT: No random number generator, quantum or classical, can provide \n"
            "any predictive advantage for lottery numbers. No algorithm or method can \n"
            "predict truly random events like lottery draws better than pure chance.\n\n"
            "This tool is designed to demonstrate that even sophisticated approaches \n"
            "cannot beat the fundamental randomness of lottery draws."
        )


if __name__ == "__main__":
    # Simple demonstration
    logging.basicConfig(level=logging.INFO)
    
    print("Quantum-Inspired RNG Demonstration")
    print("==================================")
    print()
    
    if QISKIT_AVAILABLE:
        print("Using Qiskit for quantum simulation")
    else:
        print("Using standard random module (Qiskit not available)")
    
    print("\nGenerating 10 random bits:")
    bits = [generate_quantum_random_bit() for _ in range(10)]
    print(bits)
    
    print("\nGenerating 5 random integers between 1 and 50:")
    nums = generate_quantum_random_numbers(1, 50, 5)
    print(sorted(nums))
    
    print("\nGenerating lottery numbers for different formats:")
    print(f"Mega7: {sorted(generate_quantum_random_numbers(1, 50, 7))}")
    print(f"Easy6: {sorted(generate_quantum_random_numbers(1, 45, 6))}")
    print(f"Fast5: {sorted(generate_quantum_random_numbers(1, 45, 5))}")
    
    print("\n" + get_rng_explanation())