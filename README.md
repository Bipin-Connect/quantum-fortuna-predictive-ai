# Quantum Fortuna: Educational Project on Lottery Prediction

⚠️ **This is an educational project, not a prediction tool.**

## Project Overview

Quantum Fortuna is an educational project designed to demonstrate why lottery prediction is fundamentally impossible. The project uses rigorous statistical analysis and machine learning techniques to show that no algorithm, regardless of complexity, can predict lottery outcomes better than random chance.

## Why This Approach Fails

Lottery draws are designed to be truly random events. This means:

1. **Independence**: Each draw is completely independent of all previous draws.
2. **Uniform Distribution**: Each number has an equal probability of being drawn.
3. **No Patterns**: There are no exploitable patterns in the sequence of draws.

Attempts to predict lottery numbers using historical data, market trends, or any other inputs are fundamentally flawed because they assume some form of pattern or correlation where none exists.

### Mathematical Proof

The probability of correctly predicting all numbers in a lottery draw is extremely small. For example, in a 7/49 lottery (choosing 7 numbers from 1-49), the probability is:

$P = \frac{1}{\binom{49}{7}} = \frac{1}{85,900,584} \approx 0.00000001$

This means that even with the most sophisticated prediction algorithm, your chances of winning are effectively the same as random selection.

### Demonstration

This project includes a Jupyter notebook (`notebooks/01_demonstrating_failure.ipynb`) that visually demonstrates:

- The uniform distribution of lottery numbers
- Lack of autocorrelation between consecutive draws
- Machine learning models performing no better than random chance
- Statistical tests confirming the randomness of lottery draws

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-fortuna-predictive-ai.git
cd quantum-fortuna-predictive-ai

# Install the package and dependencies
pip install -e .

# For development dependencies
pip install -e ".[dev]"
```

Alternatively, you can use the provided Makefile:

```bash
make install  # Basic installation
make dev      # Installation with development dependencies
```

## Repository Update Guide

If you're updating from the old version of this repository, follow these steps:

1. **Cleanup**: Remove the old files
   ```bash
   git rm main.py utils.py
   ```

2. **Commit**: Commit the new project structure
   ```bash
   git add .
   git commit -m "Refactor: Transform project into educational tool"
   ```

3. **Push**: Push the changes to the main branch
   ```bash
   git push origin main
   ```

4. **Deploy**: Configure GitHub Pages
   - Go to the repository **Settings**
   - Navigate to **Pages**
   - Set the source to **Deploy from a branch**
   - Select the **main** branch and **/docs** folder
   - Click **Save**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for educational purposes only. It demonstrates why lottery prediction is impossible and should not be used as a tool for gambling or making financial decisions.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-fortuna-predictive-ai.git
cd quantum-fortuna-predictive-ai

# Install the package and dependencies
pip install -e .

# For development dependencies
pip install -e ".[dev]"
```

Alternatively, you can use the provided Makefile:

```bash
make install  # Basic installation
make dev      # Installation with development dependencies
```

## Usage

### Command-Line Interface

The project provides a command-line interface for generating lottery numbers and evaluating prediction models:

```bash
# Generate random lottery numbers
quantum-fortuna generate-numbers --lottery mega7 --draws 5

# Evaluate prediction model against random baseline
quantum-fortuna evaluate-model --lottery mega7 --test-size 0.2
```

Or directly using the module:

```bash
python -m src.cli generate-numbers --lottery mega7 --draws 5
```

### Available Commands

#### `generate-numbers`

Generates random lottery numbers using a quantum-inspired random number generator.

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
