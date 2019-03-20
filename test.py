import os
import pandas as pd 

BASEDIR = os.path.abspath(os.path.dirname(__file__))
FILES_FOLDER = os.path.join(BASEDIR, 'files')

for file in os.listdir(FILES_FOLDER):
    filename = os.fsdecode(file)
    path = os.path.join(FILES_FOLDER,filename)
    df = pd.read_csv(path).fillna(0)
    country_key, years_keys = list(df)[0], list(df)[1:]
    countries = df[country_key]

    for country in df["country"]:
        query = df.loc[df["country"] == country]
        query = query.to_dict(orient='list')
        print(list(df["country"]))
        exit(0)
                

    