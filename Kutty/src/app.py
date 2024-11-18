import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
import matplotlib.pyplot as plt
import seaborn as sns
from decimal import Decimal
import datetime

# Initialize database connection
def init_database(user: str, password: str, host: str, port: str, database: str) -> SQLDatabase:
    db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return SQLDatabase.from_uri(db_uri)

# Generate SQL query chain
def get_sql_chain(db: SQLDatabase) -> RunnablePassthrough:
    template = """
        You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
        Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
        
        <SCHEMA>{schema}</SCHEMA>
        
        Conversation History: {chat_history}
        
        Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
        
        Your turn:
        
        Question: {question}
        SQL Query:
    """
    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0)

    def get_schema(_):
        return db.get_table_info()
        
    return (
        RunnablePassthrough.assign(schema=get_schema)
        | prompt
        | llm
        | StrOutputParser()
    )

# Execute SQL query and fetch results
def get_query_result(sql_query: str, db: SQLDatabase):
    query_result = db.run(sql_query)
    
    try:
        query_result_lst = eval(query_result)
        if isinstance(query_result_lst, list) and all(isinstance(row, tuple) for row in query_result_lst):
            # Convert to DataFrame
            df = pd.DataFrame(query_result_lst)
            # Handle column types
            df = df.applymap(lambda x: x if not isinstance(x, (datetime.date, Decimal)) else str(x))
            return df
        else:
            raise ValueError(f"Unexpected format of query_result: {query_result_lst}")
    except Exception as e:
        st.error(f"Error processing query result: {e}")
        return pd.DataFrame()  # Return an empty DataFrame if there is an error

# Create DataFrame based on query results
def create_dataframe(query_result_df: pd.DataFrame, column_names=None):
    if not query_result_df.empty:
        num_columns = len(query_result_df.columns)
        
        if column_names:
            if len(column_names) != num_columns:
                raise ValueError(f"Number of provided column names ({len(column_names)}) does not match number of columns in the data ({num_columns}).")
            df = query_result_df.copy()
            df.columns = column_names
        else:
            columns = [f"Column_{i+1}" for i in range(num_columns)]
            df = query_result_df.copy()
            df.columns = columns
            
        return df
    return pd.DataFrame()  # Return an empty DataFrame if query_result_lst is None

