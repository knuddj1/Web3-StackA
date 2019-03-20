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
    for year in list(df)[1:]:
        print(query.to_dict(orient='list')[year][0])
        #     print(type(query.to_dict()["country"]))
    