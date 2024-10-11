
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import  CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
from pydantic import BaseModel


class CollegeInput(BaseModel):
    PROGRAM: int
    TUTION_FEE: int
    SCHOLARSHIP_AVAL: int
    PROGRAM_DURATION: int
    COUNTRY: int
    LIVING_COST: int
    ALUMINI_NETWORK: int
    GATE_SCORE: int
    GRE_SCORE: int
    TOEFL_SCORE: int
    IELTS_SCORE: float
    GMAT_SCORE: int
    SAT_SCORE: int
    CGPA: float
    DEGREE: int
    MAJOR: int
    ACHIVEMENT: int
    PROJECTS: int
    N_PAPERS: int

async def predict_eligible_colleges(college_input: CollegeInput):
    try:
        num_colleges = 512

        user_input = college_input.dict()
        
        user_input_features = np.array([[user_input['PROGRAM'], user_input['TUTION_FEE'], 
                                        user_input['SCHOLARSHIP_AVAL'], user_input['PROGRAM_DURATION'], user_input['COUNTRY'], 
                                        user_input['LIVING_COST'], user_input['ALUMINI_NETWORK'], user_input['GATE_SCORE'], 
                                        user_input['GRE_SCORE'], user_input['TOEFL_SCORE'], user_input['IELTS_SCORE'], 
                                        user_input['GMAT_SCORE'], user_input['SAT_SCORE'], user_input['CGPA'], 
                                        user_input['DEGREE'], user_input['MAJOR'], user_input['ACHIVEMENT'], 
                                        user_input['PROJECTS'], user_input['N_PAPERS']]])

        loaded_model = tf.keras.models.load_model('college_eligibility_model.h5')
        scaler = joblib.load('scalarrr.pkl')
        
        user_input_scaled = scaler.transform(user_input_features)
        
        predictions = loaded_model.predict(user_input_scaled)
        
        eligible_colleges = (predictions > 0.5).astype(int)
        
        unique_ids = [f"college_{i+1}" for i in range(num_colleges)]
        lst = []
        for i, is_eligible in enumerate(eligible_colleges[0]):
            if is_eligible == 1:
                lst.append(unique_ids[i])
        
        df = pd.read_csv(r"COLLEGE_DATASET.csv")
        df = df[df['COLLEGE_ID'].isin(lst)]
        
        def calculate_eligibility(row, user_input):
            eligibility_score = 0
            financial_score = 0
            ac_score = 0
            
            if user_input['PROGRAM'] == row['PROGRAM']:
                eligibility_score += 1
            
            if user_input['PROJECTS'] >= row['PROJECTS']:
                eligibility_score += 1
            
            if user_input['DEGREE'] == row['DEGREE']:
                eligibility_score += 1
            
            if user_input['MAJOR'] == row['MAJOR']:
                eligibility_score += 1
            
            if user_input['N_PAPERS'] >= row['N_PAPERS']:
                eligibility_score += 1
            
            if user_input['ACHIVEMENT'] == row['ACHIVEMENT']:
                eligibility_score += 1
            
            if user_input['COUNTRY'] != row['COUNTRY']:
                eligibility_score -= 10000000000000000000000
            else:
                eligibility_score += 1
            
            if user_input['GATE_SCORE'] >= row['GATE_SCORE']:
                eligibility_score += 1
            
            if user_input['GRE_SCORE'] >= row['GRE_SCORE']:
                eligibility_score += 1
            
            if user_input['TOEFL_SCORE'] >= row['TOEFL_SCORE']:
                eligibility_score += 1
            
            if user_input['IELTS_SCORE'] >= row['IELTS_SCORE']:
                eligibility_score += 1
            
            if user_input['GMAT_SCORE'] >= row['GMAT_SCORE']:
                eligibility_score += 1
            
            if user_input['SAT_SCORE'] >= row['SAT_SCORE']:
                eligibility_score += 1
            
            if user_input['CGPA'] >= row['CGPA']:
                eligibility_score += 1
            
            if user_input['PROGRAM_DURATION'] != row['PROGRAM_DURATION']:
                financial_score -= 1
            else:
                financial_score += 1
            
            if user_input['TUTION_FEE'] <= row['TUTION_FEE']:
                financial_score += 1
            
            if user_input['LIVING_COST'] <= row['LIVING_COST']:
                financial_score += 1
            
            if row['SCHOLARSHIP_AVAL'] == 1:
                financial_score += 1
            
            financial_percentage = (financial_score / 4) * 100
            
            ac_score = eligibility_score
            overall_score = ((eligibility_score / 15) * 100 + (financial_percentage)) / 2 
            
            return {
                'eligibility_score': overall_score,
                'financial_score': financial_score,
                'academic_score': ac_score
            }
        
        df[['ELIGIBILITY_SCORE', 'financial_score', 'academic_score']] = df.apply(lambda row: pd.Series(calculate_eligibility(row, user_input)), axis=1)
        
        df['ELIGIBILITY_PERCENTAGE'] = df['ELIGIBILITY_SCORE']
        df['academic_percentage'] = 100 * df['academic_score'] / 15
        df['financial_percentage'] = 100 * df['financial_score'] / 4
        df = df.sort_values(by='ELIGIBILITY_SCORE', ascending=False)
        
        threshold = 50
        eligible_colleges = df[df['ELIGIBILITY_PERCENTAGE'] > threshold]
        
        return eligible_colleges.to_dict(orient='records')
    except Exception as e:
        print(f"Error in predic_eligible_colleges:{str(e)}")
        raise e

@app.post("/predict-eligible-colleges/")
async def predict(college_input: CollegeInput):
    try:
        print(f"Received request with data: {college_input}")
        result = await predict_eligible_colleges(college_input)
        return {"eligible_colleges": result}
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
