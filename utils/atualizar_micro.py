#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar a coluna MICRO no arquivo Data_2022.csv
com os dados da coluna _NM_MICRO do arquivo tabelaCana2022.csv
"""

import pandas as pd
import os

def atualizar_coluna_micro():
    """
    Atualiza a coluna MICRO no Data_2022.csv com dados do tabelaCana2022.csv
    """
    
    # Caminhos dos arquivos
    data_2022_path = "Data_2022.csv"
    tabela_cana_path = "tabelaCana2022.csv"
    
    # Verificar se os arquivos existem
    if not os.path.exists(data_2022_path):
        print(f"Erro: Arquivo {data_2022_path} não encontrado!")
        return
    
    if not os.path.exists(tabela_cana_path):
        print(f"Erro: Arquivo {tabela_cana_path} não encontrado!")
        return
    
    print("Carregando arquivos...")
    
    # Carregar os arquivos CSV
    try:
        df_data_2022 = pd.read_csv(data_2022_path)
        df_tabela_cana = pd.read_csv(tabela_cana_path)
    except Exception as e:
        print(f"Erro ao carregar arquivos: {e}")
        return
    
    print(f"Data_2022.csv: {len(df_data_2022)} linhas")
    print(f"tabelaCana2022.csv: {len(df_tabela_cana)} linhas")
    
    # Verificar as colunas necessárias
    if 'INDEX' not in df_data_2022.columns:
        print("Erro: Coluna 'INDEX' não encontrada em Data_2022.csv")
        return
    
    if 'MICRO' not in df_data_2022.columns:
        print("Erro: Coluna 'MICRO' não encontrada em Data_2022.csv")
        return
    
    if 'id' not in df_tabela_cana.columns:
        print("Erro: Coluna 'id' não encontrada em tabelaCana2022.csv")
        return
    
    if '_NM_MICRO' not in df_tabela_cana.columns:
        print("Erro: Coluna '_NM_MICRO' não encontrada em tabelaCana2022.csv")
        return
    
    # Criar dicionário de mapeamento id -> _NM_MICRO
    micro_mapping = dict(zip(df_tabela_cana['id'], df_tabela_cana['_NM_MICRO']))
    
    print(f"Criado mapeamento com {len(micro_mapping)} entradas")
    
    # Contadores para estatísticas
    atualizados = 0
    nao_encontrados = 0
    
    # Atualizar a coluna MICRO
    for index, row in df_data_2022.iterrows():
        id_valor = row['INDEX']
        
        if id_valor in micro_mapping:
            df_data_2022.at[index, 'MICRO'] = micro_mapping[id_valor]
            atualizados += 1
        else:
            nao_encontrados += 1
    
    print(f"\nResultados:")
    print(f"Registros atualizados: {atualizados}")
    print(f"Registros não encontrados: {nao_encontrados}")
    
    # Criar backup do arquivo original
    backup_path = "Data_2022_backup.csv"
    if not os.path.exists(backup_path):
        df_original = pd.read_csv(data_2022_path)
        df_original.to_csv(backup_path, index=False)
        print(f"Backup criado: {backup_path}")
    
    # Salvar o arquivo atualizado
    df_data_2022.to_csv(data_2022_path, index=False)
    print(f"Arquivo {data_2022_path} atualizado com sucesso!")
    
    # Mostrar algumas linhas como exemplo
    print("\nPrimeiras 5 linhas após atualização:")
    print(df_data_2022[['INDEX', 'MUNICIPIO', 'MESO', 'MICRO']].head())

if __name__ == "__main__":
    atualizar_coluna_micro()
