"""
    Cria os CSVs necessários para o funcionamento do APP
    Pega todos os GEOJSONS da pasta CACHE e converte o DB em CSV na pasta CSVs
"""
import os, csv, geojson
import pandas as pd

# Lista os arquivos GeoJSON na pasta cache
geojson_files = [f for f in os.listdir('cache') if f.endswith('.geojson')]

for geojson_file in geojson_files:
    year = geojson_file.split('_')[1].split('.')[0]  # Extrai o ano do nome do arquivo

    with open(f"cache/{geojson_file}", 'r') as geojson_file:
        geojson_data = geojson.load(geojson_file)

    csv_data = []
    csv_data.append(["INDEX", "AREA", "X", "Y", "COD_MUNICIPIO", "MUNICIPIO", "MESO", "MICRO"]) # Cria as colunas

    # Mapeia os nomes das propriedades do GeoJSON para os nomes das colunas do CSV
    property_mapping = {
        "INDEX": "ID",
        "AREA": "Area_ha", 
        "X": "x",
        "Y": "y",
        "COD_MUNICIPIO": "CD_GEOCOD",
        "MUNICIPIO": "NM_MUNICI",
        "MESO": "NM_MESO",
        "MICRO": "NM_MICRO"
    }

    for feature in geojson_data.features:
        row = []
        for csv_column in ["INDEX", "AREA", "X", "Y", "COD_MUNICIPIO", "MUNICIPIO", "MESO", "MICRO"]:
            # Pega o nome real da propriedade no GeoJSON
            geojson_property = property_mapping[csv_column]
            # Verifica se a propriedade existe, senão usa "Não encontrado"
            value = feature.properties.get(geojson_property, "Não encontrado")
            row.append(value)
        csv_data.append(row)

    with open(f"cache/CSVs/Data_{year}.csv", 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerows(csv_data)

    df = pd.read_csv(f'cache/CSVs/Data_{year}.csv')
    
    # Verifica se todas as colunas necessárias existem no DataFrame
    required_df_columns = ['AREA', 'COD_MUNICIPIO', 'MUNICIPIO', 'MESO', 'MICRO']
    for col in required_df_columns:
        if col not in df.columns:
            df[col] = "Não encontrado"
    
    # Preenche valores NaN ou vazios com "Não encontrado"
    df[required_df_columns] = df[required_df_columns].fillna("Não encontrado")
    
    df = df.loc[:, required_df_columns]
    df['TOTAL_AREA'] = df.groupby('MUNICIPIO')['AREA'].transform('sum')
    df.drop_duplicates(subset='MUNICIPIO', keep='first', inplace=True)
    df = df.loc[:, ['MUNICIPIO', 'TOTAL_AREA', 'COD_MUNICIPIO', 'MESO', 'MICRO']]

    df.to_csv(f'cache/CSVs/Data_{year}_Resume.csv', index=False)