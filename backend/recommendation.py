import argparse
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

def load_models(scaler_path: str) -> tuple:
    """Load scalers from disk."""    
    scaler_students = joblib.load(f'{scaler_path}_students.pkl')
    scaler_colleges = joblib.load(f'{scaler_path}_colleges.pkl')
    return scaler_students, scaler_colleges

def calculate_financial_probability(tuition_fee, max_affordable):
    """Calculate the financial probability based on tuition fee and max affordable amount."""
    if max_affordable == 0:
        return 0  # No affordability provided, return 0 probability
    
    if tuition_fee <= max_affordable:
        # If the tuition fee is within the budget, return a higher probability scaled based on closeness to the maximum
        return (max_affordable - tuition_fee) / max_affordable  # Higher tuition closer to max reduces probability
    else:
        # If tuition fee exceeds the budget, reduce the probability more sharply
        return max(0, 1 - ((tuition_fee - max_affordable) / (max_affordable * 2)))  # Penalize if over budget


def calculate_matching_probabilities(user_row: pd.Series, college_df: pd.DataFrame,
                                     scaler_students: StandardScaler, scaler_colleges: StandardScaler,
                                     numerical_columns_students: list, numerical_columns_colleges: list) -> pd.DataFrame:
    """Calculate matching probabilities for colleges based on user data."""
    user_df = pd.DataFrame([user_row])

    # Ensure all necessary columns are present in the user data
    for col in numerical_columns_students:
        if col not in user_df.columns:
            user_df[col] = 0

    user_df[numerical_columns_students] = scaler_students.transform(user_df[numerical_columns_students])

    # Ensure all necessary columns are present in the college data
    for col in numerical_columns_colleges:
        if col not in college_df.columns:
            college_df[col] = 0

    # Calculate cosine similarity between user and colleges based on education-related scores
    similarities = cosine_similarity(user_df[numerical_columns_students], college_df[numerical_columns_colleges])
    college_df['education_probability'] = similarities.flatten()

    # Calculate financial probability based on tuition fee
    user_max_tuition = user_row.get('maximum_tuitionfee_affordable', 0)

    college_df['financial_probability'] = college_df['tuition_fee_per_year'].apply(
        lambda x: calculate_financial_probability(x, user_max_tuition)
    )

    # Combine education and financial probabilities (weighted)
    college_df['overall_probability'] = college_df['education_probability'] * 0.6 + college_df['financial_probability'] * 0.4

    return college_df

def recommend_colleges(students_path: str, colleges_path: str, scaler_path: str,
                       grescore: float, ieltsscore: float, satscore: float, 
                       catscore: float, toeflscore: float, gmatscore: float, 
                       gatescore: float, maximum_tuitionfee_affordable: float) -> pd.DataFrame:
    """Recommend colleges based on a student's profile."""
    # Load data from CSV files
    students_df, colleges_df = load_data(students_path, colleges_path)

    # Define numerical columns for normalization
    numerical_columns_students, numerical_columns_colleges = define_numerical_columns()
    
    # Initialize scalers
    scaler_students, scaler_colleges = initialize_scalers()

    # Preprocess data
    students_df, colleges_df = preprocess_data(students_df, colleges_df,
                                               numerical_columns_students, numerical_columns_colleges,
                                               scaler_students, scaler_colleges)

    # Save and load scalers (for later use)
    save_models(scaler_students, scaler_colleges, scaler_path)
    scaler_students, scaler_colleges = load_models(scaler_path)

    # Create user data row
    user_row = pd.Series({
        'gre_score': grescore,
        'ielts_score': ieltsscore,
        'sat_score': satscore,
        'cat_score': catscore,
        'toefl_score': toeflscore,
        'gmat_score': gmatscore,
        'gate_score': gatescore,
        'maximum_tuitionfee_affordable': maximum_tuitionfee_affordable
    })

    # Calculate matching probabilities
    results = calculate_matching_probabilities(user_row, colleges_df,
                                               scaler_students, scaler_colleges,
                                               numerical_columns_students, numerical_columns_colleges)
    
    # Get the top 20 recommended colleges sorted by overall probability
    recommended_colleges = results.sort_values(by='overall_probability', ascending=False).head(20)

    # Format the probabilities as percentages for display
    recommended_colleges['education_probability'] = (recommended_colleges['education_probability'] * 100).round(2).astype(str) + '%'
    recommended_colleges['financial_probability'] = (recommended_colleges['financial_probability'] * 100).round(2).astype(str) + '%'
    recommended_colleges['overall_probability'] = (recommended_colleges['overall_probability'] * 100).round(2).astype(str) + '%'
    
    # Return the recommended colleges
    return recommended_colleges[['college_name', 'ranking', 'specializations_offered', 
                                 'education_probability', 'financial_probability', 'overall_probability']]

def main():
    """Main function to parse arguments and run the recommendation system."""
    parser = argparse.ArgumentParser(description="College Recommendation System")
    parser.add_argument("--students_path", type=str, required=True, help="Path to the students CSV file")
    parser.add_argument("--colleges_path", type=str, required=True, help="Path to the colleges CSV file")
    parser.add_argument("--scaler_path", type=str, required=True, help="Path to save/load the scaler models")
    parser.add_argument("--grescore", type=float, required=True, help="GRE score")
    parser.add_argument("--ieltsscore", type=float, required=True, help="IELTS score")
    parser.add_argument("--satscore", type=float, required=True, help="SAT score")
    parser.add_argument("--catscore", type=float, required=True, help="CAT score")
    parser.add_argument("--toeflscore", type=float, required=True, help="TOEFL score")
    parser.add_argument("--gmatscore", type=float, required=True, help="GMAT score")
    parser.add_argument("--gatescore", type=float, required=True, help="GATE score")
    parser.add_argument("--maximum_tuitionfee_affordable", type=float, required=True, help="Maximum tuition fee affordable")

    # Parse command-line arguments
    args = parser.parse_args()
    
    # Run the recommendation system and print results
    recommended_colleges = recommend_colleges(
        args.students_path, args.colleges_path, args.scaler_path,
        args.grescore, args.ieltsscore, args.satscore, 
        args.catscore, args.toeflscore, args.gmatscore, 
        args.gatescore, args.maximum_tuitionfee_affordable
    )
    
    # Output the recommended colleges in JSON format
    print(recommended_colleges[['college_name', 'ranking', 'specializations_offered', 
                                'education_probability', 'financial_probability', 'overall_probability']].to_json(orient='records'))

if __name__ == "__main__":
    main()
