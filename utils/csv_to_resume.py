#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script genérico para criar CSVs resumo a partir de CSVs detalhados
Equivalente ao treat.py original, mas para trabalhar com CSVs
"""

import pandas as pd
import os
import glob
import sys

def process_csv_to_resume(input_file, output_file=None):
    """
    Processa um arquivo CSV detalhado e cria um arquivo resumo
    
    Args:
        input_file (str): Caminho para o arquivo CSV de entrada
        output_file (str): Caminho para o arquivo de saída (opcional)
    """
    
    if not os.path.exists(input_file):
        print(f"Erro: Arquivo {input_file} não encontrado!")
        return False
    
    if output_file is None:
        # Gera nome automaticamente baseado no arquivo de entrada
        base_name = os.path.splitext(input_file)[0]
        output_file = f"{base_name}_Resume.csv"
    
    try:
        print(f"Processando {input_file}...")
        
        # Carrega o CSV
        df = pd.read_csv(input_file)
        print(f"Carregado CSV com {len(df)} linhas")
        
        # Define as colunas obrigatórias
        required_columns = ['AREA', 'COD_MUNICIPIO', 'MUNICIPIO', 'MESO', 'MICRO']
        
        # Verifica se todas as colunas necessárias existem
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"Erro: Colunas obrigatórias não encontradas: {missing_columns}")
            print(f"Colunas disponíveis: {list(df.columns)}")
            return False
        
        # Cria uma cópia com apenas as colunas necessárias
        df_work = df[required_columns].copy()
        
        # Preenche valores NaN ou vazios com "Não encontrado"
        df_work[required_columns] = df_work[required_columns].fillna("Não encontrado")
        
        # Converte AREA para numérico, tratando erros
        df_work['AREA'] = pd.to_numeric(df_work['AREA'], errors='coerce').fillna(0)
        
        # Agrupa por município e calcula estatísticas
        df_resume = df_work.groupby('MUNICIPIO').agg({
            'AREA': 'sum',
            'COD_MUNICIPIO': 'first',
            'MESO': 'first',
            'MICRO': 'first'
        }).reset_index()
        
        # Renomeia a coluna AREA para TOTAL_AREA
        df_resume.rename(columns={'AREA': 'TOTAL_AREA'}, inplace=True)
        
        # Reorganiza as colunas na ordem desejada
        df_resume = df_resume[['MUNICIPIO', 'TOTAL_AREA', 'COD_MUNICIPIO', 'MESO', 'MICRO']]
        
        # Ordena por município
        df_resume = df_resume.sort_values('MUNICIPIO')
        
        # Salva o arquivo
        df_resume.to_csv(output_file, index=False)
        
        # Exibe estatísticas
        print(f"\n✅ Arquivo {output_file} criado com sucesso!")
        print(f"📊 Estatísticas:")
        print(f"   • Municípios únicos: {len(df_resume)}")
        print(f"   • Área total: {df_resume['TOTAL_AREA'].sum():.2f} ha")
        
        # Estatísticas por mesorregião
        print(f"\n📍 Por mesorregião:")
        meso_stats = df_resume.groupby('MESO').agg({
            'MUNICIPIO': 'count',
            'TOTAL_AREA': 'sum'
        }).round(2)
        meso_stats.columns = ['Municípios', 'Área_Total']
        print(meso_stats.to_string())
        
        # Estatísticas por microrregião
        print(f"\n🏘️ Top 10 microrregiões por área:")
        micro_stats = df_resume.groupby('MICRO').agg({
            'MUNICIPIO': 'count',
            'TOTAL_AREA': 'sum'
        }).round(2).sort_values('TOTAL_AREA', ascending=False).head(10)
        micro_stats.columns = ['Municípios', 'Área_Total']
        print(micro_stats.to_string())
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao processar {input_file}: {e}")
        return False

def process_all_data_csvs():
    """
    Processa todos os arquivos Data_*.csv encontrados no diretório atual
    """
    
    # Procura por arquivos Data_*.csv
    pattern = 'Data_*.csv'
    csv_files = glob.glob(pattern)
    
    # Remove arquivos de resumo e backup da lista
    csv_files = [f for f in csv_files if '_Resume' not in f and '_backup' not in f]
    
    if not csv_files:
        print(f"❌ Nenhum arquivo encontrado com o padrão {pattern}!")
        return
    
    print(f"📁 Arquivos encontrados: {csv_files}")
    
    success_count = 0
    for csv_file in csv_files:
        if process_csv_to_resume(csv_file):
            success_count += 1
        print("-" * 50)
    
    print(f"\n🎉 Processamento concluído!")
    print(f"✅ {success_count}/{len(csv_files)} arquivos processados com sucesso")

def main():
    """
    Função principal com interface de linha de comando
    """
    
    print("=== Gerador de CSV Resumo ===")
    print("Baseado no treat.py original, adaptado para CSVs")
    print()
    
    if len(sys.argv) > 1:
        # Modo com argumentos de linha de comando
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        
        process_csv_to_resume(input_file, output_file)
    else:
        # Modo interativo/automático
        process_all_data_csvs()

if __name__ == "__main__":
    main()
