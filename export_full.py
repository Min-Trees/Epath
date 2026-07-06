import pandas as pd

df = pd.read_excel(r'D:\Job\Epath\Sitemap Epath.xlsx')

with open(r'D:\Job\Epath\Sitemap_Epath_Full.md', 'w', encoding='utf-8') as f:
    f.write('# EPATH EDUCATION SITEMAP - 2025\n\n')
    f.write('## Raw Data Export\n\n')
    f.write(df.to_markdown(index=True))
    f.write('\n\n---\n\n## Original Column Names\n\n')
    for i, col in enumerate(df.columns):
        f.write(f'- Column {i}: {col}\n')
    f.write(f'\nTotal rows: {len(df)}\n')
    f.write(f'Total columns: {len(df.columns)}\n')

print('Done! Full export saved to D:\\Job\\Epath\\Sitemap_Epath_Full.md')
