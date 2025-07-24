import pandas as pd
import numpy as np

def setHistoricalDFColTypes(df: pd.DataFrame):
    df              = df.copy()
    df["adj_close"] = pd.to_numeric(df["adj_close"]).round(decimals=2).replace({np.nan: None})
    df["close"]     = pd.to_numeric(df["close"]).round(decimals=2).replace({np.nan: None})
    df["open"]      = pd.to_numeric(df["open"]).round(decimals=2).replace({np.nan: None})
    df["high"]      = pd.to_numeric(df["high"]).round(decimals=2).replace({np.nan: None})
    df["low"]       = pd.to_numeric(df["low"]).round(decimals=2).replace({np.nan: None})
    df["vwap"]      = pd.to_numeric(df["vwap"]).round(decimals=2).replace({np.nan: None})
    df.columns      = [col.title() for col in df.columns]
    return df