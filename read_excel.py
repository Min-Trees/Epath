import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_excel(r'D:\Job\Epath\Sitemap Epath.xlsx')
print(df.to_markdown(index=False))
