# Quantum Fortuna™ - Educational Project

> **EDUCATIONAL DISCLAIMER**: This project is designed purely for educational purposes to demonstrate the limitations of predictive models in lottery contexts. It does NOT provide any actual predictive capabilities for real lottery outcomes. Using this software for gambling purposes is strongly discouraged.

## Documentation

Visit our [documentation site](https://bipin-connect.github.io/quantum-fortuna-predictive-ai/) for comprehensive information about the project, including API documentation and educational resources.

## Overview

Quantum Fortuna is an educational tool that demonstrates:

1. Quantum-inspired random number generation
2. The mathematical impossibility of predicting truly random events
3. Basic data processing and model evaluation techniques
4. The ethical considerations around prediction software

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quantum-fortuna-predictive-ai.git
cd quantum-fortuna-predictive-ai

# Install the package in development mode
pip install -e .
```

## Usage

### Command-line Interface

#### `generate-numbers`

Generates random numbers for educational demonstration purposes using either classical or quantum-inspired random number generator.

```
Options:
  --lottery LOTTERY    Lottery type (mega7, easy6, fast5, powerball, euromillions, omillionaire)
  --draws DRAWS        Number of draws to generate (default: 1)
  --quantum QUANTUM    Use quantum-inspired RNG if available (default: True)
```

#### `evaluate-model`

Evaluates the performance of prediction models against a random baseline.

```
Options:
  --lottery LOTTERY    Lottery type (mega7, easy6, fast5, powerball, euromillions, omillionaire)
  --test-size TEST_SIZE  Proportion of data to use for testing (default: 0.2)
  --lookback LOOKBACK  Number of previous draws to use for prediction (default: 5)
```

### Jupyter Notebook

To run the demonstration notebook:

```bash
jupyter notebook notebooks/01_demonstrating_failure.ipynb
```

Or using the Makefile:

```bash
make notebook
```

## Project Structure

```
quantum-fortuna-predictive-ai/
├── src/
│   ├── cli.py           # Command-line interface
│   ├── modeling.py      # Prediction models
│   ├── pipeline.py      # Data processing
│   └── rng.py           # Random number generation
├── tests/
│   ├── test_rng.py      # Tests for RNG module
│   └── test_pipeline.py # Tests for pipeline module
├── notebooks/
│   └── 01_demonstrating_failure.ipynb  # Demonstration notebook
├── docs/
│   └── index.md         # Documentation
├── .github/workflows/
│   └── ci.yml           # Continuous Integration
├── LICENSE              # License file
├── Makefile             # Automation tasks
├── pyproject.toml       # Project configuration
└── README.md            # This file
```

## Development

### Running Tests

```bash
pytest tests/
```

Or using the Makefile:

```bash
make test
```

### Code Formatting and Linting

```bash
# Format code
black src/ tests/
isort src/ tests/

# Lint code
flake8 src/ tests/
mypy src/ tests/
```

Or using the Makefile:

```bash
make format
make lint
```
