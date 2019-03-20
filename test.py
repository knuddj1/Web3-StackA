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

    for c in countries:
        print(c)

