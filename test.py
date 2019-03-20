import os
import pandas as pd 

BASEDIR = os.path.abspath(os.path.dirname(__file__))
FILES_FOLDER = os.path.join(BASEDIR, 'files')

for file in os.listdir(FILES_FOLDER):
    filename = os.fsdecode(file)
    path = os.path.join(FILES_FOLDER,filename)
    df = pd.read_csv(path)
    country_key, years_keys = list(df)[0], list(df)[1:]
    countries = df[country_key]
    
    query = df.loc[df["country"] == "New Zealand"]

    print(query.to_dict(orient='list'))
    print(query.to_dict(orient='list')['1961'][0])
    exit(0)
