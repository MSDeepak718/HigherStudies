import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import joblib

def load_data(students_path: str, colleges_path: str) -> tuple:
    """Load student and college data from CSV files."""
    students_df = pd.read_csv(students_path)
    colleges_df = pd.read_csv(colleges_path)
    return students_df, colleges_df

def define_numerical_columns() -> tuple:
    """Define numerical columns for students and colleges."""
    numerical_columns_students = ['12th_percentage', 'gre_score', 'toefl_score', 'gate_score', 
                                   'gmat_score', 'ielts_score', 'sat_score', 'undergrad_gpa']
    numerical_columns_colleges = ['average_cutoff_gre', 'average_cutoff_gate', 'average_cutoff_gmat', 
                                   'average_cutoff_sat', 'average_cutoff_toefl', 'average_cutoff_ielts', 
                                   'average_cutoff_gpa', 'tuition_fee_per_year']
    return numerical_columns_students, numerical_columns_colleges

def initialize_scalers() -> tuple:
    """Initialize and return scalers for student and college data."""    
    scaler_students = StandardScaler()
    scaler_colleges = StandardScaler()
    return scaler_students, scaler_colleges

def preprocess_data(students_df: pd.DataFrame, colleges_df: pd.DataFrame,
                     numerical_columns_students: list, numerical_columns_colleges: list,
                     scaler_students: StandardScaler, scaler_colleges: StandardScaler) -> tuple:
    """Preprocess and normalize student and college data."""
    # Ensure all columns are present
    for col in numerical_columns_students:
        if col not in students_df.columns:
            students_df[col] = 0
    for col in numerical_columns_colleges:
        if col not in colleges_df.columns:
            colleges_df[col] = 0

    # Normalize data
    students_df[numerical_columns_students] = scaler_students.fit_transform(students_df[numerical_columns_students])
    colleges_df[numerical_columns_colleges] = scaler_colleges.fit_transform(colleges_df[numerical_columns_colleges])
    
    return students_df, colleges_df

def save_models(scaler_students: StandardScaler, scaler_colleges: StandardScaler,
                 scaler_path: str) -> None:
    """Save the scalers to disk."""
    joblib.dump(scaler_students, f'{scaler_path}_students.pkl')
    joblib.dump(scaler_colleges, f'{scaler_path}_colleges.pkl')

def main():
    # Paths to the datasets
    students_path = 'C:/Users/Deepak/Desktop/user_data_mtech_recommendation_2000.csv'
    colleges_path = 'C:/Users/Deepak/Desktop/college_data_mtech_recommendation.csv'
    scaler_path = 'C:/Users/Deepak/Desktop/scalers'

    try:
        # Load data
        students_df, colleges_df = load_data(students_path, colleges_path)

        # Define numerical columns
        numerical_columns_students, numerical_columns_colleges = define_numerical_columns()

        # Initialize scalers
        scaler_students, scaler_colleges = initialize_scalers()

        # Preprocess data
        students_df, colleges_df = preprocess_data(students_df, colleges_df,
                                                   numerical_columns_students, numerical_columns_colleges,
                                                   scaler_students, scaler_colleges)

        # Save the scalers
        save_models(scaler_students, scaler_colleges, scaler_path)

    except FileNotFoundError as e:
        print(f"FileNotFoundError: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
