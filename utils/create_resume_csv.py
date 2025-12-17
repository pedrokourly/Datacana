#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para criar CSV resumo a partir de CSV detalhado
Adaptado do treat.py para trabalhar com CSVs ao invés de GeoJSON
"""

import pandas as pd
import os
import glob

def create_resume_from_csv():
    """
    Cria arquivo resumo a partir do CSV detalhado
    Soma as áreas por município e mantém apenas uma linha por município
    """
    
    # Procura por arquivos Data_*.csv no diretório atual
    csv_files = glob.glob('Data_*.csv')
    
    # Remove os arquivos de resumo da lista para evitar processá-los
    csv_files = [f for f in csv_files if '_Resume' not in f and '_backup' not in f]
    
    if not csv_files:
        print("Nenhum arquivo Data_*.csv encontrado!")
        return
    
    print(f"Arquivos encontrados: {csv_files}")
    
    for csv_file in csv_files:
        # Extrai o ano do nome do arquivo (ex: Data_2022.csv -> 2022)
        try:
            year = csv_file.split('_')[1].split('.')[0]
        except IndexError:
            print(f"Não foi possível extrair o ano do arquivo {csv_file}")
            continue
        
        print(f"\nProcessando {csv_file} (ano: {year})...")
        
        try:
            # Carrega o CSV
            df = pd.read_csv(csv_file)
            print(f"Carregado CSV com {len(df)} linhas")
            
            # Verifica se todas as colunas necessárias existem no DataFrame
            required_columns = ['AREA', 'COD_MUNICIPIO', 'MUNICIPIO', 'MESO', 'MICRO']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                print(f"Colunas obrigatórias não encontradas: {missing_columns}")
                print(f"Colunas disponíveis: {list(df.columns)}")
                continue
            
            # Preenche valores NaN ou vazios com "Não encontrado"
            df[required_columns] = df[required_columns].fillna("Não encontrado")
            
            # Converte AREA para numérico, tratando erros
            df['AREA'] = pd.to_numeric(df['AREA'], errors='coerce').fillna(0)
            
            # Cria uma cópia do DataFrame com apenas as colunas necessárias
            df_processed = df[required_columns].copy()
            
            # Calcula a área total por município
            df_processed['TOTAL_AREA'] = df_processed.groupby('MUNICIPIO')['AREA'].transform('sum')
            
            # Remove duplicatas mantendo apenas uma linha por município
            df_resume = df_processed.drop_duplicates(subset='MUNICIPIO', keep='first')
            
            # Reorganiza as colunas na ordem desejada
            df_resume = df_resume[['MUNICIPIO', 'TOTAL_AREA', 'COD_MUNICIPIO', 'MESO', 'MICRO']]
            
            # Ordena por município
            df_resume = df_resume.sort_values('MUNICIPIO')
            
            # Nome do arquivo de saída
            output_file = f'Data_{year}_Resume.csv'
            
            # Salva o arquivo resumo
            df_resume.to_csv(output_file, index=False)
            
            print(f"Arquivo {output_file} criado com sucesso!")
            print(f"Municípios únicos: {len(df_resume)}")
            print(f"Área total: {df_resume['TOTAL_AREA'].sum():.2f} ha")
            
            # Mostra estatísticas por mesorregião
            print("\nEstatísticas por mesorregião:")
            meso_stats = df_resume.groupby('MESO').agg({
                'MUNICIPIO': 'count',
                'TOTAL_AREA': 'sum'
            }).round(2)
            meso_stats.columns = ['Municípios', 'Área_Total']
            print(meso_stats)
            
            # Mostra primeiras linhas como exemplo
            print(f"\nPrimeiras 5 linhas do arquivo {output_file}:")
            print(df_resume.head())
            
        except Exception as e:
            print(f"Erro ao processar {csv_file}: {e}")
            continue

def update_existing_resume():
    """
    Atualiza arquivo resumo existente com dados corrigidos do CSV principal
    """
    
    # Verifica se existe Data_2022.csv e Data_2022_Resume.csv
    main_file = "Data_2022.csv"
    resume_file = "Data_2022_Resume.csv"
    
    if not os.path.exists(main_file):
        print(f"Arquivo {main_file} não encontrado!")
        return
    
    if not os.path.exists(resume_file):
        print(f"Arquivo {resume_file} não encontrado! Executando criação completa...")
        create_resume_from_csv()
        return
    
    print("Atualizando arquivo resumo existente...")
    
    try:
        # Carrega o arquivo principal (com dados corrigidos)
        df_main = pd.read_csv(main_file)
        print(f"Arquivo principal carregado: {len(df_main)} linhas")
        
        # Verifica colunas necessárias
        required_columns = ['AREA', 'COD_MUNICIPIO', 'MUNICIPIO', 'MESO', 'MICRO']
        if not all(col in df_main.columns for col in required_columns):
            print(f"Colunas obrigatórias não encontradas no arquivo principal")
            return
        
        # Preenche valores NaN
        df_main[required_columns] = df_main[required_columns].fillna("Não encontrado")
        df_main['AREA'] = pd.to_numeric(df_main['AREA'], errors='coerce').fillna(0)
        
        # Calcula totais por município
        municipality_data = df_main.groupby('MUNICIPIO').agg({
            'AREA': 'sum',
            'COD_MUNICIPIO': 'first',
            'MESO': 'first', 
            'MICRO': 'first'
        }).reset_index()
        
        # Renomeia a coluna AREA para TOTAL_AREA
        municipality_data.rename(columns={'AREA': 'TOTAL_AREA'}, inplace=True)
        
        # Reorganiza colunas
        municipality_data = municipality_data[['MUNICIPIO', 'TOTAL_AREA', 'COD_MUNICIPIO', 'MESO', 'MICRO']]
        
        # Ordena por município
        municipality_data = municipality_data.sort_values('MUNICIPIO')
        
        # Cria backup do arquivo original
        backup_file = "Data_2022_Resume_backup.csv"
        if not os.path.exists(backup_file):
            df_original = pd.read_csv(resume_file)
            df_original.to_csv(backup_file, index=False)
            print(f"Backup criado: {backup_file}")
        
        # Salva o arquivo atualizado
        municipality_data.to_csv(resume_file, index=False)
        
        print(f"Arquivo {resume_file} atualizado com sucesso!")
        print(f"Municípios: {len(municipality_data)}")
        print(f"Área total: {municipality_data['TOTAL_AREA'].sum():.2f} ha")
        
        # Verifica quantos municípios têm MICRO atualizado
        updated_micro = len(municipality_data[municipality_data['MICRO'] != 'Não encontrado'])
        print(f"Municípios com MICRO atualizado: {updated_micro}")
        
        print(f"\nPrimeiras 5 linhas atualizadas:")
        print(municipality_data.head())
        
    except Exception as e:
        print(f"Erro ao atualizar arquivo resumo: {e}")

if __name__ == "__main__":
    print("=== Script de Criação de CSV Resumo ===")
    print("1. Criação completa de resumos")
    print("2. Atualização do resumo existente")
    
    # Para automatizar, vamos executar a atualização do resumo existente
    # que é o que o usuário precisa neste momento
    update_existing_resume()
    
    print("\n=== Execução concluída ===")
