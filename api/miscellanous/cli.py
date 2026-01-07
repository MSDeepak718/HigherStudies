import argparse
from recommend_colleges import main as recommend_colleges_main

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="College Recommendation System")
    parser.add_argument("--students_path", type=str, required=True, help="Path to the student data CSV file.")
    parser.add_argument("--colleges_path", type=str, required=True, help="Path to the college data CSV file.")
    parser.add_argument("--scaler_path", type=str, required=True, help="Path to the scaler files.")
    return parser.parse_args()

def main():
    args = parse_arguments()
    recommend_colleges_main(
        students_path=args.students_path,
        colleges_path=args.colleges_path,
        scaler_path=args.scaler_path
    )

if __name__ == "__main__":
    main()