# Visualize data based on DataFrame
def visualize_dataframe(df: pd.DataFrame, plot_type: str, x_col: str, y_col: str):
    if not df.empty:
        st.subheader("Data Visualization")
        
        if plot_type == 'bar':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                sns.barplot(data=df, x=x_col, y=y_col, ax=ax, palette='viridis')
                ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
                ax.set_title(f"Bar Graph of {y_col} by {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'scatter':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                sns.scatterplot(data=df, x=x_col, y=y_col, ax=ax, color='coral')
                ax.set_title(f"Scatter Plot of {y_col} vs {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'histogram':
            if y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                df[y_col].hist(ax=ax, bins=10, color='skyblue')
                ax.set_title(f"Histogram of {y_col}")
                ax.set_xlabel(y_col)
                ax.set_ylabel("Frequency")
                st.pyplot(fig)
            else:
                st.error(f"Column {y_col} not found in the DataFrame.")
        
        elif plot_type == 'line':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                df.plot(x=x_col, y=y_col, ax=ax, marker='o')
                ax.set_title(f"Line Plot of {y_col} vs {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'pie':
            if y_col in df.columns:
                fig, ax = plt.subplots(figsize=(8, 8))
                pie_data = df[[x_col, y_col]].dropna()
                ax.pie(
                    pie_data[y_col],
                    labels=pie_data[x_col],
                    autopct='%1.1f%%',
                    startangle=90,
                    colors=sns.color_palette("viridis", len(pie_data))
                )
                ax.set_title(f"Pie Chart of {y_col}")
                st.pyplot(fig)
            else:
                st.error(f"Column {y_col} not found in the DataFrame.")
        
        elif plot_type == 'waterfall':
            if x_col in df.columns and y_col in df.columns:
                fig = go.Figure(go.Waterfall(
                    x=df[x_col],
                    y=df[y_col],
                    measure=["relative"] * len(df),
                    name="Waterfall"
                ))
                fig.update_layout(title=f"Waterfall Chart of {y_col} by {x_col}")
                st.plotly_chart(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'column':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                sns.barplot(data=df, x=x_col, y=y_col, ax=ax, palette='magma')
                ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
                ax.set_title(f"Column Chart of {y_col} by {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'area':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                df.plot.area(x=x_col, y=y_col, ax=ax, alpha=0.4)
                ax.set_title(f"Area Graph of {y_col} by {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'bullet':
            if x_col in df.columns and y_col in df.columns:
                fig = go.Figure(go.Bullet(
                    x=df[x_col],
                    y=df[y_col],
                    marker=dict(color="LightSkyBlue"),
                    orientation='h'
                ))
                fig.update_layout(title=f"Bullet Chart of {y_col} by {x_col}")
                st.plotly_chart(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'statistical':
            if y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                sns.boxplot(data=df, y=y_col)
                ax.set_title(f"Statistical Graphics (Boxplot) of {y_col}")
                st.pyplot(fig)
            else:
                st.error(f"Column {y_col} not found in the DataFrame.")
        
        elif plot_type == 'dot':
            if x_col in df.columns and y_col in df.columns:
                fig = go.Figure(data=go.Scatter(
                    x=df[x_col],
                    y=df[y_col],
                    mode='markers',
                    marker=dict(size=10, color='rgba(156, 165, 196, 0.95)')
                ))
                fig.update_layout(title=f"Dot Plot of {y_col} by {x_col}")
                st.plotly_chart(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'radar':
            if x_col in df.columns and y_col in df.columns:
                categories = df[x_col].tolist()
                values = df[y_col].tolist()
                fig = go.Figure(data=[go.Scatterpolar(
                    r=values,
                    theta=categories,
                    fill='toself'
                )])
                fig.update_layout(title=f"Radar Chart of {y_col} by {x_col}")
                st.plotly_chart(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        elif plot_type == 'labelled':
            if x_col in df.columns and y_col in df.columns:
                fig, ax = plt.subplots(figsize=(12, 8))
                sns.scatterplot(data=df, x=x_col, y=y_col, ax=ax, hue=df[y_col], palette='viridis')
                for i in range(len(df)):
                    ax.text(df[x_col][i], df[y_col][i], df.index[i], fontsize=9)
                ax.set_title(f"Labelled Graph of {y_col} by {x_col}")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                st.pyplot(fig)
            else:
                st.error(f"Columns {x_col} and/or {y_col} not found in the DataFrame.")
        
        else:
            st.write("Unsupported plot type. Please choose from 'bar', 'scatter', 'histogram', 'line', 'pie', 'waterfall', 'column', 'area', 'bullet', 'statistical', 'dot', 'radar', 'labelled'.")
        
        st.subheader("Data Table")
        st.dataframe(df)
    else:
        st.write("No data to visualize.")

# Generate response and visualize results
def get_response(user_query: str, db: SQLDatabase, chat_history: list):
    sql_chain = get_sql_chain(db)
    prompt = """
        You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
        Based on the table schema below, question, SQL query, and SQL response, write a natural language response.
        <SCHEMA>{schema}</SCHEMA>

        Conversation History: {chat_history}
        SQL Query: <SQL>{query}</SQL>
        User question: {question}
        SQL Response: {response}
    """
    response_prompt = ChatPromptTemplate.from_template(prompt)
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0)

    sql_query = sql_chain.invoke({
        "question": user_query,
        "chat_history": chat_history,
    })

    query_result_df = get_query_result(sql_query, db)
    df = create_dataframe(query_result_df)

    # Find the top 10 students by LeetCode count
    if 'LeetCode_Count' in df.columns:
        df = df[['Name', 'LeetCode_Count']].sort_values(by='LeetCode_Count', ascending=False).head(10)
    
    query_runnable = lambda _: sql_query
    schema_runnable = lambda _: db.get_table_info()
    response_runnable = lambda _: df.to_string(index=False)
    
    chain = (
        RunnablePassthrough.assign(
            query= RunnablePassthrough() | query_runnable,
            schema=RunnablePassthrough() | schema_runnable,
            response=RunnablePassthrough() | response_runnable
        )
        | response_prompt
        | llm
        | StrOutputParser()
    )
    
    response = chain.invoke({
        "question": user_query,
        "chat_history": chat_history,
        "query": sql_query,
        "response": df.to_string(index=False)
    })
    
    return response, df
if 'db' not in st.session_state:
    st.session_state.db =[
        AIMessage(content="Hello! I'm a QuestBot. Ask me anything about your database."),
    ]
# Streamlit app setup
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [
        AIMessage(content="Hello! I'm a QuestBot. Ask me anything about your database."),
    ]


load_dotenv()

st.set_page_config(page_title="Chat with QuestBot", page_icon=":sparkles:")

st.title("Chat with QuestBot")

with st.sidebar:
    st.subheader("Settings")
    st.write("Connect to the database and start chatting.")
    
    st.text_input("Host", value="localhost", key="Host")
    st.text_input("Port", value="3306", key="Port")
    st.text_input("User", value="root", key="User")
    st.text_input("Password", type="password", value="buvi%402006", key="Password")
    st.text_input("Database", value="your_database", key="Database")
    
    if st.button("Connect"):
        with st.spinner("Connecting to database..."):
            db = init_database(
                st.session_state["User"],
                st.session_state["Password"],
                st.session_state["Host"],
                st.session_state["Port"],
                st.session_state["Database"]
            )
            st.session_state.db = db
            st.session_state.chat_history.append(AIMessage(content="Connected to the database successfully!"))
            st.write("Database connected successfully.")

user_query = st.text_input("Ask me anything about the database:")

if user_query:
    st.session_state.chat_history.append(HumanMessage(content=user_query))
    
    with st.chat_message("Human"):
        st.markdown(user_query)

    if user_query.lower() in ["hello", "hi", "hii"]:
        response = "Hello! Welcome to Higher Studies analysis QuestBot of Chennai Institute of Technology. How can I assist you today?"
        df = None
    elif user_query.lower() in ["goodbye", "bye"]:
        response = "Goodbye! Have a great day!"
        df = None
    else:
        response, df = get_response(user_query, st.session_state.db, st.session_state.chat_history)
        
    with st.chat_message("AI"):
        st.markdown(response)
    
    if df is not None and not df.empty:
        with st.sidebar:
            st.subheader("Visualization Settings")
            plot_type = st.sidebar.selectbox("Select plot type", [
                "bar", "scatter", "histogram", "line", "pie", "waterfall", 
                "column", "area", "bullet", "statistical", "dot", "radar", "labelled"
            ])
        
            columns = df.columns.tolist()
        
            if len(columns) > 1:
                x_col = st.sidebar.selectbox("Select X column", options=columns, index=0)
                y_col = st.sidebar.selectbox("Select Y column", options=columns, index=1)
            elif len(columns) == 1:
                x_col = st.sidebar.selectbox("Select X column", options=columns, index=0)
                y_col = columns[0]  # Use the only available column for Y as well
            else:
                x_col = y_col = None  # No columns available

            if x_col and y_col:
                visualize_dataframe(df, plot_type, x_col, y_col)
            else:
                st.write("Not enough columns available to select for plotting.")