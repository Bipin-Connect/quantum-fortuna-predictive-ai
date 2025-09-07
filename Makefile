.PHONY: all clean test lint format install dev docs

PYTHON = python3
PIP = $(PYTHON) -m pip

all: install test

install:
	$(PIP) install -e .

dev:
	$(PIP) install -e ".[dev]"

test:
	$(PYTHON) -m pytest tests/ --cov=src

lint:
	$(PYTHON) -m flake8 src/ tests/
	if command -v mypy >/dev/null 2>&1; then \
		$(PYTHON) -m mypy src/ tests/; \
	fi

format:
	if command -v black >/dev/null 2>&1; then \
		$(PYTHON) -m black src/ tests/; \
	fi
	if command -v isort >/dev/null 2>&1; then \
		$(PYTHON) -m isort src/ tests/; \
	fi

clean:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Generate documentation
docs:
	mkdir -p docs
	$(PYTHON) -c "import os; import sys; sys.path.insert(0, os.path.abspath('.')); import src; print(src.__doc__)" > docs/index.md

# Run the Jupyter notebook
notebook:
	jupyter notebook notebooks/01_demonstrating_failure.ipynb

# Generate sample data
data:
	$(PYTHON) -c "from src.pipeline import ensure_data_files_exist; ensure_data_files_exist()"

# Run the CLI tool
run:
	$(PYTHON) -m src.cli --help